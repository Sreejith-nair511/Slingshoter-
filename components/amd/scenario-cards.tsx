'use client'

import { Zap, Activity, Shield, Gauge } from 'lucide-react'

interface ScenarioCard {
  title: string
  description: string
  query: string
  icon: React.ReactNode
  color: string
}

const scenarios: ScenarioCard[] = [
  {
    title: 'Real-Time Edge Inference Analysis',
    description: 'Test AI model calibration under edge deployment constraints',
    query: 'Analyze the reliability of autonomous vehicle decision-making systems in real-time edge scenarios',
    icon: <Zap size={24} />,
    color: 'from-blue-600 to-blue-700',
  },
  {
    title: 'High-Throughput AI Benchmark Evaluation',
    description: 'Evaluate trust metrics under sustained high-volume workloads',
    query: 'Assess the confidence calibration of large language models processing 10,000 queries per second',
    icon: <Activity size={24} />,
    color: 'from-emerald-600 to-emerald-700',
  },
  {
    title: 'GPU-Accelerated Model Trust Audit',
    description: 'Deep verification of model outputs using parallel processing',
    query: 'Perform comprehensive trust audit on medical diagnosis AI with GPU acceleration',
    icon: <Shield size={24} />,
    color: 'from-purple-600 to-purple-700',
  },
  {
    title: 'Low-Latency AI Response Validation',
    description: 'Sub-millisecond trust verification for critical applications',
    query: 'Validate financial trading AI decisions with sub-5ms latency requirements',
    icon: <Gauge size={24} />,
    color: 'from-amber-600 to-amber-700',
  },
]

interface ScenarioCardsProps {
  onRunScenario: (query: string) => void
  disabled?: boolean
}

export function ScenarioCards({ onRunScenario, disabled }: ScenarioCardsProps) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">AMD Optimized Calibration Scenarios</h3>
        <p className="text-sm text-zinc-400">Hardware-aware trust analysis demonstrations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-all group"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${scenario.color} flex items-center justify-center mb-3 text-white`}>
              {scenario.icon}
            </div>
            
            <h4 className="text-white font-semibold text-sm mb-2 leading-tight">
              {scenario.title}
            </h4>
            
            <p className="text-zinc-400 text-xs mb-4 leading-relaxed">
              {scenario.description}
            </p>
            
            <button
              onClick={() => onRunScenario(scenario.query)}
              disabled={disabled}
              className="w-full px-3 py-2 bg-zinc-800 text-zinc-300 rounded text-xs font-semibold hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-zinc-700"
            >
              Run Scenario
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
