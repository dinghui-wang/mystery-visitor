import { Text, View } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { getPendingStepTitles, getTaskProgress, getTaskSteps } from '../../services/progress'
import { useVisitor } from '../../store/VisitorContext'
import MvButton from '../ui/MvButton'
import MvCard from '../ui/MvCard'
import MvExitMenu from '../ui/MvExitMenu'
import MvIcon from '../ui/MvIcon'
import MvStepBar from '../ui/MvStepBar'
import CheckInBlock from './CheckInBlock'
import MemberCardBlock from './MemberCardBlock'
import PhotoBlock from './PhotoBlock'
import './TaskState.scss'

export default function TaskState() {
  const { state, submitTask } = useVisitor()
  const task = state.activeTask

  if (!task) return null

  const steps = getTaskSteps(task)
  const pending = getPendingStepTitles(task)
  const finished = pending.length === 0
  const percent = Math.round(getTaskProgress(task) * 100)

  const handleSubmit = () => {
    if (!finished) {
      showToast({ title: `还需完成：${pending.join('、')}`, icon: 'none' })
      return
    }
    submitTask()
    showToast({ title: '任务已提交，请填写回访', icon: 'none', duration: 1200 })
  }

  return (
    <View className='task'>
      <View className='task__hero'>
        <View className='task__blob' />
        <View className='task__hero-top'>
          <Text className='task__shop'>{task.shopName}</Text>
          <MvExitMenu />
        </View>
        <View className='task__hero-tags'>
          <Text className='task__hero-tag'>{task.shopType}</Text>
          <Text className='task__hero-tag task__hero-tag--status'>{task.status}</Text>
        </View>
        <View className='task__hero-rows'>
          <View className='task__hero-row'>
            <MvIcon name='location' size={14} color='#FFFFFF' />
            <Text className='task__hero-text'>{task.address}</Text>
          </View>
          <View className='task__hero-row'>
            <MvIcon name='clock' size={14} color='#FFFFFF' />
            <Text className='task__hero-text'>预约到店 {task.appointAt}</Text>
          </View>
          <View className='task__hero-row'>
            <MvIcon name='note' size={14} color='#FFFFFF' />
            <Text className='task__hero-text'>{task.project}</Text>
          </View>
        </View>
        <View className='task__hero-amount'>
          <Text className='task__hero-amount-label'>本次体验额度</Text>
          <Text className='task__hero-amount-value'>¥{task.budget}</Text>
        </View>
      </View>

      <View className='task__body'>
        <MvCard className='task__steps' title='执行进度' subtitle={`${percent}%`} icon='sparkle'>
          <MvStepBar steps={steps} />
          <Text className='task__progress-hint'>
            {finished ? '全部步骤已完成，可提交任务' : `待完成：${pending.join(' · ')}`}
          </Text>
        </MvCard>

        <CheckInBlock task={task} />
        <PhotoBlock task={task} />
        <MemberCardBlock task={task} />
      </View>

      <View className='task__submit-bar'>
        <Text className={`task__submit-hint ${finished ? '' : 'task__submit-hint--warn'}`}>
          {finished ? '提交后进入回访表单' : `还需完成：${pending.join('、')}`}
        </Text>
        <MvButton block size='lg' type={finished ? 'primary' : 'soft'} onClick={handleSubmit}>
          {finished ? '提交任务' : '完成全部步骤后提交'}
        </MvButton>
      </View>
    </View>
  )
}
