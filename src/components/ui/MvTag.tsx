import type { ReactNode } from 'react'
import { Text } from '@tarojs/components'
import { cx } from '../../utils/px'
import './MvTag.scss'

export type MvTagTone = 'purple' | 'rose' | 'success' | 'warning' | 'danger' | 'muted'

interface MvTagProps {
  children?: ReactNode
  tone?: MvTagTone
  dot?: boolean
  className?: string
}

export default function MvTag({ children, tone = 'purple', dot = false, className }: MvTagProps) {
  return (
    <Text className={cx('mv-tag', `mv-tag--${tone}`, dot && 'mv-tag--dot', className)}>
      {children}
    </Text>
  )
}
