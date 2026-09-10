import { View } from '@tarojs/components'
import { showActionSheet } from '@tarojs/taro'
import { useExitActions } from '../../hooks/useExitActions'
import MvIcon from './MvIcon'
import './MvExitMenu.scss'

interface MvExitMenuProps {
  size?: number
  color?: string
}

/** 全状态可用的「回到首次进入页面」入口 */
export default function MvExitMenu({ size = 20, color = '#FFFFFF' }: MvExitMenuProps) {
  const { exitToWelcome, resetDemo } = useExitActions()

  const open = () => {
    showActionSheet({
      itemList: ['回到欢迎页（退出登录）', '重置演示数据（清空进度）'],
      itemColor: '#4A3F52',
    })
      .then((res) => {
        if (res.tapIndex === 0) exitToWelcome()
        if (res.tapIndex === 1) resetDemo()
      })
      .catch(() => {
        // 用户取消，无需处理
      })
  }

  return (
    <View className='mv-exit-menu' onClick={open}>
      <MvIcon name='logout' size={size} color={color} />
    </View>
  )
}
