import type { ReactNode } from 'react'
import { Text, View } from '@tarojs/components'
import MvIcon from './MvIcon'
import type { IconName } from '../../constants/icons'
import { cx } from '../../utils/px'
import './MvCard.scss'

interface MvCardProps {
  title?: string
  subtitle?: string
  icon?: IconName
  extra?: ReactNode
  children?: ReactNode
  className?: string
  flat?: boolean
  /** 入场动画延迟，用于列表错落出现 */
  delay?: number
}

export default function MvCard({
  title,
  subtitle,
  icon,
  extra,
  children,
  className,
  flat = false,
  delay = 0,
}: MvCardProps) {
  return (
    <View
      className={cx('mv-card', flat && 'mv-card--flat', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {(title || extra) && (
        <View className='mv-card__head'>
          <View className='mv-card__title-wrap'>
            {icon && <MvIcon name={icon} size={16} color='#9C8AA5' />}
            <Text className='mv-card__title'>{title}</Text>
            {subtitle && <Text className='mv-card__subtitle'>{subtitle}</Text>}
          </View>
          {extra && <View className='mv-card__extra'>{extra}</View>}
        </View>
      )}
      <View className='mv-card__body'>{children}</View>
    </View>
  )
}
