import type { JSX } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { NodeDetail } from '@/components/nodes/node-detail'
import type { Node } from './types'

interface NodeDetailSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  node: Node | null
}

export function NodeDetailSheet({ isOpen, onOpenChange, node }: NodeDetailSheetProps): JSX.Element {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[540px] lg:w-[640px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Node Details</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          {node && (
            <NodeDetail
              node={{
                _id: node._id || node.ip,
                ip: node.ip,
                hostname: node.hostname || 'Unknown',
                name: node.name || node.hostname || 'Unknown Node',
                status: node.status || 'UP',
                type: node.type || 'unknown',
                metrics: node.metrics,
                createdAt: node.createdAt,
                updatedAt: node.updatedAt,
              }}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
