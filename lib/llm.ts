import Groq from 'groq-sdk'
import { z } from 'zod'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Zod schema for LLM response
const ClaimSchema = z.object({
  text: z.string(),
  confidence: z.number().min(0).max(100),
})

const AnalysisResponseSchema = z.object({
  answer: z.string(),
  claims: z.array(ClaimSchema),
  overallConfidence: z.number().min(0).max(100),
})

export type ClaimType = z.infer<typeof ClaimSchema>
export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>

export async function analyzeQuery(query: string): Promise<AnalysisResponse> {
  try {
    const prompt = `You are an AI assistant that provides answers and analyzes your own confidence.

User Query: "${query}"

Please respond with a JSON object containing:
1. "answer": Your detailed answer to the query
2. "claims": An array of atomic factual claims from your answer, each with:
   - "text": The claim statement
   - "confidence": Your confidence in this claim (0-100)
3. "overallConfidence": Your overall confidence in the complete answer (0-100)

Be honest about uncertainty. Extract 3-7 key factual claims.

Example format:
{
  "answer": "The Eiffel Tower is 330 meters tall...",
  "claims": [
    {"text": "The Eiffel Tower is 330 meters tall", "confidence": 95},
    {"text": "It was completed in 1889", "confidence": 98}
  ],
  "overallConfidence": 92
}

Respond ONLY with valid JSON.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a precise AI assistant that provides structured JSON responses with confidence scores.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from Groq')
    }

    const parsed = JSON.parse(content)
    const validated = AnalysisResponseSchema.parse(parsed)

    return validated
  } catch (error) {
    console.error('LLM Analysis Error:', error)
    throw new Error('Failed to analyze query with LLM')
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  // For now, return a simple hash-based embedding
  // In production, you'd use a proper embedding model
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0)
  }, 0)
  
  // Generate a 384-dimensional vector
  const embedding = new Array(384).fill(0).map((_, i) => {
    return Math.sin(hash + i) * 0.5 + 0.5
  })
  
  return embedding
}
