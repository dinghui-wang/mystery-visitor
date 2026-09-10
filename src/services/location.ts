import type { MysteryTask } from '../types/business'

export interface LocationPoint {
  lat: number
  lng: number
  simulated: boolean
}

const EARTH_RADIUS = 6371000

const toRad = (deg: number) => (deg * Math.PI) / 180

/** 两点球面距离（米） */
export function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * EARTH_RADIUS * Math.asin(Math.sqrt(a)))
}

/** 距离格式化展示 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`
  return `${(meters / 1000).toFixed(1)} km`
}

/**
 * 以门店坐标做小幅偏移生成演示坐标。
 * 用于无定位授权 / 开发者工具等无法获取真实位置的场景。
 */
export function simulateLocation(task: MysteryTask): LocationPoint {
  const jitter = () => (Math.random() - 0.5) * 0.0016 // 约 ±90m
  return {
    lat: Number((task.lat + jitter()).toFixed(6)),
    lng: Number((task.lng + jitter()).toFixed(6)),
    simulated: true,
  }
}

/** 将经纬度粗略描述为地址，用于打卡成功卡片展示 */
export function describeLocation(lat: number, lng: number): string {
  return `东经 ${lng.toFixed(4)}° · 北纬 ${lat.toFixed(4)}°`
}
