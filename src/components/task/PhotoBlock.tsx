import { Text } from '@tarojs/components'
import { PHOTOS_FOR_CARD } from '../../services/mock'
import { canIssueCard, getMissingCardPhotos, getMissingPhotoCategories } from '../../services/progress'
import { useVisitor } from '../../store/VisitorContext'
import type { MysteryTask } from '../../types/business'
import { cx } from '../../utils/px'
import PhotoUploader from '../common/PhotoUploader'
import MvCard from '../ui/MvCard'
import MvTag from '../ui/MvTag'
import './PhotoBlock.scss'

interface PhotoBlockProps {
  task: MysteryTask
}

/** 任务页的到访图片：门头照 1 张 + 自拍照 1 张，作为会员卡审核依据 */
export default function PhotoBlock({ task }: PhotoBlockProps) {
  const { addPhotos, removePhoto } = useVisitor()
  const missing = getMissingPhotoCategories(task)
  const cardReady = canIssueCard(task)
  const missingCardPhotos = getMissingCardPhotos(task)

  return (
    <MvCard
      className='photo'
      title='到访图片'
      subtitle='门头 1 · 自拍 1'
      icon='camera'
      extra={
        <MvTag tone={missing.length ? 'warning' : 'success'}>
          {missing.length ? `缺 ${missing.join('、')}` : '已齐全'}
        </MvTag>
      }
    >
      <PhotoUploader
        categories={PHOTOS_FOR_CARD}
        photos={task.photos}
        onAdd={addPhotos}
        onRemove={removePhoto}
      />

      {!!missing.length && <Text className='photo__missing'>仍需补充：{missing.join('、')}</Text>}

      <Text className={cx('photo__card-hint', cardReady && 'photo__card-hint--ok')}>
        {cardReady
          ? '门头照与自拍照已上传，可登记会员卡并等待后台审核'
          : `门头照与自拍照是后台审核会员卡的依据${missingCardPhotos.length ? `，还缺：${missingCardPhotos.join('、')}` : ''}`}
      </Text>
    </MvCard>
  )
}
