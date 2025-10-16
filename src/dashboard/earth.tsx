// EarthRealistic.tsx
import { useRef, type JSX } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three'

function EarthSphere(): JSX.Element {
  const earthRef = useRef<THREE.Mesh | null>(null)
  const cloudsRef = useRef<THREE.Mesh | null>(null)

  // Textures 8K chất lượng cao từ local
  const [colorMap, cloudsMap] = useLoader(TextureLoader, [
    '/texture/8k_earth_daymap.jpg',
    '/texture/8k_earth_clouds.jpg',
  ])


  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (earthRef.current) earthRef.current.rotation.y = t * 0.08 // chậm
    if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.12 // mây hơi nhanh hơn
  })

  return (
    <>
      {/* Clouds layer: đặt hơi lớn hơn để tránh z-fighting, depthWrite false để render trong suốt tốt */}
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

      {/* Earth surface - to hơn và sáng hơn */}
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[3, 128, 128]} />
        <meshPhongMaterial
          map={colorMap}
          specular={new THREE.Color(0x333333)}
          shininess={25}
        />
      </mesh>
    </>
  )
}

export default function Earth(): JSX.Element {
  return (
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
        <EarthSphere />

        {/* Controls: bật autoRotate nếu muốn */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          rotateSpeed={0.6}
          // autoRotate và autoRotateSpeed vẫn là props hợp lệ trên drei OrbitControls
          autoRotate={true}
          autoRotateSpeed={0.2}
        />
      </Canvas>
    </div>
  )
}
