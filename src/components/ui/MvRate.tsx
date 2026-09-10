import { Text, View } from '@tarojs/components'
import { cx } from '../../utils/px'
import './MvRate.scss'

interface MvRateProps {
  value: number
  onChange?: (value: number) => void
  count?: number
  size?: 'sm' | 'md'
  hint?: string
}

const HINTS = ['待提升', '待提升', '一般', '良好', '优秀']

export default function MvRate({
  value,
  onChange,
  count = 5,
  size = 'md',
  hint,
}: MvRateProps) {
  return (
    <View className={cx('mv-rate', size === 'sm' && 'mv-rate--sm')}>
      {Array.from({ length: count }).map((_, index) => {
        const star = index + 1
        const on = star <= value
        return (
          <Text
            key={star}
            className={cx('mv-rate__star', on && 'mv-rate__star--on')}
            onClick={() => onChange?.(star)}
          >
            {on ? '★' : '☆'}
          </Text>
        )
      })}
      <Text className='mv-rate__hint'>{hint ?? (value ? HINTS[value - 1] : '未评分')}</Text>
    </View>
  )
}
