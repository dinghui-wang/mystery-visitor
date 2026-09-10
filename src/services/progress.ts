import { PHOTO_CATEGORIES, PHOTOS_FOR_CARD } from './mock'
import type { MysteryTask, PhotoCategory } from '../types/business'

export interface TaskStep {
  key: string
  title: string
  done: boolean
}

/** 任务四个步骤的完成情况（会员卡在照片审核通过后由系统下发） */
export function getTaskSteps(task: MysteryTask): TaskStep[] {
  return [
    { key: 'checkIn', title: '到店打卡', done: !!task.checkIn },
    { key: 'photos', title: '到访图片', done: getMissingPhotoCategories(task).length === 0 },
    { key: 'card', title: '会员卡下发', done: !!task.cardIssue },
    { key: 'submit', title: '提交任务', done: !!task.submittedAt },
  ]
}

/** 某个分类已上传的张数 */
export function countPhotos(task: MysteryTask, category: PhotoCategory): number {
  return task.photos.filter((photo) => photo.category === category).length
}

/**
 * 任务页「到访图片」还缺的分类。
 * 固定为门头照 + 自拍照，不读取任务数据，避免旧缓存把「环境」带回来。
 */
export function getMissingPhotoCategories(task: MysteryTask): PhotoCategory[] {
  return PHOTOS_FOR_CARD.filter((name) => {
    const config = PHOTO_CATEGORIES.find((item) => item.name === name)
    return countPhotos(task, name) < (config?.min ?? 1)
  })
}

/** 登记会员卡还缺的图片（门头照 + 自拍照） */
export function getMissingCardPhotos(task: MysteryTask): PhotoCategory[] {
  return PHOTOS_FOR_CARD.filter((name) => countPhotos(task, name) < 1)
}

/** 是否已满足登记会员卡的图片条件 */
export function canIssueCard(task: MysteryTask): boolean {
  return getMissingCardPhotos(task).length === 0
}

/** 未完成步骤名称，用于提交校验提示 */
export function getPendingStepTitles(task: MysteryTask): string[] {
  return getTaskSteps(task)
    .filter((step) => step.key !== 'submit' && !step.done)
    .map((step) => step.title)
}

/** 0 ~ 1 的完成度 */
export function getTaskProgress(task: MysteryTask): number {
  const steps = getTaskSteps(task).filter((step) => step.key !== 'submit')
  const done = steps.filter((step) => step.done).length
  return steps.length ? done / steps.length : 0
}
