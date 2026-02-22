import { Server as HTTPServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { redis } from './redis'

let wss: WebSocketServer | null = null

export function initializeWebSocket(server: HTTPServer) {
  if (wss) return wss
  
  wss = new WebSocketServer({ server, path: '/ws' })
  
  console.log('WebSocket server initialized')
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected')
    
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString())
        console.log('Received:', data)
        
        // Handle different message types
        if (data.type === 'subscribe') {
          // Subscribe to specific channels
          ws.send(JSON.stringify({
            type: 'subscribed',
            channels: data.channels || ['notifications', 'metrics'],
          }))
        }
      } catch (error) {
        console.error('WebSocket message error:', error)
      }
    })
    
    ws.on('close', () => {
      console.log('Client disconnected')
    })
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
    
    // Send initial connection message
    ws.send(JSON.stringify({
      type: 'connected',
      timestamp: new Date().toISOString(),
    }))
  })
  
  // Subscribe to Redis pub/sub for notifications
  const subscriber = redis.duplicate()
  subscriber.subscribe('notifications', 'metrics', (err) => {
    if (err) {
      console.error('Redis subscribe error:', err)
    } else {
      console.log('Subscribed to Redis channels')
    }
  })
  
  subscriber.on('message', (channel, message) => {
    console.log(`Broadcasting ${channel} message to clients`)
    
    // Broadcast to all connected clients
    wss?.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: channel,
          data: JSON.parse(message),
          timestamp: new Date().toISOString(),
        }))
      }
    })
  })
  
  return wss
}

export function broadcastToClients(type: string, data: any) {
  if (!wss) return
  
  const message = JSON.stringify({
    type,
    data,
    timestamp: new Date().toISOString(),
  })
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

export function getWebSocketServer() {
  return wss
}
