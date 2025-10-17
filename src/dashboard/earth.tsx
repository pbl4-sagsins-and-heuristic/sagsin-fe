import { useState, useRef, type JSX } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router'
import { EarthSphere } from '@/components/earth/earth-sphere'
import { LinkCurves } from '@/components/earth/link-curves'
import { HoverInfo } from '@/components/earth/hover-info'
import { useNodeData } from '@/components/earth/use-node-data'
import { useLinks } from '@/contexts/network-context'
import type { Node } from '@/components/earth/types'
import type { Link } from '@/contexts/link-context'

export default function Earth(): JSX.Element {
  const { nodes } = useNodeData()
  const { links } = useLinks()
  const earthRef = useRef<THREE.Mesh>(null)
  const navigate = useNavigate()
  
  // Hover state
  const [hoverInfo, setHoverInfo] = useState<{
    x: number
    y: number
    name: string
    isVisible: boolean
  }>({
    x: 0,
    y: 0,
    name: '',
    isVisible: false,
  })

  const handleNodeClick = (node: Node) => {
    // Điều hướng đến nodes-management với search query
    const displayName = node.name || node.hostname || node.ip
    navigate(`/nodes-management?search=${encodeURIComponent(displayName)}`)
  }

  const handleNodeHover = (node: Node | null, event?: PointerEvent) => {
    if (node && event) {
      const displayName = node.name || node.hostname || node.ip
      setHoverInfo({
        x: event.clientX + 10,
        y: event.clientY + 10,
        name: displayName,
        isVisible: true,
      })
    } else {
      setHoverInfo(prev => ({ ...prev, isVisible: false }))
    }
  }

  const handleLinkClick = (link: Link) => {
    // Điều hướng đến links-management với source và dest queries
    const srcName = link.srcNode || link.srcIp || ''
    const destName = link.destNode || link.destIp || ''
    navigate(`/links-management?src=${encodeURIComponent(srcName)}&dest=${encodeURIComponent(destName)}`)
  }

  const handleLinkHover = (link: Link | null, event?: PointerEvent) => {
    if (link && event) {
      const srcName = link.srcNode || link.srcIp || ''
      const destName = link.destNode || link.destIp || ''
      setHoverInfo({
        x: event.clientX + 10,
        y: event.clientY + 10,
        name: `${srcName} → ${destName}`,
        isVisible: true,
      })
    } else {
      setHoverInfo(prev => ({ ...prev, isVisible: false }))
    }
  }

  return (
    <>
      {/* Hover Info Overlay */}
      <HoverInfo
        x={hoverInfo.x}
        y={hoverInfo.y}
        name={hoverInfo.name}
        isVisible={hoverInfo.isVisible}
      />

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
          <EarthSphere 
            nodes={nodes} 
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            earthRef={earthRef} 
          />

          {/* Link Curves - Đường nối giữa các nodes */}
          <LinkCurves 
            nodes={nodes} 
            links={links} 
            earthRef={earthRef}
            onLinkClick={handleLinkClick}
            onLinkHover={handleLinkHover}
          />

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
    </>
  )
}