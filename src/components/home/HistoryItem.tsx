import { Text, View } from '@tarojs/components'
import { icon } from '../../constants/icons'
import { SHOP_TYPE_COLOR } from '../../constants/theme'
import type { HistoryItem as HistoryItemType } from '../../types/business'
import { rpx } from '../../utils/px'
import MvTag from '../ui/MvTag'
import './HistoryItem.scss'

interface HistoryItemProps {
  item: HistoryItemType
}

export default function HistoryItem({ item }: HistoryItemProps) {
  const color = SHOP_TYPE_COLOR[item.shopType] ?? '#9C8AA5'
  const full = Math.round(item.score)

  return (
    <View className='history-item'>
      <View className='history-item__icon'>
        <View
          className='mv-icon'
          style={{
            width: rpx(18),
            height: rpx(18),
            backgroundImage: icon('shop', color, 1.6),
          }}
        />
      </View>
      <View className='history-item__main'>
        <Text className='history-item__shop'>{item.shopName}</Text>
        <Text className='history-item__meta'>
          {item.date} · {item.shopType} · 额度 ¥{item.budget}
        </Text>
      </View>
      <View className='history-item__right'>
        <Text className='history-item__score'>{item.score.toFixed(1)}</Text>
        <Text className='history-item__stars'>
          {'★'.repeat(full)}
          {'☆'.repeat(5 - full)}
        </Text>
        <MvTag tone={item.status === '已完成' ? 'success' : 'warning'}>{item.status}</MvTag>
      </View>
    </View>
  )
}
