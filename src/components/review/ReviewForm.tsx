import { useEffect, useState } from 'react'
import { Input, Text, Textarea, View } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import {
  EXPERIENCE_PROJECTS,
  FORM_SECTIONS,
  computeScore,
  type AnswerValue,
  type FormItem,
} from '../../constants/reviewForm'
import { useVisitor } from '../../store/VisitorContext'
import { formatDate, formatNow } from '../../utils/date'
import { cx } from '../../utils/px'
import MvButton from '../ui/MvButton'
import MvCard from '../ui/MvCard'
import MvExitMenu from '../ui/MvExitMenu'
import './ReviewForm.scss'

const TYPED = '\u00A0' // 用 &nbsp; 风格空格

export default function ReviewForm() {
  const { state, submitReview } = useVisitor()
  const task = state.activeTask

  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [city, setCity] = useState('')
  const [shopNo, setShopNo] = useState('')
  const [experienceDate, setExperienceDate] = useState('')
  const [experienceTime, setExperienceTime] = useState('')
  const [experienceProjects, setExperienceProjects] = useState<string[]>([])
  const [consented, setConsented] = useState(false)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [sectionNotes, setSectionNotes] = useState({ service: '', hygiene: '', sendOff: '' })

  useEffect(() => {
    if (!task) return
    setCity((prev) => prev || '武汉')
    setShopNo((prev) => prev || task.id)
    const now = new Date()
    const date = formatDate(now)
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setExperienceDate((prev) => prev || date)
    setExperienceTime((prev) => prev || time)
  }, [task])

  if (!task) return null

  const toggleProject = (item: string) => {
    setExperienceProjects((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
    )
  }

  const handleToggle = (item: FormItem, option: string) => {
    if (item.multi) {
      const current = Array.isArray(answers[item.key]) ? (answers[item.key] as string[]) : []
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option]
      setAnswers((prev) => ({ ...prev, [item.key]: next }))
    } else {
      setAnswers((prev) => ({ ...prev, [item.key]: option }))
    }
  }

  const isSelected = (item: FormItem, option: string) => {
    const v = answers[item.key]
    return item.multi ? Array.isArray(v) && v.includes(option) : v === option
  }

  const basicFilled = !!gender && !!age && !!city && !!shopNo && !!experienceDate && !!experienceTime
  const projectsChosen = experienceProjects.length > 0
  const allAnswered = FORM_SECTIONS.every((section) =>
    section.items.every((item) => {
      const v = answers[item.key]
      if (item.multi) return Array.isArray(v) && v.length > 0
      return typeof v === 'string' && v.length > 0
    })
  )
  const ready = basicFilled && projectsChosen && allAnswered && consented

  const handleSubmit = () => {
    if (!basicFilled) {
      showToast({ title: '请完整填写神秘顾客基本信息', icon: 'none' })
      return
    }
    if (!projectsChosen) {
      showToast({ title: '请至少选择一项体验项目', icon: 'none' })
      return
    }
    if (!allAnswered) {
      showToast({ title: '请完成全部调查项目', icon: 'none' })
      return
    }
    if (!consented) {
      showToast({ title: '请勾选认同本次调查内容真实有效', icon: 'none' })
      return
    }
    submitReview({
      gender,
      age,
      city,
      shopNo,
      experienceDate,
      experienceTime,
      experienceProjects,
      consented,
      answers,
      sectionNotes,
      score: computeScore(answers),
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
            <Text className='review__title'>徐东美发全国神秘顾客走访调查问卷</Text>
            <Text className='review__subtitle'>{task.shopName}</Text>
          </View>
          <MvExitMenu />
        </View>
      </View>

      <View className='review__body'>
        {/* 基本信息 */}
        <MvCard className='review__card' title='必填：神秘顾客基本信息' icon='user'>
          <View className='review__basic-grid'>
            <Field label='性别' value={gender} onChange={setGender} placeholder='男 / 女' />
            <Field label='年龄' value={age} onChange={setAge} placeholder='如 28' inputType='number' />
            <Field label='体验城市' value={city} onChange={setCity} placeholder='如 武汉' />
            <Field label='体验店号' value={shopNo} onChange={setShopNo} placeholder='如 MV-26091001' />
            <Field label='体验日期' value={experienceDate} onChange={setExperienceDate} placeholder='YYYY-MM-DD' />
            <Field label='体验时间' value={experienceTime} onChange={setExperienceTime} placeholder='HH:mm' />
          </View>

          <View className='review__projects'>
            <Text className='review__projects-label'>
              体验项目 <Text className='review__required'>*</Text>
            </Text>
            <View className='review__projects-list'>
              {EXPERIENCE_PROJECTS.map((item) => {
                const on = experienceProjects.includes(item)
                return (
                  <Text
                    key={item}
                    className={cx('review__pill', on && 'review__pill--on')}
                    onClick={() => toggleProject(item)}
                  >
                    {item}
                  </Text>
                )
              })}
            </View>
          </View>
        </MvCard>

        {/* 温馨提示 */}
        <View className='review__notice'>
          填写真实感受，您将获得长期免费剪发服务. 若存在虚假不真实内容，您将永久失去免费剪发机会.
        </View>

        {/* 认同请打 √ */}
        <View className='review__consent' onClick={() => setConsented((v) => !v)}>
          <View className={cx('review__consent-box', consented && 'review__consent-box--on')}>
            {consented && <Text className='review__consent-tick'>√</Text>}
          </View>
          <Text className='review__consent-text'>认同请打 {TYPED}√{TYPED} · 我认同本次调查内容真实有效</Text>
        </View>

        {/* 调查表 */}
        {FORM_SECTIONS.map((section, sIndex) => (
          <View key={section.key} className='review__section-card'>
            <View className='review__section-head'>
              <Text className='review__section-title'>{section.title}</Text>
              {!!section.noteField && (
                <View className='review__section-note-hint'>本板块建议/意见（选填）</View>
              )}
            </View>

            {section.items.map((item, iIndex) => (
              <View key={item.key} className='review__item'>
                <View className='review__item-head'>
                  <Text className='review__item-no'>
                    {sIndex + 1}.{iIndex + 1}
                  </Text>
                  <Text className='review__item-text'>{item.text}</Text>
                </View>
                <View className='review__options'>
                  {item.options.map((opt) => {
                    const on = isSelected(item, opt)
                    return (
                      <Text
                        key={opt}
                        className={cx('review__pill', on && 'review__pill--on')}
                        onClick={() => handleToggle(item, opt)}
                      >
                        {opt}
                      </Text>
                    )
                  })}
                </View>
                {!!item.noteHint && <Text className='review__item-hint'>{item.noteHint}</Text>}
              </View>
            ))}

            {!!section.noteField && (
              <Textarea
                className='review__section-textarea'
                value={sectionNotes[section.noteField]}
                maxlength={200}
                placeholder='请填写本板块的建议或意见…'
                placeholderStyle='color:#B5AEBD'
                onInput={(event) =>
                  setSectionNotes((prev) => ({ ...prev, [section.noteField!]: event.detail.value }))
                }
              />
            )}
          </View>
        ))}

        {/* 底部联系信息 */}
        <View className='review__footer'>
          <Text className='review__footer-title'>徐东美发全国统一服务热线</Text>
          <Text className='review__footer-phone'>400 900 7686</Text>
          <Text className='review__footer-tip'>有任何建议或疑问请加全国统一服务号</Text>
        </View>
      </View>

      <View className='review__submit-bar'>
        <Text className='review__submit-hint'>
          {ready
            ? '提交后本单计入历史记录并发放积分'
            : '完成神秘顾客基本信息、全部调查项目与认同勾选后可提交'}
        </Text>
        <MvButton block size='lg' type={ready ? 'primary' : 'soft'} onClick={handleSubmit}>
          {ready ? '提交回访' : '请完成问卷内容'}
        </MvButton>
      </View>
    </View>
  )
}

interface FieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  inputType?: 'text' | 'number'
}

function Field({ label, value, onChange, placeholder, inputType = 'text' }: FieldProps) {
  return (
    <View className='review__field'>
      <Text className='review__field-label'>
        {label}
        <Text className='review__required'> *</Text>
      </Text>
      <Input
        className='review__field-input'
        value={value}
        type={inputType}
        maxlength={20}
        placeholder={placeholder}
        placeholderClass='review__field-placeholder'
        onInput={(event) => onChange(event.detail.value)}
      />
    </View>
  )
}
