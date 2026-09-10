import { useState } from 'react'
import { Text, View } from '@tarojs/components'
import { useExitActions } from '../../hooks/useExitActions'
import { DEMO_ACCOUNT, TOTAL_TASKS } from '../../services/mock'
import { useVisitor } from '../../store/VisitorContext'
import LoginSheet from '../login/LoginSheet'
import MvButton from '../ui/MvButton'
import MvIcon from '../ui/MvIcon'
import './WelcomeState.scss'

/** 巡检流程（与实际功能一一对应） */
const FLOWS = [
  { no: '01', title: '领取任务', desc: '系统按就近原则派发门店与到店时间' },
  { no: '02', title: '到店打卡', desc: '定位核验到店，拍摄门头照与自拍照' },
  { no: '03', title: '体验取证', desc: '补齐店内环境照，登记会员卡下发' },
  { no: '04', title: '提交回访', desc: '多维服务评分与真实体验反馈' },
]

export default function WelcomeState() {
  const [loginVisible, setLoginVisible] = useState(false)
  const { state, goHome } = useVisitor()
  const { resetDemo } = useExitActions()
  const loggedIn = !!state.profile

  // 存在本地演示进度时，提示可一键回到首次进入的干净状态
  const hasProgress = !!state.profile || !!state.activeTask || state.pool.length !== TOTAL_TASKS

  return (
    <View className='welcome'>
      <View className='welcome__hero'>
        <View className='welcome__blob welcome__blob--1' />
        <View className='welcome__blob welcome__blob--2' />
        <View className='welcome__brand-row'>
          <View className='welcome__logo'>
            <MvIcon name='scissors' size={26} color='#FFFFFF' />
          </View>
          <View>
            <Text className='welcome__brand'>徐东理发连锁</Text>
            <Text className='welcome__system'>神秘顾客巡检系统</Text>
          </View>
        </View>
        <Text className='welcome__slogan'>
          以普通顾客的身份到店，用真实体验还原每一家门店的服务水准
        </Text>
      </View>

      <View className='welcome__body'>
        <View className='welcome__notice'>
          <MvIcon name='sparkle' size={15} color='#9C8AA5' />
          <Text className='welcome__notice-text'>
            暗访全程请勿透露身份，客观记录接待、洗护、剪发与结算各环节。
          </Text>
        </View>

        <View className='welcome__section'>
          <Text className='welcome__section-title'>巡检流程</Text>
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
      </View>

      <View className='welcome__footer'>
        <MvButton
          block
          size='lg'
          onClick={() => (loggedIn ? goHome() : setLoginVisible(true))}
        >
          {loggedIn ? '返回工作台' : '我是神秘顾客 · 进入工作台'}
        </MvButton>
        <Text className='welcome__demo'>
          {loggedIn ? (
            <>
              {state.profile?.name}（{state.profile?.staffNo}）已登录，可直接返回工作台
            </>
          ) : (
            <>
              演示工号{' '}
              <Text className='welcome__demo-highlight'>{DEMO_ACCOUNT.staffNo}</Text> · 密码{' '}
              <Text className='welcome__demo-highlight'>{DEMO_ACCOUNT.password}</Text>
            </>
          )}
        </Text>
        {hasProgress && (
          <Text className='welcome__reset' onClick={resetDemo}>
            检测到演示进度 · 清除并回到首次进入状态
          </Text>
        )}
      </View>

      <Text className='welcome__version'>v1.0.0 · 徐东理发连锁 运营管理部</Text>

      <LoginSheet visible={loginVisible} onClose={() => setLoginVisible(false)} />
    </View>
  )
}
