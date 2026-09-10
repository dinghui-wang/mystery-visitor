import { useState } from 'react'
import { Text, View } from '@tarojs/components'
import LoginSheet from '../login/LoginSheet'
import MvButton from '../ui/MvButton'
import MvIcon from '../ui/MvIcon'
import { useExitActions } from '../../hooks/useExitActions'
import { DEMO_ACCOUNT, SHOP_TYPE_INTRO, TOTAL_TASKS } from '../../services/mock'
import { useVisitor } from '../../store/VisitorContext'
import './WelcomeState.scss'

const STATS = [
  { value: '1,286', label: '合作门店' },
  { value: '328', label: '本月暗访' },
  { value: '12', label: '覆盖城市' },
]

const FLOWS = [
  { no: '01', title: '领取任务', desc: '系统按位置派发附近门店' },
  { no: '02', title: '到店执行', desc: '定位打卡 · 拍摄取证 · 会员卡下发' },
  { no: '03', title: '提交回访', desc: '多维评分与真实体验反馈' },
]

export default function WelcomeState() {
  const [loginVisible, setLoginVisible] = useState(false)
  const { state } = useVisitor()
  const { resetDemo } = useExitActions()

  // 存在本地演示进度时，提示可一键回到首次进入的干净状态
  const hasProgress =
    !!state.profile || !!state.activeTask || state.pool.length !== TOTAL_TASKS

  return (
    <View className='welcome'>
      <View className='welcome__hero'>
        <View className='welcome__blob welcome__blob--1' />
        <View className='welcome__blob welcome__blob--2' />
        <View className='welcome__spark'>
          <MvIcon name='sparkle' size={22} color='#FFFFFF' />
        </View>
        <View className='welcome__logo'>
          <MvIcon name='sparkle' size={26} color='#FFFFFF' />
        </View>
        <Text className='welcome__brand'>神秘顾客</Text>
        <Text className='welcome__en'>MYSTERY VISITOR</Text>
        <Text className='welcome__slogan'>以顾客之名，看见真实的服务</Text>
      </View>

      <View className='welcome__stats'>
        {STATS.map((item) => (
          <View key={item.label} className='welcome__stat'>
            <Text className='welcome__stat-value'>{item.value}</Text>
            <Text className='welcome__stat-label'>{item.label}</Text>
          </View>
        ))}
      </View>

      <View className='welcome__section'>
        <Text className='welcome__section-title'>覆盖业态</Text>
        <View className='welcome__types'>
          {SHOP_TYPE_INTRO.map((item) => (
            <View key={item.type} className='welcome__type'>
              <Text className='welcome__type-name'>{item.type}</Text>
              <Text className='welcome__type-desc'>{item.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='welcome__section'>
        <Text className='welcome__section-title'>暗访流程</Text>
        <View className='welcome__flow'>
          {FLOWS.map((item) => (
            <View key={item.no} className='welcome__flow-item'>
              <Text className='welcome__flow-no'>{item.no}</Text>
              <View className='welcome__flow-text'>
                <Text className='welcome__flow-title'>{item.title}</Text>
                <Text className='welcome__flow-desc'>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className='welcome__footer'>
        <MvButton block size='lg' onClick={() => setLoginVisible(true)}>
          我是神秘顾客 · 进入工作台
        </MvButton>
        <Text className='welcome__demo'>
          演示工号{' '}
          <Text className='welcome__demo-highlight'>{DEMO_ACCOUNT.staffNo}</Text> · 密码{' '}
          <Text className='welcome__demo-highlight'>{DEMO_ACCOUNT.password}</Text>
        </Text>
        {hasProgress && (
          <Text className='welcome__reset' onClick={resetDemo}>
            检测到演示进度 · 清除并回到首次进入状态
          </Text>
        )}
      </View>

      <LoginSheet visible={loginVisible} onClose={() => setLoginVisible(false)} />
    </View>
  )
}
