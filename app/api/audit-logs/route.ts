import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const severity = searchParams.get('severity')
    
    const auditLogs = await prisma.auditLog.findMany({
      where: severity ? { severity } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    
    return NextResponse.json({
      success: true,
      data: auditLogs,
    })
  } catch (error) {
    console.error('Fetch Audit Logs Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
