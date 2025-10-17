import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { SocketConnection } from '@/socket/socket'
import type { Socket } from 'socket.io-client'

export interface Node {
  _id?: string
  ip: string
  hostname?: string
  name?: string
  status?: 'UP' | 'DOWN'
  type?: string
  lat?: number
  lng?: number
  metrics?: {
    cpuLoad: number
    jitterMs: number
    queueLen: number
    throughputMbps: number
  }
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

interface NodeContextType {
  nodes: Node[]
  loading: boolean
  error: string | null
  getNodeByIp: (ip: string) => Node | undefined
  getNodesByHostname: (hostname: string) => Node[]
  searchNodes: (query: string) => Node[]
  refreshNodes: () => void
}

const NodeContext = createContext<NodeContextType | undefined>(undefined)

export function NodeProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const socket: Socket = SocketConnection.getInstance()

    const handleNodeUpdate = (data: any) => {
      setLoading(false)
      setNodes((prev) => {
        const existing = prev.find((n) => n.ip === data.ip)
        if (existing) {
          return prev.map((n) => (n.ip === data.ip ? { ...n, ...data } : n))
        } else {
          return [...prev, data]
        }
      })
    }

    const handleError = (err: any) => {
      setError(err?.message || 'Unknown error')
      setLoading(false)
    }

    socket.on('node-updated', handleNodeUpdate)
    socket.on('error', handleError)
    socket.emit('get-nodes')

    return () => {
      socket.off('node-updated', handleNodeUpdate)
      socket.off('error', handleError)
    }
  }, [])

  const getNodeByIp = (ip: string) => {
    return nodes.find((n) => n.ip === ip)
  }

  const getNodesByHostname = (hostname: string) => {
    return nodes.filter((n) => n.hostname === hostname)
  }

  const searchNodes = (query: string) => {
    const q = query.trim().toLowerCase()
    if (!q) return nodes

    return nodes.filter(
      (n) =>
        (n.hostname || '').toLowerCase().includes(q) ||
        (n.ip || '').toLowerCase().includes(q) ||
        (n.name || '').toLowerCase().includes(q)
    )
  }

  const refreshNodes = () => {
    setLoading(true)
    const socket: Socket = SocketConnection.getInstance()
    socket.emit('get-nodes')
  }

  return (
    <NodeContext.Provider
      value={{
        nodes,
        loading,
        error,
        getNodeByIp,
        getNodesByHostname,
        searchNodes,
        refreshNodes,
      }}
    >
      {children}
    </NodeContext.Provider>
  )
}

export function useNodes() {
  const context = useContext(NodeContext)
  if (context === undefined) {
    throw new Error('useNodes must be used within a NodeProvider')
  }
  return context
}
