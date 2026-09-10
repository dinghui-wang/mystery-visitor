import { useState } from 'react'
import { Image, Text, Textarea, View, type ITouchEvent } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { icon } from '../../constants/icons'
import { notifyPickError, pickImages, previewImage } from '../../services/media'
import { REVIEW_DIMENSIONS, REVIEW_HIGHLIGHTS } from '../../services/mock'
import { useVisitor } from '../../store/VisitorContext'
import { formatNow } from '../../utils/date'
import { cx, rpx } from '../../utils/px'
import MvButton from '../ui/MvButton'
import MvCard from '../ui/MvCard'
import MvExitMenu from '../ui/MvExitMenu'
import MvIcon from '../ui/MvIcon'
import MvRate from '../ui/MvRate'
import './ReviewForm.scss'

const QUESTIONS = [
  { key: 'pushedSale', label: '服务过程中是否被主动推销？', options: ['是，多次推荐', '是，仅一次', '否'] },
  { key: 'recommendCard', label: '门店是否推荐办理会员卡？', options: ['是，主动推荐', '提及但未强推', '否'] },
  { key: 'revisit', label: '你的复购意愿是？', options: ['愿意', '一般', '不愿意'] },
] as const

const MIN_COMMENT = 10
const MAX_PHOTOS = 3

