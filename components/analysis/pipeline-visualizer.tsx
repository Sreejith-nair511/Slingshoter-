'use client'

import { useEffect, useState } from 'react'
import { Check, Loader2, Clock } from 'lucide-react'

export type PipelineStage = 
  | 'idle'
  | 'query_received'
  | 'groq_inference'
  | 'claims_extracted'
  | 'verification'
  | 'deviation_calculated'
  | 'saved_to_db'
  | 'complete'

interface PipelineStep {
  id: PipelineStage
  label: string
  status: 'pending' | 'active' | 'complete'
  duration?: number
}

interface PipelineVisualizerProps {
  currentStage: PipelineStage
  stageDurations: Record<string, number>
}

export function PipelineVisualizer({ currentStage, stageDurations }: PipelineVisualizerProps) {
  const stages: PipelineStep[] = [
    { id: 'query_received', label: 'Query Received', status: 'pending' },
    { id: 'groq_inference', label: 'Groq Inference Running', status: 'pending' },
    { id: 'claims_extracted', label: 'Claims Extracted', status: 'pending' },
    { id: 'verification', label: 'Verification Processing', status: 'pending' },
    { id: 'deviation_calculated', label: 'Trust Deviation Calculated', status: 'pending' },
    { id: 'saved_to_db', label: 'Saved to Database', status: 'pending' },
  ]

  const getStageStatus = (stageId: PipelineStage): 'pending' | 'active' | 'complete' => {
    const stageOrder = stages.map(s => s.id)
    const currentIndex = stageOrder.indexOf(currentStage)
    const stageIndex = stageOrder.indexOf(stageId)

    if (currentStage === 'complete') return 'complete'
    if (stageIndex < currentIndex) return 'complete'
    if (stageIndex === currentIndex) return 'active'
    return 'pending'
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Pipeline Execution</h3>
      
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id)
          const duration = stageDurations[stage.id]

          return (
            <div key={stage.id} className="flex items-center gap-4">
              {/* Status Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                status === 'complete' ? 'bg-emerald-500' :
                status === 'active' ? 'bg-blue-500' :
                'bg-zinc-700'
              }`}>
                {status === 'complete' && <Check size={16} className="text-white" />}
                {status === 'active' && <Loader2 size={16} className="text-white animate-spin" />}
                {status === 'pending' && <span className="text-white text-sm">{index + 1}</span>}
              </div>

              {/* Stage Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${
                    status === 'complete' ? 'text-emerald-400' :
                    status === 'active' ? 'text-blue-400' :
                    'text-zinc-500'
                  }`}>
                    {stage.label}
                  </p>
                  {duration && (
                    <div className="flex items-center gap-1 text-zinc-400 text-sm">
                      <Clock size={12} />
                      <span>{duration}ms</span>
                    </div>
                  )}
                </div>
                
                {/* Progress Bar */}
                {status === 'active' && (
                  <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {currentStage === 'complete' && (
        <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-900/30 rounded-lg">
          <p className="text-emerald-400 text-sm flex items-center gap-2">
            <Check size={14} />
            Pipeline completed successfully
          </p>
        </div>
      )}
    </div>
  )
}
