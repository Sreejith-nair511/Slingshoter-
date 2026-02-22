'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types
export interface Analysis {
  id: string
  query: string
  model: string
  output: string
  confidenceScore: number
  reliabilityScore: number
  trustDeviation: number
  calibrationIndex: number
  verificationLatency: number
  createdAt: string
  claims: Claim[]
}

export interface Claim {
  id: string
  text: string
  confidence: number
  reliability: number
  verified: boolean
}

export interface Notification {
  id: string
  type: string
  severity: string
  message: string
  metadata?: any
  read: boolean
  createdAt: string
}

export interface Settings {
  id: string
  deviationThreshold: number
  reliabilityMinimum: number
  confidenceMinimum: number
}

export interface Metrics {
  summary: {
    totalAnalyses: number
    avgTrustDeviation: number
    avgVerificationLatency: number
    avgCalibrationIndex: number
    avgConfidence: number
    avgReliability: number
  }
  trend: Array<{
    timestamp: string
    trustDeviation: number
    calibrationIndex: number
    confidence: number
    reliability: number
    latency: number
  }>
  distribution: {
    balanced: number
    moderate: number
    high: number
    critical: number
  }
  timeframe: string
}

// API Functions
async function analyzeQuery(query: string) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to analyze query')
  }
  
  return response.json()
}

async function fetchAnalyses(limit = 10, offset = 0) {
  const response = await fetch(`/api/analyses?limit=${limit}&offset=${offset}`)
  if (!response.ok) throw new Error('Failed to fetch analyses')
  return response.json()
}

async function fetchNotifications(unreadOnly = false) {
  const response = await fetch(`/api/notifications?unreadOnly=${unreadOnly}`)
  if (!response.ok) throw new Error('Failed to fetch notifications')
  return response.json()
}

async function updateNotification(id: string, read: boolean) {
  const response = await fetch('/api/notifications', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, read }),
  })
  if (!response.ok) throw new Error('Failed to update notification')
  return response.json()
}

async function fetchSettings() {
  const response = await fetch('/api/settings')
  if (!response.ok) throw new Error('Failed to fetch settings')
  return response.json()
}

async function updateSettings(settings: Omit<Settings, 'id'>) {
  const response = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  })
  if (!response.ok) throw new Error('Failed to update settings')
  return response.json()
}

async function fetchMetrics(timeframe = '24h') {
  const response = await fetch(`/api/metrics?timeframe=${timeframe}`)
  if (!response.ok) throw new Error('Failed to fetch metrics')
  return response.json()
}

async function fetchAuditLogs(limit = 50, severity?: string) {
  const url = severity 
    ? `/api/audit-logs?limit=${limit}&severity=${severity}`
    : `/api/audit-logs?limit=${limit}`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch audit logs')
  return response.json()
}

// Hooks
export function useAnalyze() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: analyzeQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] })
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useAnalyses(limit = 10, offset = 0) {
  return useQuery({
    queryKey: ['analyses', limit, offset],
    queryFn: () => fetchAnalyses(limit, offset),
  })
}

export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: ['notifications', unreadOnly],
    queryFn: () => fetchNotifications(unreadOnly),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function useUpdateNotification() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => 
      updateNotification(id, read),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

export function useMetrics(timeframe = '24h') {
  return useQuery({
    queryKey: ['metrics', timeframe],
    queryFn: () => fetchMetrics(timeframe),
  })
}

export function useAuditLogs(limit = 50, severity?: string) {
  return useQuery({
    queryKey: ['auditLogs', limit, severity],
    queryFn: () => fetchAuditLogs(limit, severity),
  })
}
