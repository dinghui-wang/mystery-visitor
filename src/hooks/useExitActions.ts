import { useCallback } from 'react'
import { showModal, showToast } from '@tarojs/taro'
import { useVisitor } from '../store/VisitorContext'

/**
 * 统一的「回到首次进入页面」能力：
 * - exitToWelcome：退出登录回到欢迎页，任务进度保留，可再次登录继续
 * - resetDemo：清空全部演示进度，回到与首次进入完全一致的状态
 */
export function useExitActions() {
  const { logout, reset } = useVisitor()

  const exitToWelcome = useCallback(() => {
    showModal({
      title: '回到欢迎页',
      content: '将退出当前登录，任务进度会保留，下次登录可继续。',
      confirmText: '回到欢迎页',
      confirmColor: '#9C8AA5',
    }).then((res) => {
      if (res.confirm) logout()
    })
  }, [logout])

  const resetDemo = useCallback(() => {
    showModal({
      title: '重置演示数据',
      content: '将清空登录状态与全部任务进度，回到首次进入的页面。',
      confirmText: '确认重置',
      confirmColor: '#9C8AA5',
    }).then((res) => {
      if (!res.confirm) return
      reset()
      showToast({ title: '已回到首次进入状态', icon: 'none', duration: 1200 })
    })
  }, [reset])

  return { exitToWelcome, resetDemo }
}
