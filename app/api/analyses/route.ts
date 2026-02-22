import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const analyses = await prisma.analysis.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        claims: true,
      },
    })
    
    const total = await prisma.analysis.count()
    
    return NextResponse.json({
      success: true,
      data: analyses,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Fetch Analyses Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}
