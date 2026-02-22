from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Optional
import redis
import json
import hashlib
from langdetect import detect, LangDetectException
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Trust Calibration Verification Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models
print("Loading embedding model...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded successfully!")

# Redis connection
redis_client = None
try:
    redis_client = redis.Redis(
        host=os.getenv('REDIS_HOST', 'localhost'),
        port=int(os.getenv('REDIS_PORT', 6379)),
        db=0,
        decode_responses=True
    )
    redis_client.ping()
    print("Redis connected successfully!")
except Exception as e:
    print(f"Redis connection failed: {e}")
    redis_client = None

# Knowledge base with multilingual support
KNOWLEDGE_BASE = {
    'en': [
        "The Eiffel Tower is 330 meters tall",
        "Paris is the capital of France",
        "Water boils at 100 degrees Celsius at sea level",
        "The Earth orbits around the Sun",
        "JavaScript was created by Brendan Eich in 1995",
        "Python is a high-level programming language",
        "The speed of light is approximately 299,792 kilometers per second",
        "DNA stands for Deoxyribonucleic Acid",
        "The Great Wall of China is over 21,000 kilometers long",
        "Mount Everest is the highest mountain on Earth at 8,849 meters",
    ],
    'hi': [
        "एफिल टावर 330 मीटर ऊंचा है",
        "पेरिस फ्रांस की राजधानी है",
    ],
    'es': [
        "La Torre Eiffel mide 330 metros de altura",
        "París es la capital de Francia",
    ],
    'fr': [
        "La Tour Eiffel mesure 330 mètres de haut",
        "Paris est la capitale de la France",
    ],
    'de': [
        "Der Eiffelturm ist 330 Meter hoch",
        "Paris ist die Hauptstadt von Frankreich",
    ]
}

# Cache embeddings
knowledge_embeddings = {}