export default function ReviewForm() {
  const { state, submitReview } = useVisitor()
  const task = state.activeTask

  const [scores, setScores] = useState<Record<string, number>>({})
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [highlights, setHighlights] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

  if (!task) return null

  const scoredCount = REVIEW_DIMENSIONS.filter((item) => scores[item.key]).length
  const answeredCount = QUESTIONS.filter((item) => answers[item.key]).length
  const ready =
    scoredCount === REVIEW_DIMENSIONS.length &&
    answeredCount === QUESTIONS.length &&
    comment.trim().length >= MIN_COMMENT

  const toggleHighlight = (name: string) => {
    setHighlights((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    )
  }

  const handleAddPhoto = async () => {
    const remain = MAX_PHOTOS - photos.length
    if (remain <= 0) {
      showToast({ title: `最多上传 ${MAX_PHOTOS} 张`, icon: 'none' })
      return
    }
    try {
      const paths = await pickImages(remain)
      if (paths.length) setPhotos((prev) => [...prev, ...paths])
    } catch (error) {
      notifyPickError(error)
    }
  }

  const handleSubmit = () => {
    if (scoredCount !== REVIEW_DIMENSIONS.length) {
      showToast({ title: '请完成全部维度评分', icon: 'none' })
      return
    }
    if (answeredCount !== QUESTIONS.length) {
      showToast({ title: '请完成全部选择项', icon: 'none' })
      return
    }
    if (comment.trim().length < MIN_COMMENT) {
      showToast({ title: `体验描述不少于 ${MIN_COMMENT} 字`, icon: 'none' })
      return
    }

    const total = REVIEW_DIMENSIONS.reduce((sum, item) => sum + (scores[item.key] ?? 0), 0)
    const score = Number((total / REVIEW_DIMENSIONS.length).toFixed(1))

    submitReview({
      scores,
      pushedSale: answers.pushedSale ?? '',
      recommendCard: answers.recommendCard ?? '',
      revisit: answers.revisit ?? '',
      highlights,
      comment: comment.trim(),
      photos,
      score,
      submittedAt: formatNow(),
    })
    showToast({ title: '回访已提交，+120 积分', icon: 'none', duration: 1600 })
  }

  return (
    <View className='review'>
      <View className='review__hero'>
        <View className='review__blob' />
        <View className='review__head'>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text className='review__title'>暗访回访表</Text>
            <Text className='review__subtitle'>真实还原到店体验，帮助品牌看见服务细节</Text>
          </View>
          <MvExitMenu />
        </View>
        <View className='review__shop'>
          <Text className='review__shop-name'>{task.shopName}</Text>
          <Text className='review__shop-meta'>
            {task.shopType} · {task.project} · 到店 {task.checkIn?.checkedAt ?? task.appointAt}
          </Text>
        </View>
      </View>

      <View className='review__body'>
        <MvCard
          className='review__card'
          title='服务评分'
          icon='sparkle'
          extra={<Text style={{ fontSize: '12px', color: '#8B8195' }}>{scoredCount}/5</Text>}
        >
          {REVIEW_DIMENSIONS.map((item) => (
            <View key={item.key} className='review__dim'>
              <View className='review__dim-head'>
                <View style={{ flex: 1 }}>
                  <Text className='review__dim-name'>{item.key}</Text>
                  <Text className='review__dim-desc'>{item.desc}</Text>
                </View>
                <MvRate
                  value={scores[item.key] ?? 0}
                  onChange={(value) => setScores((prev) => ({ ...prev, [item.key]: value }))}
                />
              </View>
            </View>
          ))}
        </MvCard>

        <MvCard className='review__card' title='关键观察项' icon='note'>
          {QUESTIONS.map((question) => (
            <View key={question.key} style={{ marginBottom: 4 }}>
              <Text className='review__group-label'>{question.label}</Text>
              <View className='review__options'>
                {question.options.map((option) => (
                  <Text
                    key={option}
                    className={cx(
                      'review__option',
                      answers[question.key] === option && 'review__option--active'
                    )}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [question.key]: option }))
                    }
                  >
                    {option}
                  </Text>
                ))}
              </View>
            </View>
          ))}

          <Text className='review__group-label'>服务亮点（多选）</Text>
          <View className='review__options'>
            {REVIEW_HIGHLIGHTS.map((name) => (
              <Text
                key={name}
                className={cx('review__option', highlights.includes(name) && 'review__option--active')}
                onClick={() => toggleHighlight(name)}
              >
                {name}
              </Text>
            ))}
          </View>
        </MvCard>

        <MvCard className='review__card' title='体验描述' icon='note'>
          <View className='review__textarea-wrap'>
            <Textarea
              className='review__textarea'
              value={comment}
              maxlength={500}
              placeholder='请客观描述接待流程、服务细节与整体感受，例如进店是否被及时迎接、护理时长是否符合承诺…'
              placeholderStyle='color:#B5AEBD'
              onInput={(event) => setComment(event.detail.value)}
            />
            <Text className='review__count'>{comment.length}/500</Text>
          </View>
        </MvCard>

        <MvCard
          className='review__card'
          title='补充凭证'
          icon='image'
          extra={<Text style={{ fontSize: '12px', color: '#8B8195' }}>{photos.length}/{MAX_PHOTOS}</Text>}
        >
          <View className='review__grid'>
            {photos.map((path) => (
              <View key={path} className='review__cell' onClick={() => previewImage(path, photos)}>
                <Image className='review__img' src={path} mode='aspectFill' />
                <View
                  className='review__del'
                  onClick={(event: ITouchEvent) => {
                    event.stopPropagation()
                    setPhotos((prev) => prev.filter((item) => item !== path))
                  }}
                >
                  <View
                    className='mv-icon'
                    style={{
                      width: rpx(12),
                      height: rpx(12),
                      backgroundImage: icon('close', '#FFFFFF', 2),
                    }}
                  />
                </View>
              </View>
            ))}
            {photos.length < MAX_PHOTOS && (
              <View className='review__cell review__add' onClick={handleAddPhoto}>
                <MvIcon name='plus' size={20} color='#9C8AA5' />
                <Text className='review__add-text'>添加图片</Text>
              </View>
            )}
          </View>
        </MvCard>
      </View>

      <View className='review__submit-bar'>
        <Text className='review__submit-hint'>
          {ready ? '提交后本单计入历史记录并发放积分' : '完成全部评分、选择项与体验描述后可提交'}
        </Text>
        <MvButton block size='lg' type={ready ? 'primary' : 'soft'} onClick={handleSubmit}>
          {ready ? '提交回访' : '请完成回访内容'}
        </MvButton>
      </View>
    </View>
  )
}
