import { useState, type JSX } from 'react'
import * as THREE from 'three'
import type { Node } from './types'
import { latLngToVector3 } from './utils'

interface NodeMarkersProps {
  nodes: Node[]
  onNodeClick: (node: Node) => void
  markersGroupRef: React.RefObject<THREE.Group>
}

export function NodeMarkers({ nodes, onNodeClick, markersGroupRef }: NodeMarkersProps): JSX.Element {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  return (
    <group ref={markersGroupRef}>
      {nodes.map((node) => {
        if (typeof node.lat !== 'number' || typeof node.lng !== 'number') return null
        const position = latLngToVector3(node.lat, node.lng, 3.05)
        const isHovered = hoveredNode === node.ip

        return (
          <mesh
            key={node.ip}
            position={position}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredNode(node.ip)
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              setHoveredNode(null)
            }}
            onClick={(e) => {
              e.stopPropagation()
              onNodeClick(node)
            }}
          >
            <sphereGeometry args={[isHovered ? 0.03 : 0.02, 16, 16]} />
            <meshBasicMaterial color={isHovered ? '#ffff00' : '#ff0000'} />
          </mesh>
        )
      })}
    </group>
  )
}
