import { View } from '@tarojs/components'
import { icon, type IconName } from '../../constants/icons'
import { cx, rpx } from '../../utils/px'

interface MvIconProps {
  name: IconName
  /** 设计稿尺寸（375 基准） */
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
}

export default function MvIcon({
  name,
  size = 16,
  color = '#8B8195',
  strokeWidth,
  className,
}: MvIconProps) {
  return (
    <View
      className={cx('mv-icon', className)}
      style={{
        width: rpx(size),
        height: rpx(size),
        backgroundImage: icon(name, color, strokeWidth),
      }}
    />
  )
}
