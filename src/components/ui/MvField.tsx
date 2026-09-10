import type { ReactNode } from 'react'
import { Input, Text, View } from '@tarojs/components'
import { icon, type IconName } from '../../constants/icons'
import { cx, rpx } from '../../utils/px'
import './MvField.scss'

interface MvFieldProps {
  label: string
  value: string
  required?: boolean
  placeholder?: string
  /** false 时作为只读选择行，配合 onTap 使用 */
  editable?: boolean
  inputType?: 'text' | 'number' | 'idcard' | 'digit'
  password?: boolean
  maxLength?: number
  arrow?: boolean
  error?: string
  suffix?: ReactNode
  onChange?: (value: string) => void
  onTap?: () => void
  iconName?: IconName
}

export default function MvField({
  label,
  value,
  required = false,
  placeholder = '请输入',
  editable = true,
  inputType = 'text',
  password = false,
  maxLength = 50,
  arrow = false,
  error,
  suffix,
  onChange,
  onTap,
  iconName,
}: MvFieldProps) {
  return (
    <View
      className={cx('mv-field', !!error && 'mv-field--error')}
      onClick={() => {
        if (!editable) onTap?.()
      }}
    >
      <View className='mv-field__head'>
        {iconName && <View className='mv-icon' style={{ width: rpx(13), height: rpx(13), backgroundImage: icon(iconName, '#B5AEBD') }} />}
        <Text className='mv-field__label'>{label}</Text>
        {required && <Text className='mv-field__required'>*</Text>}
      </View>
      <View className='mv-field__row'>
        {editable ? (
          <Input
            className='mv-field__input'
            value={value}
            type={inputType}
            password={password}
            maxlength={maxLength}
            placeholder={placeholder}
            placeholderClass='mv-field__placeholder'
            onInput={(event) => onChange?.(event.detail.value)}
          />
        ) : (
          <Text className={cx('mv-field__value', !value && 'mv-field__value--empty')}>
            {value || placeholder}
          </Text>
        )}
        {suffix}
        {arrow && (
          <View
            className='mv-field__arrow'
            style={{ width: rpx(16), height: rpx(16), backgroundImage: icon('chevron', '#B5AEBD') }}
          />
        )}
      </View>
      {!!error && <View className='mv-field__error'>{error}</View>}
    </View>
  )
}
