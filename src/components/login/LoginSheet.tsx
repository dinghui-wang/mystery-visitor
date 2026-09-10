import { useState } from 'react'
import { Text, View } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { useVisitor } from '../../store/VisitorContext'
import { DEMO_ACCOUNT, MOCK_PROFILE, verifyAccount } from '../../services/mock'
import MvButton from '../ui/MvButton'
import MvField from '../ui/MvField'
import MvIcon from '../ui/MvIcon'
import MvSheet from '../ui/MvSheet'
import './LoginSheet.scss'

interface LoginSheetProps {
  visible: boolean
  onClose: () => void
}

interface Errors {
  staffNo?: string
  password?: string
}

export default function LoginSheet({ visible, onClose }: LoginSheetProps) {
  const { login } = useVisitor()
  const [staffNo, setStaffNo] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  const fillDemo = () => {
    setStaffNo(DEMO_ACCOUNT.staffNo)
    setPassword(DEMO_ACCOUNT.password)
    setErrors({})
  }

  const handleLogin = () => {
    const next: Errors = {}
    if (!staffNo.trim()) next.staffNo = '请输入员工工号'
    if (!password.trim()) next.password = '请输入登录密码'
    setErrors(next)
    if (next.staffNo || next.password) return

    setLoading(true)
    // 模拟登录请求
    setTimeout(() => {
      setLoading(false)
      if (!verifyAccount(staffNo, password)) {
        showToast({ title: '工号或密码不正确', icon: 'none' })
        return
      }
      showToast({ title: '登录成功', icon: 'none', duration: 800 })
      login(MOCK_PROFILE)
      setStaffNo('')
      setPassword('')
      onClose()
    }, 420)
  }

  return (
    <MvSheet
      visible={visible}
      title='员工登录'
      subtitle='请使用暗访员专属工号登录工作台'
      onClose={onClose}
      footer={
        <MvButton block size='lg' loading={loading} onClick={handleLogin}>
          登录
        </MvButton>
      }
    >
      <View className='login'>
        <View className='login__tip'>
          <MvIcon name='sparkle' size={14} color='#9C6D5C' />
          <Text className='login__tip-text'>演示环境可使用下方测试账号直接登录</Text>
          <Text className='login__tip-action' onClick={fillDemo}>
            一键填充
          </Text>
        </View>

        <View className='login__form'>
          <MvField
            label='员工工号'
            iconName='user'
            required
            value={staffNo}
            placeholder='如 MV20240901'
            error={errors.staffNo}
            maxLength={20}
            onChange={(value) => {
              setStaffNo(value)
              setErrors((prev) => ({ ...prev, staffNo: undefined }))
            }}
          />
          <MvField
            label='登录密码'
            iconName='lock'
            required
            password
            value={password}
            placeholder='请输入密码'
            error={errors.password}
            maxLength={20}
            onChange={(value) => {
              setPassword(value)
              setErrors((prev) => ({ ...prev, password: undefined }))
            }}
          />
        </View>

        <Text className='login__note'>登录即代表同意《暗访员保密协议》，请勿向门店透露身份</Text>
      </View>
    </MvSheet>
  )
}
