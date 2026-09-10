import { showToast } from '@tarojs/taro'

/**
 * 选择图片（相机 / 相册），返回本地临时路径。
 * 演示环境不做真实上传，仅保留本地路径用于预览。
 */
export async function pickImages(maxCount: number): Promise<string[]> {
  const { chooseMedia } = await import('@tarojs/taro')
  const res = await chooseMedia({
    count: Math.max(1, maxCount),
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    sizeType: ['compressed'],
  })
  return (res.tempFiles || [])
    .map((file: { tempFilePath?: string; path?: string }) => file.tempFilePath || file.path || '')
    .filter(Boolean)
}

/** 预览图片 */
export async function previewImage(current: string, urls: string[]) {
  if (!urls.length) return
  const { previewImage: preview } = await import('@tarojs/taro')
  preview({ current, urls })
}

/** 统一的文件选择失败提示 */
export function notifyPickError(error: unknown) {
  console.error('选择图片失败', error)
  showToast({ title: '未选择图片', icon: 'none' })
}

/** 生成本地唯一 id */
let seed = 0
export const uid = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}_${seed++}`
