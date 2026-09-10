import { useState } from 'react'
import { Text, View } from '@tarojs/components'
import { getLocation, showModal, showToast } from '@tarojs/taro'
import {
  calcDistance,
  describeLocation,
  formatDistance,
  simulateLocation,
  type LocationPoint,
} from '../../services/location'
import { useVisitor } from '../../store/VisitorContext'
import type { MysteryTask } from '../../types/business'
import { formatNow } from '../../utils/date'
import { icon } from '../../constants/icons'
import { rpx } from '../../utils/px'
import MvButton from '../ui/MvButton'
import MvCard from '../ui/MvCard'
import MvIcon from '../ui/MvIcon'
import MvTag from '../ui/MvTag'
import './CheckInBlock.scss'

/** 允许的打卡半径（米） */
const ALLOW_RADIUS = 800

interface CheckInBlockProps {
  task: MysteryTask
}

export default function CheckInBlock({ task }: CheckInBlockProps) {
  const { checkIn } = useVisitor()
  const [loading, setLoading] = useState(false)
  const record = task.checkIn

  const commit = (point: LocationPoint) => {
    const distance = calcDistance(point.lat, point.lng, task.lat, task.lng)
    if (distance > ALLOW_RADIUS) {
      showModal({
        title: '打卡失败',
        content: `当前位置距离门店约 ${formatDistance(distance)}，超出 ${ALLOW_RADIUS}m 有效范围，请到店后再试。`,
        showCancel: false,
        confirmColor: '#9C8AA5',
      })
      return
    }
    checkIn({
      lat: point.lat,
      lng: point.lng,
      distance,
      address: task.address,
      checkedAt: formatNow(),
      simulated: point.simulated,
    })
    showToast({ title: '打卡成功', icon: 'success' })
  }

  const handleRealCheckIn = async () => {
    setLoading(true)
    try {
      const res = await getLocation({ type: 'gcj02', isHighAccuracy: true })
      commit({ lat: res.latitude, lng: res.longitude, simulated: false })
    } catch (error) {
      console.error('获取定位失败', error)
      showModal({
        title: '定位失败',
        content: '未获取到当前位置，请检查定位授权；演示环境可点击「模拟定位」继续。',
        confirmText: '模拟定位',
        cancelText: '知道了',
        confirmColor: '#9C8AA5',
      }).then((result) => {
        if (result.confirm) commit(simulateLocation(task))
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSimulate = () => {
    commit(simulateLocation(task))
  }

  return (
    <MvCard
      className='checkin'
      title='到店打卡'
      icon='location'
      extra={record ? <MvTag tone='success' dot>已打卡</MvTag> : <MvTag tone='muted'>待打卡</MvTag>}
    >
      {!record ? (
        <View>
          <View className='checkin__map'>
            <View className='checkin__grid' />
            <View className='checkin__range' />
            <View className='checkin__pin'>
              <MvIcon name='locationSolid' size={26} color='#9C8AA5' />
              <Text className='checkin__pin-text'>{task.shopName}</Text>
            </View>
            <Text className='checkin__coord'>{describeLocation(task.lat, task.lng)}</Text>
          </View>

          <View className='checkin__rows'>
            <View className='checkin__row'>
              <Text className='checkin__label'>有效范围</Text>
              <Text className='checkin__value'>门店周边 {ALLOW_RADIUS}m</Text>
            </View>
            <View className='checkin__row'>
              <Text className='checkin__label'>当前位置</Text>
              <Text className='checkin__value'>未获取</Text>
            </View>
          </View>

          <View className='checkin__actions'>
            <View className='checkin__actions-main'>
              <MvButton block loading={loading} onClick={handleRealCheckIn}>
                获取定位并打卡
              </MvButton>
            </View>
            <Text className='checkin__sim' onClick={handleSimulate}>
              模拟定位
            </Text>
          </View>
        </View>
      ) : (
        <View>
          <View className='checkin__done'>
            <View className='checkin__done-icon'>
              <View
                className='mv-icon'
                style={{
                  width: rpx(18),
                  height: rpx(18),
                  backgroundImage: icon('check', '#4F7A5C', 2.4),
                }}
              />
            </View>
            <View className='checkin__done-main'>
              <Text className='checkin__done-title'>到店打卡成功</Text>
              <Text className='checkin__done-meta'>
                {record.checkedAt} · 距门店 {formatDistance(record.distance)}
              </Text>
              <Text className='checkin__done-meta'>{record.address}</Text>
              {record.simulated && (
                <Text className='checkin__done-meta'>（演示环境模拟定位，非真实坐标）</Text>
              )}
            </View>
          </View>
          <View className='checkin__redo'>
            <MvButton type='text' size='sm' onClick={handleRealCheckIn}>
              重新打卡
            </MvButton>
          </View>
        </View>
      )}
    </MvCard>
  )
}
