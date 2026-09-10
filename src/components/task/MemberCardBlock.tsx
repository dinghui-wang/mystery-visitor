import { Text, View } from '@tarojs/components'
import { showActionSheet, showToast } from '@tarojs/taro'
import { MOCK_AUDITOR } from '../../services/mock'
import { canIssueCard, getMissingCardPhotos } from '../../services/progress'
import { useVisitor } from '../../store/VisitorContext'
import type { MysteryTask } from '../../types/business'
import MvButton from '../ui/MvButton'
import MvCard from '../ui/MvCard'
import MvIcon from '../ui/MvIcon'
import MvTag from '../ui/MvTag'
import './MemberCardBlock.scss'

interface MemberCardBlockProps {
  task: MysteryTask
}

/** 后台驳回的常见原因 */
const REJECT_REASONS = [
  '门头照模糊，无法辨认门店名称',
  '自拍照无法确认本人到店',
  '照片疑似非本次到店拍摄',
  '门店与任务不符',
]

export default function MemberCardBlock({ task }: MemberCardBlockProps) {
  const { submitPhotoAudit, auditPhoto } = useVisitor()
  const audit = task.photoAudit
  const record = task.cardIssue
  const cardReady = canIssueCard(task)
  const missingCardPhotos = getMissingCardPhotos(task)

  /** 提交门头照 + 自拍照给后台审核 */
  const handleSubmit = () => {
    if (!cardReady) {
      showToast({
        title: `请先上传门头照与自拍照（还缺：${missingCardPhotos.join('、')}）`,
        icon: 'none',
      })
      return
    }
    submitPhotoAudit()
    showToast({ title: '照片已提交，等待后台审核', icon: 'success', duration: 1500 })
  }

  /** 演示用：模拟后台审核通过，通过后系统自动下发会员卡 */
  const handleApprove = () => {
    auditPhoto('已通过', MOCK_AUDITOR)
    showToast({ title: '审核通过，会员卡已下发', icon: 'success' })
  }

  /** 演示用：模拟后台驳回 */
  const handleReject = () => {
    showActionSheet({ itemList: REJECT_REASONS, itemColor: '#4A3F52' })
      .then((res) => {
        auditPhoto('已驳回', MOCK_AUDITOR, REJECT_REASONS[res.tapIndex] ?? REJECT_REASONS[0])
        showToast({ title: '已驳回，请重新提交照片', icon: 'none' })
      })
      .catch(() => {
        // 用户取消
      })
  }

  const renderStatusTag = () => {
    if (!audit) {
      return cardReady ? <MvTag tone='muted'>待提交</MvTag> : <MvTag tone='warning'>待解锁</MvTag>
    }
    if (audit.status === '待审核') {
      return (
        <MvTag tone='warning' dot>
          审核中
        </MvTag>
      )
    }
    if (audit.status === '已通过') {
      return (
        <MvTag tone='success' dot>
          已下发
        </MvTag>
      )
    }
    return <MvTag tone='danger'>已驳回</MvTag>
  }

  return (
    <MvCard className='mcard' title='会员卡下发' icon='card' extra={renderStatusTag()}>
      {/* 未提交审核 */}
      {!audit && (
        <View>
          <View className='mcard__intro'>
            <Text className='mcard__intro-text'>
              {cardReady
                ? '门头照与自拍照已上传，提交后由后台审核，审核通过系统会自动下发一张已有会员卡。'
                : `上传门头照与自拍照后才能提交审核，当前还缺：${missingCardPhotos.join('、')}。`}
            </Text>
          </View>
          <View className='mcard__btn'>
            <MvButton block disabled={!cardReady} onClick={handleSubmit}>
              {cardReady ? '提交照片审核' : '请先上传门头照与自拍照'}
            </MvButton>
          </View>
        </View>
      )}

      {/* 审核中 / 已驳回 */}
      {!!audit && audit.status !== '已通过' && (
        <View>
          <View className='mcard__audit-info'>
            <View className='mcard__row'>
              <Text className='mcard__label'>提交时间</Text>
              <Text className='mcard__value'>{audit.submittedAt}</Text>
            </View>
            <View className='mcard__row'>
              <Text className='mcard__label'>审核内容</Text>
              <Text className='mcard__value'>门头照 · 自拍照</Text>
            </View>
          </View>

          {audit.status === '待审核' && (
            <View className='mcard__audit'>
              <MvIcon name='clock' size={14} color='#9C6F2A' />
              <Text className='mcard__audit-text'>
                后台正在核验门头照与自拍照，审核通过后系统会自动下发会员卡
              </Text>
            </View>
          )}

          {audit.status === '已驳回' && (
            <View className='mcard__reason'>
              <Text className='mcard__reason-text'>驳回原因：{audit.remark}</Text>
            </View>
          )}

          {audit.status === '待审核' ? (
            <View className='mcard__audit-actions'>
              <View className='mcard__audit-btn'>
                <MvButton type='ghost' size='sm' block onClick={handleReject}>
                  驳回
                </MvButton>
              </View>
              <View className='mcard__audit-btn'>
                <MvButton size='sm' block onClick={handleApprove}>
                  模拟审核通过
                </MvButton>
              </View>
            </View>
          ) : (
            <View style={{ marginTop: 12 }}>
              <MvButton type='soft' size='sm' block onClick={handleSubmit}>
                重新提交照片审核
              </MvButton>
            </View>
          )}
        </View>
      )}

      {/* 审核通过：展示系统下发的会员卡 */}
      {!!audit && audit.status === '已通过' && !!record && (
        <View className='mcard__record mcard__record--passed'>
          <View className='mcard__record-head'>
            <Text className='mcard__record-type'>{record.cardType}</Text>
            <Text className='mcard__record-amount'>¥{record.faceValue}</Text>
          </View>

          <View className='mcard__holder'>
            <MvIcon name='user' size={15} color='#7B6A86' />
            <Text className='mcard__holder-text'>
              {record.holderName} · {record.holderPhone}
            </Text>
            <MvTag tone='success'>已下发</MvTag>
          </View>

          <View className='mcard__rows'>
            <View className='mcard__row'>
              <Text className='mcard__label'>卡号</Text>
              <Text className='mcard__value'>{record.cardNo}</Text>
            </View>
            <View className='mcard__row'>
              <Text className='mcard__label'>权益</Text>
              <Text className='mcard__value'>{record.benefit}</Text>
            </View>
            <View className='mcard__row'>
              <Text className='mcard__label'>有效期</Text>
              <Text className='mcard__value'>至 {record.expireAt}</Text>
            </View>
            <View className='mcard__row'>
              <Text className='mcard__label'>下发时间</Text>
              <Text className='mcard__value'>{record.issuedAt}</Text>
            </View>
            <View className='mcard__row'>
              <Text className='mcard__label'>审核结果</Text>
              <Text className='mcard__value'>
                {audit.auditor} · {audit.auditedAt}
              </Text>
            </View>
          </View>
        </View>
      )}
    </MvCard>
  )
}
