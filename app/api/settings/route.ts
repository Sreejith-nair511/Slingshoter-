import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const SettingsSchema = z.object({
  deviationThreshold: z.number().min(0).max(100),
  reliabilityMinimum: z.number().min(0).max(100),
  confidenceMinimum: z.number().min(0).max(100),
})

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst()
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          deviationThreshold: 15.0,
          reliabilityMinimum: 70.0,
          confidenceMinimum: 60.0,
        },
      })
    }
    
    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Fetch Settings Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = SettingsSchema.parse(body)
    
    let settings = await prisma.settings.findFirst()
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: validated,
      })
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: validated,
      })
    }
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'settings_updated',
        resource: 'Settings',
        severity: 'info',
        metadata: validated,
      },
    })
    
    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Update Settings Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid settings data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
