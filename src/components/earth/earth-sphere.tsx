import { useRef, type JSX } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import type { EarthSphereProps } from './types'
import { NodeMarkers } from './node-markers'

export function EarthSphere({ nodes, onNodeClick, onNodeHover, earthRef: externalEarthRef }: EarthSphereProps): JSX.Element {
  const internalEarthRef = useRef<THREE.Mesh | null>(null)
  const earthRef = externalEarthRef || internalEarthRef
  const cloudsRef = useRef<THREE.Mesh | null>(null)
  const markersGroupRef = useRef<THREE.Group | null>(null)

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
      <NodeMarkers 
        nodes={nodes}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
        markersGroupRef={markersGroupRef}
      />
    </>
  )
}
