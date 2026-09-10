import { Text, View } from '@tarojs/components'
import { showModal } from '@tarojs/taro'
import { useExitActions } from '../../hooks/useExitActions'
import { calcDistance, formatDistance } from '../../services/location'
import { MOCK_VIEWPOINT } from '../../services/mock'
import { getTaskProgress, getTaskSteps } from '../../services/progress'
import { useVisitor } from '../../store/VisitorContext'
import MvButton from '../ui/MvButton'
import MvExitMenu from '../ui/MvExitMenu'
import MvIcon from '../ui/MvIcon'
import MvTag from '../ui/MvTag'
import HistoryItem from './HistoryItem'
import './HomeState.scss'

const currentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export default function HomeState() {
  const { state, acceptTask, resumeTask } = useVisitor()
  const { exitToWelcome, resetDemo } = useExitActions()
  const profile = state.profile

  if (!profile) return null

  const activeTask = state.activeTask
  const activeSteps = activeTask ? getTaskSteps(activeTask) : []
  const activeTotal = activeSteps.filter((step) => step.key !== 'submit').length
  const activeDone = activeSteps.filter((step) => step.key !== 'submit' && step.done).length
  const activePercent = activeTask ? Math.round(getTaskProgress(activeTask) * 100) : 0

  const monthDone = state.history.filter((item) => item.date.startsWith(currentMonth())).length
  const percent = Math.min(100, Math.round((monthDone / profile.monthTarget) * 100))
  const nextTask = state.pool[0]

  // 任务池里可能残留上次未完成的任务，展示已有进度
  const poolSteps = nextTask ? getTaskSteps(nextTask) : []
  const poolTotal = poolSteps.filter((step) => step.key !== 'submit').length
  const poolDone = poolSteps.filter((step) => step.key !== 'submit' && step.done).length
  const poolStarted = poolDone > 0

  const showTaskNotes = () => {
    if (!nextTask) return
    showModal({
      title: '任务须知',
      content: `${nextTask.project}\n\n${nextTask.notes}\n\n联系方式：${nextTask.contact}`,
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#9C8AA5',
    })
  }

  return (
    <View className='home'>
      <View className='home__hero'>
        <View className='home__blob' />
        <View className='home__profile'>
          <View className='home__avatar'>{profile.name.slice(0, 1)}</View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View className='home__name-row'>
              <Text className='home__name'>{profile.name}</Text>
              <Text className='home__badge'>{profile.level}</Text>
            </View>
            <Text className='home__staff'>工号 {profile.staffNo}</Text>
          </View>
          <MvExitMenu />
        </View>
      </View>

      <View className='home__metrics'>
        <View className='home__metric'>
          <Text className='home__metric-value'>{monthDone}</Text>
          <Text className='home__metric-label'>本月完成</Text>
        </View>
        {/* <View className='home__metric'>
          <Text className='home__metric-value'>{profile.points}</Text>
          <Text className='home__metric-label'>可用积分</Text>
        </View> */}
        <View className='home__metric'>
          <Text className='home__metric-value'>{state.history.length}</Text>
          <Text className='home__metric-label'>累计暗访</Text>
        </View>
      </View>

      <View className='home__progress'>
        <View className='home__progress-head'>
          <Text className='home__progress-title'>本月目标进度</Text>
          <Text className='home__progress-value'>
            {monthDone} / {profile.monthTarget} 单
          </Text>
        </View>
        <View className='home__progress-track'>
          <View className='home__progress-bar' style={{ width: `${percent}%` }} />
        </View>
        {/* <Text className='home__progress-desc'>
          完成一单可获得 120 积分，积分可兑换暗访额度
        </Text> */}
      </View>

      {!!activeTask && (
        <View className='home__section'>
          <Text className='home__section-title'>进行中的任务</Text>
          <View className='home__task home__task--active'>
            <View className='home__task-head'>
              <Text className='home__task-shop'>{activeTask.shopName}</Text>
              <MvTag tone='warning' dot>
                {activeTask.status}
              </MvTag>
            </View>
            <View className='home__progress-track' style={{ marginTop: 12 }}>
              <View className='home__progress-bar' style={{ width: `${activePercent}%` }} />
            </View>
            <Text className='home__progress-desc'>
              已完成 {activeDone}/{activeTotal} 步
              {activeDone > 0 &&
                `：${activeSteps
                  .filter((step) => step.key !== 'submit' && step.done)
                  .map((step) => step.title)
                  .join(' · ')}`}
            </Text>
            <View style={{ marginTop: 12 }}>
              <MvButton block size='sm' onClick={resumeTask}>
                {activeTask.submittedAt ? '继续填写回访' : '继续执行任务'}
              </MvButton>
            </View>
          </View>
        </View>
      )}

      <View className='home__section'>
        <Text className='home__section-title'>
          {nextTask ? '待接任务' : '任务中心'}（{state.pool.length}）
        </Text>
        {nextTask ? (
          <View className='home__task'>
            <View className='home__task-head'>
              <Text className='home__task-shop'>{nextTask.shopName}</Text>
              <MvTag tone='warning' dot>
                {nextTask.status}
              </MvTag>
            </View>
            <View className='home__task-rows'>
              <View className='home__task-row'>
                <Text className='home__task-label'>门店品类</Text>
                <Text className='home__task-value'>{nextTask.shopType}</Text>
              </View>
              <View className='home__task-row'>
                <Text className='home__task-label'>暗访项目</Text>
                <Text className='home__task-value'>{nextTask.project}</Text>
              </View>
              <View className='home__task-row'>
                <Text className='home__task-label'>预约时间</Text>
                <Text className='home__task-value'>{nextTask.appointAt}</Text>
              </View>
              <View className='home__task-row'>
                <Text className='home__task-label'>门店地址</Text>
                <Text className='home__task-value'>{nextTask.address}</Text>
              </View>
              <View className='home__task-row'>
                <Text className='home__task-label'>体验额度</Text>
                <Text className='home__task-value home__task-amount'>¥{nextTask.budget}</Text>
              </View>
              {poolStarted && (
                <View className='home__task-row'>
                  <Text className='home__task-label'>上次进度</Text>
                  <Text className='home__task-value'>
                    已完成 {poolDone}/{poolTotal} 步
                  </Text>
                </View>
              )}
              <View className='home__task-row'>
                <Text className='home__task-label'>距您距离</Text>
                <Text className='home__task-value'>
                  {formatDistance(
                    calcDistance(
                      MOCK_VIEWPOINT.lat,
                      MOCK_VIEWPOINT.lng,
                      nextTask.lat,
                      nextTask.lng
                    )
                  )}
                </Text>
              </View>
            </View>
            <View className='home__task-actions'>
              <MvButton
                type='soft'
                size='sm'
                className='home__task-action--secondary'
                onClick={showTaskNotes}
              >
                任务须知
              </MvButton>
              <MvButton
                size='sm'
                className='home__task-action--primary'
                onClick={() => acceptTask(nextTask.id)}
              >
                {poolStarted ? '继续执行' : '立即领取'}
              </MvButton>
            </View>
          </View>
        ) : (
          <View className='home__empty'>
            <View className='home__empty-icon'>
              <MvIcon name='check' size={28} color='#B5AEBD' />
            </View>
            <Text className='home__empty-text'>暂无可接任务，有新任务时会在这里提醒你</Text>
          </View>
        )}
      </View>

      <View className='home__section'>
        <Text className='home__section-title'>历史暗访</Text>
        <View className='home__history'>
          {state.history.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))}
        </View>
      </View>

      <View className='home__foot-actions'>
        <Text className='home__foot-text' onClick={exitToWelcome}>
          回到欢迎页
        </Text>
        <Text className='home__foot-text' onClick={resetDemo}>
          重置演示数据
        </Text>
      </View>
    </View>
  )
}
