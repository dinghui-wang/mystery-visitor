import { useState } from 'react'
import { Image, Text, View, type ITouchEvent } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { icon } from '../../constants/icons'
import { notifyPickError, pickImages, previewImage, uid } from '../../services/media'
import { PHOTO_CATEGORIES } from '../../services/mock'
import type { PhotoCategory, VisitPhoto } from '../../types/business'
import { formatNow } from '../../utils/date'
import { cx, rpx } from '../../utils/px'
import MvIcon from '../ui/MvIcon'
import './PhotoUploader.scss'

interface PhotoUploaderProps {
  /** 需要展示的分类 */
  categories: PhotoCategory[]
  photos: VisitPhoto[]
  onAdd: (photos: VisitPhoto[]) => void
  onRemove: (photoId: string) => void
}

/** 可复用的到访图片上传器：分类页签 + 九宫格预览 + 删除 */
export default function PhotoUploader({
  categories,
  photos,
  onAdd,
  onRemove,
}: PhotoUploaderProps) {
  const [active, setActive] = useState<PhotoCategory>(categories[0] ?? '门头')

  const current: PhotoCategory = categories.includes(active) ? active : categories[0] ?? '门头'
  const config = PHOTO_CATEGORIES.find((item) => item.name === current)
  const list = photos.filter((photo) => photo.category === current)
  const remain = Math.max(0, (config?.max ?? 0) - list.length)

  const handleAdd = async () => {
    if (!config) return
    if (remain <= 0) {
      showToast({ title: `「${current}」最多上传 ${config.max} 张`, icon: 'none' })
      return
    }
    try {
      const paths = await pickImages(remain)
      if (!paths.length) return
      onAdd(
        paths.map((path) => ({
          id: uid('photo'),
          category: current,
          path,
          shotAt: formatNow(),
        }))
      )
    } catch (error) {
      notifyPickError(error)
    }
  }

  const countText = config
    ? config.min === config.max
      ? `需上传 ${config.min} 张`
      : `至少 ${config.min} 张，最多 ${config.max} 张`
    : ''

  return (
    <View>
      {categories.length > 1 && (
        <View className='uploader__tabs'>
          {categories.map((name) => {
            const cfg = PHOTO_CATEGORIES.find((item) => item.name === name)
            const count = photos.filter((photo) => photo.category === name).length
            return (
              <View
                key={name}
                className={cx(
                  'uploader__tab',
                  current === name && 'uploader__tab--active',
                  !!cfg && count >= cfg.min && 'uploader__tab--done'
                )}
                onClick={() => setActive(name)}
              >
                {name}
                <Text className='uploader__tab-note'>
                  {count}/{cfg?.max ?? 0}
                </Text>
              </View>
            )
          })}
        </View>
      )}

      <Text className='uploader__tip'>
        {config?.tip} · {countText}
      </Text>

      <View className='uploader__grid'>
        {list.map((photo) => (
          <View
            key={photo.id}
            className='uploader__cell'
            onClick={() => previewImage(photo.path, list.map((item) => item.path))}
          >
            <Image className='uploader__img' src={photo.path} mode='aspectFill' />
            <View
              className='uploader__del'
              onClick={(event: ITouchEvent) => {
                event.stopPropagation()
                onRemove(photo.id)
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
          <View className='uploader__cell uploader__add' onClick={handleAdd}>
            <MvIcon name='plus' size={20} color='#9C8AA5' />
            <Text className='uploader__add-text'>还可加 {remain} 张</Text>
          </View>
        )}
      </View>
    </View>
  )
}
