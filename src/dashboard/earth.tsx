import { useState, type JSX } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EarthSphere } from '@/components/earth/earth-sphere'
import { NodeDetailSheet } from '@/components/earth/node-detail-sheet'
import { useNodeData } from '@/components/earth/use-node-data'
import type { Node } from '@/components/earth/types'

export default function Earth(): JSX.Element {
  const { nodes } = useNodeData()
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node)
    setIsSheetOpen(true)
  }

  return (
    <>
      <div style={{ width: '100%', height: '100%' }}>
        <Canvas camera={{ position: [0, 0, 6.5], fov: 65 }}>
          {/* Lights: sáng đều khắp nơi */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 3, 5]} intensity={1.5} color={0xffffff} />
          <directionalLight position={[-5, -3, -5]} intensity={1.5} color={0xffffff} />
          <pointLight position={[0, 5, 0]} intensity={0.8} />
          <pointLight position={[0, -5, 0]} intensity={0.8} />

          {/* Stars */}
          <Stars radius={120} depth={60} count={4000} factor={4} fade />

          {/* Earth */}
          <EarthSphere nodes={nodes} onNodeClick={handleNodeClick} />

          {/* Controls: chỉ quay khi kéo chuột */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            rotateSpeed={0.6}
            autoRotate={false}
          />
        </Canvas>
      </div>

      {/* Sheet hiển thị Node Detail */}
      <NodeDetailSheet 
        isOpen={isSheetOpen} 
        onOpenChange={setIsSheetOpen}
        node={selectedNode}
      />
    </>
  )
}
