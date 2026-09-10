import { getStorageSync, removeStorageSync, setStorageSync } from '@tarojs/taro'
import type { VisitorState } from '../types/business'

const STORAGE_KEY = 'mv_visitor_state_v1'

/**
 * 是否持久化演示进度。
 * 置为 false 后，每次冷启动都会直接回到首次进入的欢迎页（仍可通过「重置演示数据」清空缓存）。
 */
export const PERSIST_ENABLED = true

/** 读取持久化的演示进度 */
export function readState(): Partial<VisitorState> | null {
  try {
    const cached = getStorageSync(STORAGE_KEY)
    if (cached && typeof cached === 'object') return cached as Partial<VisitorState>
    return null
  } catch (error) {
    console.error('读取本地进度失败', error)
    return null
  }
}

export function writeState(state: VisitorState) {
  try {
    setStorageSync(STORAGE_KEY, state)
  } catch (error) {
    console.error('写入本地进度失败', error)
  }
}

export function clearState() {
  try {
    removeStorageSync(STORAGE_KEY)
  } catch (error) {
    console.error('清空本地进度失败', error)
  }
}
