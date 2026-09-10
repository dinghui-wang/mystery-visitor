import { View } from '@tarojs/components'
import HomeState from '../../components/home/HomeState'
import ReviewForm from '../../components/review/ReviewForm'
import TaskState from '../../components/task/TaskState'
import WelcomeState from '../../components/welcome/WelcomeState'
import { useVisitor } from '../../store/VisitorContext'
import './index.scss'

export default function Index() {
  const { state } = useVisitor()

  return (
    <View className='mv-page'>
      {state.pageState === 'welcome' && <WelcomeState />}
      {state.pageState === 'home' && <HomeState />}
      {state.pageState === 'task' && <TaskState />}
      {state.pageState === 'review' && <ReviewForm />}
    </View>
  )
}
