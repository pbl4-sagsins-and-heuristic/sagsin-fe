import { useMemo, useRef, useState, type JSX } from 'react'
import * as THREE from 'three'
import { useFrame, extend } from '@react-three/fiber'
import type { Node } from '@/contexts/node-context'
import type { Link } from '@/contexts/link-context'
import { latLngToVector3 } from './utils'

// Extend Three.js Line to make it available in JSX
extend({ Line: THREE.Line })

interface LinkCurvesProps {
  nodes: Node[]
  links: Link[]
  earthRef?: React.RefObject<THREE.Mesh | null>
  onLinkClick?: (link: Link) => void
  onLinkHover?: (link: Link | null, event?: PointerEvent) => void
}

/**
 * Tạo đường cong Quadratic Bezier giữa 2 điểm trên quả cầu
 * Control point nằm phía trên để tạo arc curve theo hình dạng trái đất
 * Độ cao tự động điều chỉnh theo khoảng cách giữa 2 điểm
 */
function createCurve(start: THREE.Vector3, end: THREE.Vector3, radius: number) {
  // Điểm giữa
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
  
  // Tính khoảng cách giữa 2 điểm
  const distance = start.distanceTo(end)
  
  // Tính độ cao động dựa trên khoảng cách
  // - Đường ngắn (< 2): độ cao nhẹ (20% khoảng cách)
  // - Đường trung bình (2-4): độ cao vừa phải (25-35% khoảng cách)
  // - Đường dài (> 4): độ cao lớn (40-50% khoảng cách)
  let heightFactor: number
  if (distance < 2) {
    heightFactor = 0.2 // 20% cho đường ngắn
  } else if (distance < 4) {
    heightFactor = 0.25 + ((distance - 2) / 2) * 0.1 // 25-35% cho đường trung bình
  } else {
    heightFactor = 0.35 + Math.min((distance - 4) / 6, 1) * 0.15 // 35-50% cho đường dài
  }
  
  const controlHeight = radius + (distance * heightFactor)
  const controlPoint = mid.clone().normalize().multiplyScalar(controlHeight)
  
  // Tạo QuadraticBezierCurve3
  return new THREE.QuadraticBezierCurve3(start, controlPoint, end)
}

/**
 * Tìm node theo IP hoặc hostname - improved matching
 */
function findNode(nodes: Node[], identifier: string): Node | undefined {
  if (!identifier) return undefined
  
  const id = identifier.toLowerCase().trim()
  
  return nodes.find(
    (n) => 
      n.ip === identifier || 
      n.ip === id ||
      n.hostname === identifier ||
      n.hostname?.toLowerCase() === id ||
      n.name === identifier ||
      n.name?.toLowerCase() === id
  )
}

// Màu sắc ngẫu nhiên cho mỗi link
const LINK_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
  '#06FFA5', '#FF006E', '#8338EC', '#3A86FF', '#FB5607',
  '#FF9E00', '#06D6A0', '#EF476F', '#118AB2', '#073B4C'
]

function getRandomColor(index: number): string {
  return LINK_COLORS[index % LINK_COLORS.length]
}

export function LinkCurves({ nodes, links, earthRef, onLinkClick, onLinkHover }: LinkCurvesProps): JSX.Element {
  const groupRef = useRef<THREE.Group | null>(null)
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null)

  // Tạo curves cho tất cả links
  const curves = useMemo(() => {
    const result: Array<{
      curve: THREE.QuadraticBezierCurve3
      link: Link
      color: string
    }> = []

    links.forEach((link, index) => {
      // Thử nhiều cách tìm node
      let srcNode = findNode(nodes, link.srcNode)
      if (!srcNode && link.srcIp) srcNode = findNode(nodes, link.srcIp)
      
      let destNode = findNode(nodes, link.destNode)
      if (!destNode && link.destIp) destNode = findNode(nodes, link.destIp)

      // Debug: log khi không tìm thấy node
      if (!srcNode) {
        console.warn(`Source node not found for link: ${link.srcNode || link.srcIp}`)
        return
      }
      if (!destNode) {
        console.warn(`Dest node not found for link: ${link.destNode || link.destIp}`)
        return
      }

      // Kiểm tra có tọa độ không
      if (typeof srcNode.lat !== 'number' || typeof srcNode.lng !== 'number') {
        console.warn(`Source node missing coordinates: ${srcNode.ip}`, srcNode)
        return
      }
      if (typeof destNode.lat !== 'number' || typeof destNode.lng !== 'number') {
        console.warn(`Dest node missing coordinates: ${destNode.ip}`, destNode)
        return
      }

      const startPos = latLngToVector3(srcNode.lat, srcNode.lng, 3.06)
      const endPos = latLngToVector3(destNode.lat, destNode.lng, 3.06)
      
      const curve = createCurve(startPos, endPos, 3.0)
      
      // Mỗi link một màu duy nhất
      const color = getRandomColor(index)

      result.push({ curve, link, color })
    })

    return result
  }, [nodes, links])

  // Đồng bộ rotation với Earth để curves gắn đúng vị trí
  useFrame(() => {
    if (earthRef?.current && groupRef.current) {
      groupRef.current.rotation.copy(earthRef.current.rotation)
    }
  })

  return (
    <group ref={groupRef}>
      {curves.map(({ curve, link, color }, index) => {
        const linkId = link._id || `${link.srcNode}-${link.destNode}-${index}`
        const isHovered = hoveredLinkId === linkId

        // Tạo TubeGeometry để có thể click vào link
        const tubeRadius = isHovered ? 0.01 : 0.006 // Dày hơn khi hover
        const tubeGeometry = new THREE.TubeGeometry(curve, 100, tubeRadius, 8, false)

        return (
          <mesh
            key={linkId}
            geometry={tubeGeometry}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredLinkId(linkId)
              if (onLinkHover) {
                onLinkHover(link, e.nativeEvent as PointerEvent)
              }
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              setHoveredLinkId(null)
              if (onLinkHover) {
                onLinkHover(null)
              }
            }}
            onClick={(e) => {
              e.stopPropagation()
              if (onLinkClick) {
                onLinkClick(link)
              }
            }}
          >
            <meshBasicMaterial
              color={new THREE.Color(color)}
              transparent={true}
              opacity={isHovered ? 1.0 : 0.8}
            />
          </mesh>
        )
      })}
    </group>
  )
}
