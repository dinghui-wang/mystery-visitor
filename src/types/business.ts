/** 首页的四种业务状态（单页切换，不做路由跳转） */
export type PageState = 'welcome' | 'home' | 'task' | 'review'

/** 门店类型（徐东理发连锁） */
export type ShopType = '直营旗舰店' | '标准门店' | '社区快剪店'

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

/** 到访图片分类：门头照 1 张、自拍照 1 张、店内环境照 2 张 */
export type PhotoCategory = '门头' | '自拍' | '环境'

/** 到访图片 */
export interface VisitPhoto {
  id: string
  category: PhotoCategory
  path: string
  shotAt: string
}

/** 照片审核状态：提交门头照与自拍照后由后台审核 */
export type AuditStatus = '待审核' | '已通过' | '已驳回'

/** 照片审核记录 */
export interface PhotoAudit {
  status: AuditStatus
  submittedAt: string
  /** 审核人（后台运营） */
  auditor: string
  auditedAt: string
  /** 驳回原因 */
  remark: string
}

/** 系统中已有的会员卡，下发时直接选用，不支持手工录入 */
export interface CardStockItem {
  id: string
  cardNo: string
  cardType: string
  faceValue: number
  benefit: string
  expireAt: string
  /** 持卡人姓名（已脱敏，如 柳XX） */
  holderName: string
  holderPhone: string
}

/** 会员卡下发记录（真实会员卡的发放登记，与微信卡包无关） */
export interface MemberCardIssue {
  /** 对应已有会员卡的 id */
  stockId: string
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
  checkIn: CheckInRecord | null
  photos: VisitPhoto[]
  /** 门头照 + 自拍照的审核记录 */
  photoAudit: PhotoAudit | null
  /** 审核通过后系统自动下发的会员卡 */
  cardIssue: MemberCardIssue | null
  submittedAt: string | null
}

/** 回访问卷答案（与 FORM_SECTIONS 对应） */
export interface ReviewRecord {
  gender: string
  age: string
  city: string
  shopNo: string
  experienceDate: string
  experienceTime: string
  experienceProjects: string[]
  consented: boolean
  answers: Record<string, string | string[]>
  sectionNotes: { service: string; hygiene: string; sendOff: string }
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
  | { type: 'goHome' }
  | { type: 'resumeTask' }
  | { type: 'acceptTask'; taskId: string }
  | { type: 'checkIn'; record: CheckInRecord }
  | { type: 'addPhotos'; photos: VisitPhoto[] }
  | { type: 'removePhoto'; photoId: string }
  | { type: 'submitPhotoAudit' }
  | {
      type: 'auditPhoto'
      status: Exclude<AuditStatus, '待审核'>
      auditor: string
      remark: string
    }
  | { type: 'submitTask'; submittedAt: string }
  | { type: 'submitReview'; review: ReviewRecord }
  | { type: 'reset' }
