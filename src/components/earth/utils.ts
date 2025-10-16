import * as THREE from 'three'

/**
 * Chuyển đổi tọa độ lat/lng sang tọa độ 3D
 * @param lat Latitude (vĩ độ)
 * @param lng Longitude (kinh độ)
 * @param radius Bán kính của quả cầu
 * @returns Vector3 position
 */
export const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)
    const x = -radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)
    return new THREE.Vector3(x, y, z)
}
