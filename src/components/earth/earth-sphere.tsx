import { useRef, useState, type JSX } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import type { EarthSphereProps } from './types'
import { latLngToVector3 } from './utils'

export function EarthSphere({ nodes, onNodeClick }: EarthSphereProps): JSX.Element {
  const earthRef = useRef<THREE.Mesh | null>(null)
  const cloudsRef = useRef<THREE.Mesh | null>(null)
  const markersGroupRef = useRef<THREE.Group | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Textures 8K chất lượng cao từ local
  const [colorMap, nightMap, cloudsMap] = useLoader(TextureLoader, [
    '/texture/8k_earth_daymap.jpg',
    '/texture/8k_earth_nightmap.jpg',
    '/texture/8k_earth_clouds.jpg',
  ])

  useFrame(() => {
    // Đồng bộ rotation của markers với Earth để markers luôn gắn vào đúng vị trí
    if (earthRef.current && markersGroupRef.current) {
      markersGroupRef.current.rotation.copy(earthRef.current.rotation)
    }
    if (earthRef.current && cloudsRef.current) {
      cloudsRef.current.rotation.copy(earthRef.current.rotation)
    }
  })

  return (
    <>
      {/* Clouds layer */}
      <mesh ref={cloudsRef} position={[0, 0, 0]}>
        <sphereGeometry args={[3.02, 128, 128]} />
        <meshPhongMaterial
          map={cloudsMap}
          opacity={0.4}
          transparent={true}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Earth surface - với day/night effect */}
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[3, 128, 128]} />
        <meshPhongMaterial
          map={colorMap}
          emissiveMap={nightMap}
          emissive={new THREE.Color(0xffff88)}
          emissiveIntensity={1.0}
          specular={new THREE.Color(0x333333)}
          shininess={25}
        />
      </mesh>

      {/* Node markers - gắn vào group để quay cùng Earth */}
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
    </>
  )
}
