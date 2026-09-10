/** 首页的四种业务状态（单页切换，不做路由跳转） */
export type PageState = 'welcome' | 'home' | 'task' | 'review'

/** 门店品类 */
export type ShopType = '生活美容' | '美甲美睫' | '皮肤管理'

/** 暗访员档案 */
export interface VisitorProfile {
  staffNo: string
  name: string
  level: string
  points: number
  monthTarget: number
  joinedAt: string
}

/** 到店打卡记录 */
export interface CheckInRecord {
  lat: number
  lng: number
  distance: number
  address: string
  checkedAt: string
  simulated: boolean
}

/** 到访图片分类 */
export type PhotoCategory = '门头' | '环境' | '服务过程' | '消费小票'

/** 到访图片 */
export interface VisitPhoto {
  id: string
  category: PhotoCategory
  path: string
  shotAt: string
}

/** 会员卡下发记录（真实会员卡的发放登记，与微信卡包无关） */
export interface MemberCardIssue {
  cardType: string
  cardNo: string
  faceValue: number
  benefit: string
  expireAt: string
  holderName: string
  holderPhone: string
  photoPath: string
  remark: string
  issuedAt: string
}

/** 任务状态：待领取（任务池） → 进行中 → 待回访 → 已完成 */
export type TaskStatus = '待领取' | '进行中' | '待回访' | '已完成'

/** 暗访任务 */
export interface MysteryTask {
  id: string
  status: TaskStatus
  shopName: string
  shopType: ShopType
  address: string
  lat: number
  lng: number
  appointAt: string
  project: string
  budget: number
  contact: string
  notes: string
  requirePhotos: PhotoCategory[]
  cardTypes: string[]
  checkIn: CheckInRecord | null
  photos: VisitPhoto[]
  cardIssue: MemberCardIssue | null
  submittedAt: string | null
}

/** 回访表单 */
export interface ReviewRecord {
  scores: Record<string, number>
  pushedSale: string
  recommendCard: string
  revisit: string
  highlights: string[]
  comment: string
  photos: string[]
  score: number
  submittedAt: string
}

/** 历史暗访记录 */
export interface HistoryItem {
  id: string
  shopName: string
  shopType: ShopType
  date: string
  score: number
  budget: number
  status: TaskStatus
}

/** 全局状态 */
export interface VisitorState {
  pageState: PageState
  profile: VisitorProfile | null
  pool: MysteryTask[]
  activeTask: MysteryTask | null
  history: HistoryItem[]
}

export type VisitorAction =
  | { type: 'login'; profile: VisitorProfile }
  | { type: 'logout' }
  | { type: 'acceptTask'; taskId: string }
  | { type: 'checkIn'; record: CheckInRecord }
  | { type: 'addPhotos'; photos: VisitPhoto[] }
  | { type: 'removePhoto'; photoId: string }
  | { type: 'issueCard'; issue: MemberCardIssue }
  | { type: 'submitTask'; submittedAt: string }
  | { type: 'submitReview'; review: ReviewRecord }
  | { type: 'reset' }
