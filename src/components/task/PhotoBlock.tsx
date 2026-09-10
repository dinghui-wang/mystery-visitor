import { useState } from 'react'
import { Image, Text, View, type ITouchEvent } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { icon } from '../../constants/icons'
import { notifyPickError, pickImages, previewImage, uid } from '../../services/media'
import { PHOTO_CATEGORIES } from '../../services/mock'
import { getMissingPhotoCategories } from '../../services/progress'
import { useVisitor } from '../../store/VisitorContext'
import type { MysteryTask, PhotoCategory } from '../../types/business'
import { formatNow } from '../../utils/date'
import { rpx } from '../../utils/px'
import MvCard from '../ui/MvCard'
import MvIcon from '../ui/MvIcon'
import MvTag from '../ui/MvTag'
import './PhotoBlock.scss'

interface PhotoBlockProps {
  task: MysteryTask
}

export default function PhotoBlock({ task }: PhotoBlockProps) {
  const { addPhotos, removePhoto } = useVisitor()
  const categories = PHOTO_CATEGORIES.filter((item) => task.requirePhotos.includes(item.name))
  const [active, setActive] = useState<PhotoCategory>(categories[0]?.name ?? '门头')

  const config = PHOTO_CATEGORIES.find((item) => item.name === active) ?? categories[0]
  const photos = task.photos.filter((photo) => photo.category === active)
  const remain = Math.max(0, (config?.max ?? 0) - photos.length)
  const missing = getMissingPhotoCategories(task)

  const handleAdd = async () => {
    if (!config) return
    if (remain <= 0) {
      showToast({ title: `「${active}」最多上传 ${config.max} 张`, icon: 'none' })
      return
    }
    try {
      const paths = await pickImages(remain)
      if (!paths.length) return
      addPhotos(
        paths.map((path) => ({
          id: uid('photo'),
          category: active,
          path,
          shotAt: formatNow(),
        }))
      )
    } catch (error) {
      notifyPickError(error)
    }
  }

  return (
    <MvCard
      className='photo'
      title='到访图片'
      icon='camera'
      extra={
        <MvTag tone={missing.length ? 'warning' : 'success'}>
          {missing.length ? `缺 ${missing.length} 类` : '已齐全'}
        </MvTag>
      }
    >
      <View className='photo__tabs'>
        {categories.map((item) => {
          const count = task.photos.filter((photo) => photo.category === item.name).length
          return (
            <View
              key={item.name}
              className={`photo__tab ${active === item.name ? 'photo__tab--active' : ''} ${
                count >= item.min ? 'photo__tab--done' : ''
              }`}
              onClick={() => setActive(item.name)}
            >
              {item.name}
              <Text className='photo__tab-note'>
                {count}/{item.max}
              </Text>
            </View>
          )
        })}
      </View>

      <Text className='photo__tip'>
        {config?.tip} · 至少 {config?.min} 张，最多 {config?.max} 张
      </Text>

      <View className='photo__grid'>
        {photos.map((photo) => (
          <View
            key={photo.id}
            className='photo__cell'
            onClick={() => previewImage(photo.path, photos.map((item) => item.path))}
          >
            <Image className='photo__img' src={photo.path} mode='aspectFill' />
            <View
              className='photo__del'
              onClick={(event: ITouchEvent) => {
                event.stopPropagation()
                removePhoto(photo.id)
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

        {remain > 0 && (
          <View className='photo__cell photo__add' onClick={handleAdd}>
            <MvIcon name='plus' size={20} color='#9C8AA5' />
            <Text className='photo__add-text'>还可加 {remain} 张</Text>
          </View>
        )}
      </View>

      {!!missing.length && (
        <Text className='photo__missing'>仍需补充：{missing.join('、')}</Text>
      )}
    </MvCard>
  )
}
