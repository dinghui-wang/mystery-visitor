import type { ReactNode } from 'react'
import { Button, View } from '@tarojs/components'
import { icon, type IconName } from '../../constants/icons'
import { cx, rpx } from '../../utils/px'
import './MvButton.scss'

export type MvButtonType = 'primary' | 'rose' | 'soft' | 'ghost' | 'text'

interface MvButtonProps {
  children?: ReactNode
  type?: MvButtonType
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  disabled?: boolean
  loading?: boolean
  iconName?: IconName
  onClick?: () => void
}

export default function MvButton({
  children,
  type = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  loading = false,
  iconName,
  onClick,
}: MvButtonProps) {
  const iconColor =
    disabled || loading
      ? '#FFFFFF'
      : type === 'primary' || type === 'rose'
        ? '#FFFFFF'
        : '#9C8AA5'

  return (
    <Button
      className={cx(
        'mv-btn',
        `mv-btn--${disabled ? 'disabled' : type}`,
        size !== 'md' && `mv-btn--${size}`,
        block && 'mv-btn--block'
      )}
      hoverClass={disabled || loading ? 'none' : 'mv-btn--hover'}
      disabled={disabled || loading}
      loading={loading}
      onClick={() => {
        if (disabled || loading) return
        onClick?.()
      }}
    >
      {iconName && (
        <View
          className='mv-btn__icon'
          style={{
            width: rpx(16),
            height: rpx(16),
            backgroundImage: icon(iconName, iconColor),
          }}
        />
      )}
      {children}
    </Button>
  )
}