def get_knowledge_embeddings(language: str):
    """Get or compute knowledge base embeddings for a language"""
    if language not in knowledge_embeddings:
        texts = KNOWLEDGE_BASE.get(language, KNOWLEDGE_BASE['en'])
        knowledge_embeddings[language] = embedding_model.encode(texts)
    return knowledge_embeddings[language]

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Calculate cosine similarity between two vectors"""
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def detect_language(text: str) -> str:
    """Detect language of text"""
    try:
        lang = detect(text)
        # Map to supported languages
        if lang in ['en', 'hi', 'es', 'fr', 'de']:
            return lang
        return 'en'  # Default to English
    except LangDetectException:
        return 'en'

def check_contradictions(claims: List[str], embeddings: np.ndarray) -> List[dict]:
    """Check for contradictions between claims"""
    contradictions = []
    
    for i in range(len(claims)):
        for j in range(i + 1, len(claims)):
            similarity = cosine_similarity(embeddings[i], embeddings[j])
            
            # High similarity but different claims might indicate contradiction
            if 0.7 < similarity < 0.95:
                contradictions.append({
                    'claim1': claims[i],
                    'claim2': claims[j],
                    'similarity': round(similarity, 3),
                    'type': 'potential_contradiction'
                })
    
    return contradictions

def get_cache_key(claims: List[str], language: str) -> str:
    """Generate cache key for claims"""
    content = json.dumps({'claims': claims, 'language': language}, sort_keys=True)
    return f"verification:{hashlib.md5(content.encode()).hexdigest()}"

class Claim(BaseModel):
    text: str
    confidence: float = Field(ge=0, le=100)

class VerificationRequest(BaseModel):
    claims: List[Claim]
    language: Optional[str] = 'en'

class ClaimResult(BaseModel):
    text: str
    confidence: float
    reliability: float
    verified: bool
    evidence: List[str]
    embedding: Optional[List[float]] = None

class VerificationResponse(BaseModel):
    claims: List[ClaimResult]
    overallReliability: float
    overallConfidence: float
    language: str
    contradictions: List[dict]
    processingTime: float

@app.get("/")
async def root():
    return {
        "service": "Trust Calibration Verification Service",
        "version": "1.0.0",
        "status": "operational",
        "redis": "connected" if redis_client else "disconnected"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model": "all-MiniLM-L6-v2",
        "redis": redis_client is not None
    }

@app.post("/verify", response_model=VerificationResponse)
async def verify_claims(request: VerificationRequest):
    """
    Verify claims using semantic similarity and contradiction detection
    """
    import time
    start_time = time.time()
    
    try:
        # Detect language if not provided
        if not request.language or request.language == 'auto':
            if request.claims:
                request.language = detect_language(request.claims[0].text)
        
        # Check cache
        cache_key = get_cache_key([c.text for c in request.claims], request.language)
        if redis_client:
            try:
                cached = redis_client.get(cache_key)
                if cached:
                    print(f"Cache hit for {cache_key}")
                    cached_data = json.loads(cached)
                    return VerificationResponse(**cached_data)
            except Exception as e:
                print(f"Cache read error: {e}")
        
        # Extract claim texts
        claim_texts = [claim.text for claim in request.claims]
        
        # Generate embeddings for claims
        claim_embeddings = embedding_model.encode(claim_texts)
        
        # Get knowledge base embeddings
        knowledge_embs = get_knowledge_embeddings(request.language)
        knowledge_texts = KNOWLEDGE_BASE.get(request.language, KNOWLEDGE_BASE['en'])
        
        # Verify each claim
        results = []
        total_reliability = 0
        total_confidence = 0
        
        for idx, claim in enumerate(request.claims):
            claim_emb = claim_embeddings[idx]
            
            # Find similar knowledge base items
            similarities = []
            for kb_idx, kb_emb in enumerate(knowledge_embs):
                sim = cosine_similarity(claim_emb, kb_emb)
                if sim > 0.6:  # Relevance threshold
                    similarities.append({
                        'text': knowledge_texts[kb_idx],
                        'score': sim
                    })
            
            # Sort by similarity
            similarities.sort(key=lambda x: x['score'], reverse=True)
            
            # Calculate reliability
            if not similarities:
                # No evidence - penalize
                reliability = max(0, claim.confidence - 25)
                verified = False
            else:
                # Evidence found - boost reliability
                avg_similarity = sum(s['score'] for s in similarities) / len(similarities)
                evidence_boost = avg_similarity * 100
                reliability = min(100, (claim.confidence * 0.3) + (evidence_boost * 0.7))
                verified = avg_similarity > 0.85
            
            results.append(ClaimResult(
                text=claim.text,
                confidence=claim.confidence,
                reliability=round(reliability, 1),
                verified=verified,
                evidence=[s['text'] for s in similarities[:3]],
                embedding=claim_emb.tolist()
            ))
            
            total_reliability += reliability
            total_confidence += claim.confidence
        
        # Calculate overall scores
        num_claims = len(request.claims)
        overall_reliability = round(total_reliability / num_claims, 1) if num_claims > 0 else 0
        overall_confidence = round(total_confidence / num_claims, 1) if num_claims > 0 else 0
        
        # Check for contradictions
        contradictions = check_contradictions(claim_texts, claim_embeddings)
        
        # Adjust reliability if contradictions found
        if contradictions:
            penalty = min(15, len(contradictions) * 5)
            overall_reliability = max(0, overall_reliability - penalty)
        
        processing_time = round((time.time() - start_time) * 1000, 2)
        
        response = VerificationResponse(
            claims=results,
            overallReliability=overall_reliability,
            overallConfidence=overall_confidence,
            language=request.language,
            contradictions=contradictions,
            processingTime=processing_time
        )
        
        # Cache result
        if redis_client:
            try:
                redis_client.setex(
                    cache_key,
                    3600,  # 1 hour TTL
                    json.dumps(response.model_dump())
                )
            except Exception as e:
                print(f"Cache write error: {e}")
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

@app.post("/embeddings")
async def generate_embeddings(texts: List[str]):
    """Generate embeddings for texts"""
    try:
        embeddings = embedding_model.encode(texts)
        return {
            "embeddings": embeddings.tolist(),
            "dimension": embeddings.shape[1],
            "count": len(texts)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
