import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from Supabase
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get analytics data from Supabase
    const { data: analyses } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    const totalAnalyses = analyses?.length || 0
    const avgDeviation = analyses?.reduce((sum, a) => sum + a.trust_deviation, 0) / totalAnalyses || 0
    const avgConfidence = analyses?.reduce((sum, a) => sum + a.confidence_score, 0) / totalAnalyses || 0

    return NextResponse.json({
      success: true,
      data: {
        totalAnalyses,
        avgDeviation: parseFloat(avgDeviation.toFixed(2)),
        avgConfidence: parseFloat(avgConfidence.toFixed(2)),
        recentAnalyses: analyses?.slice(0, 10) || [],
      },
    })
  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
