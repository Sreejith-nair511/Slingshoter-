export interface CalibrationMetrics {
  trustDeviation: number
  calibrationIndex: number
  calibrationLevel: 'balanced' | 'moderate' | 'high' | 'critical'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

export function calculateTrustDeviation(
  confidenceScore: number,
  reliabilityScore: number
): number {
  return Math.abs(confidenceScore - reliabilityScore)
}

export function calculateCalibrationIndex(trustDeviation: number): number {
  // Calibration Index: 100 = perfect, 0 = worst
  // Formula: 100 - (deviation * 2)
  return Math.max(0, Math.min(100, 100 - (trustDeviation * 2)))
}

export function getCalibrationLevel(trustDeviation: number): CalibrationMetrics['calibrationLevel'] {
  if (trustDeviation < 10) return 'balanced'
  if (trustDeviation < 25) return 'moderate'
  if (trustDeviation < 40) return 'high'
  return 'critical'
}

export function getRiskLevel(
  trustDeviation: number,
  reliabilityScore: number
): CalibrationMetrics['riskLevel'] {
  // Critical: High deviation OR low reliability
  if (trustDeviation > 30 || reliabilityScore < 50) return 'critical'
  
  // High: Moderate deviation OR moderate reliability
  if (trustDeviation > 20 || reliabilityScore < 65) return 'high'
  
  // Medium: Some deviation
  if (trustDeviation > 10 || reliabilityScore < 80) return 'medium'
  
  // Low: Well calibrated and reliable
  return 'low'
}

export function calculateMetrics(
  confidenceScore: number,
  reliabilityScore: number
): CalibrationMetrics {
  const trustDeviation = calculateTrustDeviation(confidenceScore, reliabilityScore)
  const calibrationIndex = calculateCalibrationIndex(trustDeviation)
  const calibrationLevel = getCalibrationLevel(trustDeviation)
  const riskLevel = getRiskLevel(trustDeviation, reliabilityScore)
  
  return {
    trustDeviation: Math.round(trustDeviation * 10) / 10,
    calibrationIndex: Math.round(calibrationIndex * 10) / 10,
    calibrationLevel,
    riskLevel,
  }
}

export function shouldTriggerNotification(
  trustDeviation: number,
  reliabilityScore: number,
  settings: { deviationThreshold: number; reliabilityMinimum: number }
): { shouldNotify: boolean; reason?: string; severity?: string } {
  if (trustDeviation > settings.deviationThreshold) {
    return {
      shouldNotify: true,
      reason: `Trust deviation (${trustDeviation.toFixed(1)}%) exceeds threshold (${settings.deviationThreshold}%)`,
      severity: trustDeviation > 30 ? 'critical' : 'warning',
    }
  }
  
  if (reliabilityScore < settings.reliabilityMinimum) {
    return {
      shouldNotify: true,
      reason: `Reliability score (${reliabilityScore.toFixed(1)}%) below minimum (${settings.reliabilityMinimum}%)`,
      severity: reliabilityScore < 50 ? 'critical' : 'warning',
    }
  }
  
  return { shouldNotify: false }
}
