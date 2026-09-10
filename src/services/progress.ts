import { PHOTO_CATEGORIES } from './mock'
import type { MysteryTask, PhotoCategory } from '../types/business'

export interface TaskStep {
  key: string
  title: string
  done: boolean
}

/** 任务四个步骤的完成情况 */
export function getTaskSteps(task: MysteryTask): TaskStep[] {
  return [
    { key: 'checkIn', title: '到店打卡', done: !!task.checkIn },
    { key: 'photos', title: '到访图片', done: getMissingPhotoCategories(task).length === 0 },
    { key: 'card', title: '会员卡下发', done: !!task.cardIssue },
    { key: 'submit', title: '提交任务', done: !!task.submittedAt },
  ]
}

/** 尚未满足最低张数的图片分类 */
export function getMissingPhotoCategories(task: MysteryTask): PhotoCategory[] {
  return PHOTO_CATEGORIES.filter((item) => {
    if (!task.requirePhotos.includes(item.name)) return false
    const count = task.photos.filter((photo) => photo.category === item.name).length
    return count < item.min
  }).map((item) => item.name)
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
