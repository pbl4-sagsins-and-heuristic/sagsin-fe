import { useNodes } from '@/contexts/network-context'

export function useNodeData() {
    const { nodes } = useNodes()
    return { nodes }
}