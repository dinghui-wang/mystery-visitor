import { useState } from 'react'
import { Image, Text, View } from '@tarojs/components'
import { previewImage } from '../../services/media'
import type { MysteryTask } from '../../types/business'
import MvButton from '../ui/MvButton'
import MvCard from '../ui/MvCard'
import MvIcon from '../ui/MvIcon'
import MvTag from '../ui/MvTag'
import MemberCardSheet from './MemberCardSheet'
import './MemberCardBlock.scss'

interface MemberCardBlockProps {
  task: MysteryTask
}

export default function MemberCardBlock({ task }: MemberCardBlockProps) {
  const [visible, setVisible] = useState(false)
  const record = task.cardIssue

  return (
    <MvCard
      className='mcard'
      title='会员卡下发'
      icon='card'
      extra={
        record ? <MvTag tone='success' dot>已下发</MvTag> : <MvTag tone='muted'>待下发</MvTag>
      }
    >
      {!record ? (
        <View>
          <View className='mcard__intro'>
            <Text className='mcard__intro-text'>
              到店后请将门店提供的真实会员卡交付给体验人（用于本次免费体验消费结算），并在此登记卡号、面额与有效期等信息作为下发凭证。
            </Text>
          </View>
          <View className='mcard__btn'>
            <MvButton block onClick={() => setVisible(true)}>
              登记会员卡下发
            </MvButton>
          </View>
        </View>
      ) : (
        <View>
          <View className='mcard__record'>
            <View className='mcard__record-head'>
              <Text className='mcard__record-type'>{record.cardType}</Text>
              <MvTag tone='rose'>已下发</MvTag>
            </View>
            <View className='mcard__rows'>
              <View className='mcard__row'>
                <Text className='mcard__label'>卡号</Text>
                <Text className='mcard__value'>{record.cardNo}</Text>
              </View>
              <View className='mcard__row'>
                <Text className='mcard__label'>面额</Text>
                <Text className='mcard__value mcard__value--amount'>¥{record.faceValue}</Text>
              </View>
              <View className='mcard__row'>
                <Text className='mcard__label'>有效期</Text>
                <Text className='mcard__value'>{record.expireAt}</Text>
              </View>
              <View className='mcard__row'>
                <Text className='mcard__label'>持卡人</Text>
                <Text className='mcard__value'>
                  {record.holderName} {record.holderPhone}
                </Text>
              </View>
              <View className='mcard__row'>
                <Text className='mcard__label'>下发时间</Text>
                <Text className='mcard__value'>{record.issuedAt}</Text>
              </View>
            </View>

            {!!record.photoPath && (
              <View
                className='mcard__proof'
                onClick={() => previewImage(record.photoPath, [record.photoPath])}
              >
                <MvIcon name='image' size={16} color='#9C8AA5' />
                <Text className='mcard__proof-text'>卡面凭证已上传，点击查看</Text>
                <Image className='mcard__proof-img' src={record.photoPath} mode='aspectFill' />
              </View>
            )}

            {!!record.remark && <Text className='mcard__remark'>备注：{record.remark}</Text>}
          </View>
          <View style={{ marginTop: 10 }}>
            <MvButton type='soft' size='sm' block onClick={() => setVisible(true)}>
              重新登记
            </MvButton>
          </View>
        </View>
      )}

      <MemberCardSheet visible={visible} task={task} onClose={() => setVisible(false)} />
    </MvCard>
  )
}
