import type { ReactNode } from 'react'
import { NodeProvider } from './node-context'
import { LinkProvider } from './link-context'

/**
 * NetworkProvider - Quản lý tập trung toàn bộ network data (nodes + links)
 * Wrap component root với provider này để có thể sử dụng useNodes() và useLinks() ở bất kỳ đâu
 */
export function NetworkProvider({ children }: { children: ReactNode }) {
  return (
    <NodeProvider>
      <LinkProvider>{children}</LinkProvider>
    </NodeProvider>
  )
}

// Re-export hooks để dễ import
export { useNodes } from './node-context'
export { useLinks } from './link-context'
export type { Node } from './node-context'
export type { Link } from './link-context'
