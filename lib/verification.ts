import { generateEmbedding } from './llm'

// Simple knowledge base for verification
// In production, this would be a vector database
const knowledgeBase = [
  { text: 'The Eiffel Tower is 330 meters tall', embedding: null as number[] | null },
  { text: 'Paris is the capital of France', embedding: null as number[] | null },
  { text: 'Water boils at 100 degrees Celsius at sea level', embedding: null as number[] | null },
  { text: 'The Earth orbits around the Sun', embedding: null as number[] | null },
  { text: 'JavaScript was created by Brendan Eich in 1995', embedding: null as number[] | null },
]

// Cosine similarity function
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export interface VerificationResult {
  text: string
  reliability: number
  verified: boolean
  evidence: string[]
}

export async function verifyClaim(claimText: string, confidence: number): Promise<VerificationResult> {
  try {
    // Generate embedding for the claim
    const claimEmbedding = await generateEmbedding(claimText)
    
    // Find similar claims in knowledge base
    const similarities: { text: string; score: number }[] = []
    
    for (const item of knowledgeBase) {
      // Generate embeddings for knowledge base items if not cached
      if (!item.embedding) {
        item.embedding = await generateEmbedding(item.text)
      }
      
      const similarity = cosineSimilarity(claimEmbedding, item.embedding)
      if (similarity > 0.7) { // Threshold for relevance
        similarities.push({ text: item.text, score: similarity })
      }
    }
    
    // Sort by similarity
    similarities.sort((a, b) => b.score - a.score)
    
    // Calculate reliability based on evidence
    let reliability: number
    let verified: boolean
    
    if (similarities.length === 0) {
      // No evidence found - use confidence with penalty
      reliability = Math.max(0, confidence - 20)
      verified = false
    } else {
      // Evidence found - boost reliability
      const avgSimilarity = similarities.reduce((sum, s) => sum + s.score, 0) / similarities.length
      const evidenceBoost = avgSimilarity * 100
      reliability = Math.min(100, (confidence * 0.4) + (evidenceBoost * 0.6))
      verified = avgSimilarity > 0.85
    }
    
    return {
      text: claimText,
      reliability: Math.round(reliability * 10) / 10,
      verified,
      evidence: similarities.slice(0, 3).map(s => s.text),
    }
  } catch (error) {
    console.error('Verification Error:', error)
    // Fallback: return confidence with penalty
    return {
      text: claimText,
      reliability: Math.max(0, confidence - 30),
      verified: false,
      evidence: [],
    }
  }
}

export async function verifyAllClaims(
  claims: Array<{ text: string; confidence: number }>
): Promise<VerificationResult[]> {
  const results = await Promise.all(
    claims.map(claim => verifyClaim(claim.text, claim.confidence))
  )
  
  return results
}
