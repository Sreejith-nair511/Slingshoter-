export interface DashboardData {
  output: {
    title: string;
    output: string;
    confidence: number;
    verified: boolean;
    timestamp: string;
  };
  metrics: {
    systemConfidence: number;
    calibrationScore: number;
    reliabilityIndex: number;
  };
  risk: {
    deviationScore: number;
    riskItems: Array<{
      id: string;
      category: string;
      riskLevel: 'low' | 'medium' | 'high';
      description: string;
    }>;
  };
  evidence: Array<{
    title: string;
    evidence: string;
    confidence: number;
    type: 'verified' | 'uncertain' | 'warning';
    timestamp: string;
  }>;
}

export function getSampleDashboardData(): DashboardData {
  // Use static reference time to avoid hydration mismatches
  const referenceTime = '06:22 PM';
  const timeAgo = (minutes: number) => {
    // Calculate static times based on reference
    const offsetMinutes = 2 - minutes;
    const hours = 18;
    const baseMinutes = 22;
    const totalMinutes = hours * 60 + baseMinutes - minutes * 60;
    const displayHours = Math.floor(totalMinutes / 60) % 24;
    const displayMinutes = totalMinutes % 60;
    const displayHour12 = displayHours % 12 || 12;
    const period = displayHours >= 12 ? 'PM' : 'AM';
    return `${displayHour12}:${displayMinutes.toString().padStart(2, '0')} ${period}`;
  };

  return {
    output: {
      title: 'Network Threat Classification',
      output:
        'Detected potential advanced persistent threat (APT) signature matching patterns from C2 communication protocol. Classified as HIGH severity with 87% confidence based on behavioral analysis and known indicators of compromise.',
      confidence: 87,
      verified: true,
      timestamp: `Generated ${referenceTime} ago`,
    },
    metrics: {
      systemConfidence: 84,
      calibrationScore: 92,
      reliabilityIndex: 1.23,
    },
    risk: {
      deviationScore: 18.5,
      riskItems: [
        {
          id: 'r1',
          category: 'Model Uncertainty',
          riskLevel: 'high',
          description: 'Output confidence (87%) deviates significantly from calibration baseline (78%)',
        },
        {
          id: 'r2',
          category: 'Data Drift',
          riskLevel: 'medium',
          description: 'Input features show 12% distribution shift from training data',
        },
        {
          id: 'r3',
          category: 'Ensemble Disagreement',
          riskLevel: 'low',
          description: 'Sub-model predictions vary by 8% - within acceptable range',
        },
      ],
    },
    evidence: [
      {
        title: 'Binary Analysis Match',
        evidence:
          'Compiled executable contains 23 indicators matching known malware family signatures in threat intelligence database.',
        confidence: 94,
        type: 'verified',
        timestamp: '06:17 PM',
      },
      {
        title: 'Behavioral Anomaly Detected',
        evidence:
          'Process spawning patterns and registry modifications align with observed APT2 campaign tactics from Q4 2024.',
        confidence: 76,
        type: 'uncertain',
        timestamp: '06:19 PM',
      },
      {
        title: 'C2 Communication Pattern',
        evidence:
          'Network traffic exhibits domain flux behavior and DNS tunneling characteristics inconsistent with legitimate software.',
        confidence: 81,
        type: 'verified',
        timestamp: '06:21 PM',
      },
      {
        title: 'False Positive Risk',
        evidence:
          'Observed behavior also present in 3% of benign samples - insufficient data to rule out benign variants.',
        confidence: 45,
        type: 'warning',
        timestamp: '06:22 PM',
      },
    ],
  };
}

export function getInterventionData(): DashboardData {
  const baseData = getSampleDashboardData();
  return {
    ...baseData,
    output: {
      ...baseData.output,
      confidence: 62,
      verified: false,
    },
    metrics: {
      systemConfidence: 65,
      calibrationScore: 78,
      reliabilityIndex: 0.89,
    },
    risk: {
      deviationScore: 28.3,
      riskItems: [
        {
          id: 'r1',
          category: 'Manual Override Applied',
          riskLevel: 'high',
          description: 'System output overridden by human reviewer - confidence reduced pending review',
        },
        {
          id: 'r2',
          category: 'Conflicting Evidence',
          riskLevel: 'high',
          description: 'New evidence contradicts initial assessment - system recalibrating',
        },
        {
          id: 'r3',
          category: 'Model Uncertainty',
          riskLevel: 'medium',
          description: 'Intervention mode active - automated decision-making suspended',
        },
      ],
    },
  };
}
