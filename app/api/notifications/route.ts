import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    
    const notifications = await prisma.notification.findMany({
      where: unreadOnly ? { read: false } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    
    return NextResponse.json({
      success: true,
      data: notifications,
    })
  } catch (error) {
    console.error('Fetch Notifications Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, read } = body
    
    const notification = await prisma.notification.update({
      where: { id },
      data: { read },
    })
    
    return NextResponse.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    console.error('Update Notification Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}
