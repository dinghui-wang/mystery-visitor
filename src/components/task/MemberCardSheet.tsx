import { useEffect, useState } from 'react'
import { Image, Picker, Text, Textarea, View } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { notifyPickError, pickImages, previewImage } from '../../services/media'
import { useVisitor } from '../../store/VisitorContext'
import type { MysteryTask } from '../../types/business'
import { formatNow } from '../../utils/date'
import MvButton from '../ui/MvButton'
import MvField from '../ui/MvField'
import MvIcon from '../ui/MvIcon'
import MvSheet from '../ui/MvSheet'
import './MemberCardSheet.scss'

interface MemberCardSheetProps {
  visible: boolean
  task: MysteryTask
  onClose: () => void
}

export default function MemberCardSheet({ visible, task, onClose }: MemberCardSheetProps) {
  const { issueCard } = useVisitor()
  const [cardIndex, setCardIndex] = useState(0)
  const [cardNo, setCardNo] = useState('')
  const [faceValue, setFaceValue] = useState('')
  const [benefit, setBenefit] = useState('')
  const [expireAt, setExpireAt] = useState('')
  const [holderName, setHolderName] = useState('')
  const [holderPhone, setHolderPhone] = useState('')
  const [photoPath, setPhotoPath] = useState('')
  const [remark, setRemark] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 打开时用已有记录回填
  useEffect(() => {
    if (!visible) return
    const record = task.cardIssue
    setCardIndex(Math.max(0, task.cardTypes.indexOf(record?.cardType ?? '')))
    setCardNo(record?.cardNo ?? '')
    setFaceValue(record ? String(record.faceValue) : String(task.budget))
    setBenefit(record?.benefit ?? '')
    setExpireAt(record?.expireAt ?? '')
    setHolderName(record?.holderName ?? '')
    setHolderPhone(record?.holderPhone ?? '')
    setPhotoPath(record?.photoPath ?? '')
    setRemark(record?.remark ?? '')
    setErrors({})
  }, [visible, task])

  const handlePickProof = async () => {
    try {
      const paths = await pickImages(1)
      if (paths.length) setPhotoPath(paths[0])
    } catch (error) {
      notifyPickError(error)
    }
  }

  const handleSubmit = () => {
    const next: Record<string, string> = {}
    if (!cardNo.trim()) next.cardNo = '请填写会员卡号'
    if (!faceValue.trim()) next.faceValue = '请填写卡面额'
    if (!expireAt) next.expireAt = '请选择有效期'
    if (!holderName.trim()) next.holderName = '请填写持卡人姓名'
    setErrors(next)
    if (Object.keys(next).length) return

    issueCard({
      cardType: task.cardTypes[cardIndex] ?? task.cardTypes[0] ?? '',
      cardNo: cardNo.trim(),
      faceValue: Number(faceValue) || 0,
      benefit: benefit.trim(),
      expireAt,
      holderName: holderName.trim(),
      holderPhone: holderPhone.trim(),
      photoPath,
      remark: remark.trim(),
      issuedAt: formatNow(),
    })
    showToast({ title: '会员卡下发已登记', icon: 'success' })
    onClose()
  }

  return (
    <MvSheet
      visible={visible}
      title='会员卡下发登记'
      subtitle='登记本次交付给体验人的真实会员卡信息'
      onClose={onClose}
      footer={
        <MvButton block size='lg' onClick={handleSubmit}>
          确认下发
        </MvButton>
      }
    >
      <View className='mcsheet'>
        <View className='mcsheet__form'>
          <Picker
            mode='selector'
            range={task.cardTypes}
            value={cardIndex}
            onChange={(event) => setCardIndex(Number(event.detail.value))}
          >
            <MvField label='下发卡种' required value={task.cardTypes[cardIndex] ?? ''} editable={false} arrow placeholder='请选择卡种' iconName='card' />
          </Picker>
          <MvField
            label='会员卡号'
            iconName='note'
            required
            value={cardNo}
            placeholder='卡面印刷的卡号'
            error={errors.cardNo}
            maxLength={24}
            onChange={(value) => {
              setCardNo(value)
              setErrors((prev) => ({ ...prev, cardNo: '' }))
            }}
          />
          <MvField
            label='卡面额（元）'
            iconName='wallet'
            required
            inputType='digit'
            value={faceValue}
            placeholder='可用于免费消费的额度'
            error={errors.faceValue}
            maxLength={8}
            onChange={(value) => {
              setFaceValue(value)
              setErrors((prev) => ({ ...prev, faceValue: '' }))
            }}
            suffix={<Text style={{ fontSize: '13px', color: '#8B8195' }}>元</Text>}
          />
          <MvField
            label='主要权益'
            iconName='sparkle'
            value={benefit}
            placeholder='如：免费深层清洁护理 1 次'
            maxLength={40}
            onChange={setBenefit}
          />
          <Picker
            mode='date'
            value={expireAt || '2026-12-31'}
            onChange={(event) => {
              setExpireAt(String(event.detail.value))
              setErrors((prev) => ({ ...prev, expireAt: '' }))
            }}
          >
            <MvField
              label='有效期至'
              iconName='clock'
              required
              value={expireAt}
              editable={false}
              arrow
              placeholder='请选择有效期'
              error={errors.expireAt}
            />
          </Picker>
          <MvField
            label='持卡人'
            iconName='user'
            required
            value={holderName}
            placeholder='体验人姓名'
            error={errors.holderName}
            maxLength={12}
            onChange={(value) => {
              setHolderName(value)
              setErrors((prev) => ({ ...prev, holderName: '' }))
            }}
          />
          <MvField
            label='持卡人手机'
            iconName='phone'
            inputType='number'
            value={holderPhone}
            placeholder='选填，便于门店核销'
            maxLength={11}
            onChange={setHolderPhone}
          />
        </View>

        <View className='mcsheet__section'>
          <Text className='mcsheet__section-title'>卡面凭证</Text>
          <View className='mcsheet__proof' onClick={handlePickProof}>
            <View className='mcsheet__proof-main'>
              <Text className='mcsheet__proof-title'>拍照上传实体卡正面</Text>
              <Text className='mcsheet__proof-desc'>需清晰可见卡号与门店名称，选填</Text>
            </View>
            {photoPath ? (
              <Image
                className='mcsheet__proof-img'
                src={photoPath}
                mode='aspectFill'
                onClick={(event) => {
                  event.stopPropagation()
                  previewImage(photoPath, [photoPath])
                }}
              />
            ) : (
              <MvIcon name='camera' size={22} color='#9C8AA5' />
            )}
          </View>
        </View>

        <View className='mcsheet__section'>
          <Text className='mcsheet__section-title'>下发备注</Text>
          <Textarea
            className='mcsheet__textarea'
            value={remark}
            maxlength={200}
            placeholder='如：店长亲自交付并说明可免费体验一次，未额外收取费用'
            placeholderStyle='color:#B5AEBD'
            onInput={(event) => setRemark(event.detail.value)}
          />
        </View>
      </View>
    </MvSheet>
  )
}
