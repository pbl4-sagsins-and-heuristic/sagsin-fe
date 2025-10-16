export interface Node {
    ip: string
    hostname?: string
    lat?: number
    lng?: number
    _id?: string
    name?: string
    status?: 'UP' | 'DOWN'
    type?: string
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

export interface EarthSphereProps {
    nodes: Node[]
    onNodeClick: (node: Node) => void
}
