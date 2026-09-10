import type { ReactNode } from 'react'
import { ScrollView, Text, View } from '@tarojs/components'
import { Popup } from '@nutui/nutui-react-taro'
import { icon } from '../../constants/icons'
import { rpx } from '../../utils/px'
import './MvSheet.scss'

interface MvSheetProps {
  visible: boolean
  title?: string
  subtitle?: string
  onClose: () => void
  children?: ReactNode
  footer?: ReactNode
  /** 是否允许点击遮罩关闭 */
  closeOnOverlayClick?: boolean
}

export default function MvSheet({
  visible,
  title,
  subtitle,
  onClose,
  children,
  footer,
  closeOnOverlayClick = true,
}: MvSheetProps) {
  return (
    <Popup
      visible={visible}
      position='bottom'
      round
      onClose={onClose}
      onOverlayClick={() => {
        if (closeOnOverlayClick) onClose()
      }}
    >
      <View className='mv-sheet'>
        <View className='mv-sheet__bar' />
        <View className='mv-sheet__head'>
          <View style={{ flex: 1 }}>
            <Text className='mv-sheet__title'>{title}</Text>
            {subtitle && <View className='mv-sheet__subtitle'>{subtitle}</View>}
          </View>
          <View
            className='mv-sheet__close'
            style={{ width: rpx(18), height: rpx(18), backgroundImage: icon('close', '#8B8195') }}
            onClick={onClose}
          />
        </View>
        <ScrollView scrollY className='mv-sheet__body'>
          {children}
        </ScrollView>
        {footer && <View className='mv-sheet__footer'>{footer}</View>}
      </View>
    </Popup>
  )
}
