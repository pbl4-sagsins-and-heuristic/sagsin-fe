import { useEffect, useState } from 'react'
import { SocketConnection } from '@/socket/socket'
import type { Socket } from 'socket.io-client'
import type { Node } from './types'

export function useNodeData() {
    const [nodes, setNodes] = useState<Node[]>([])

    useEffect(() => {
        const socket: Socket = SocketConnection.getInstance()

        const handleNodeUpdate = (data: any) => {
            setNodes((prev) => {
                const existing = prev.find((n) => n.ip === data.ip)
                if (existing) {
                    return prev.map((n) => (n.ip === data.ip ? data : n))
                } else {
                    return [...prev, data]
                }
            })
        }

        socket.on('node-updated', handleNodeUpdate)
        socket.emit('get-nodes')

        return () => {
            socket.off('node-updated', handleNodeUpdate)
        }
    }, [])

    return { nodes }
}
