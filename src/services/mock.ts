import type {
  CardStockItem,
  HistoryItem,
  MysteryTask,
  PhotoCategory,
  VisitorProfile,
  VisitorState,
} from '../types/business'

/** 演示账号：工号 + 密码 */
export const DEMO_ACCOUNT = {
  staffNo: 'MV20240901',
  password: 'mv123456',
}

/** 暗访员档案 */
export const MOCK_PROFILE: VisitorProfile = {
  staffNo: DEMO_ACCOUNT.staffNo,
  name: '林小满',
  level: '资深神秘顾客',
  points: 2680,
  monthTarget: 8,
  joinedAt: '2024-09-01',
}

/** 到访图片分类及各自的必传张数 */
export const PHOTO_CATEGORIES: { name: PhotoCategory; min: number; max: number; tip: string }[] = [
  { name: '门头', min: 1, max: 1, tip: '门店招牌与门牌号清晰可见' },
  { name: '自拍', min: 1, max: 1, tip: '本人在店内的打卡自拍，需露出门店环境' },
  { name: '环境', min: 2, max: 2, tip: '接待区、剪发区、洗头区等店内实景' },
]

/** 下发/审核会员卡所需的图片：门头照 + 自拍照各 1 张（任务页上传） */
export const PHOTOS_FOR_CARD: PhotoCategory[] = ['门头', '自拍']

/** 后台审核人（演示用） */
export const MOCK_AUDITOR = '运营督导 · 陈静'

/** 系统里已有的会员卡，审核通过后直接选用下发，不支持手工录入 */
export const MOCK_CARD_STOCK: CardStockItem[] = [
  {
    id: 'CARD-8801',
    cardNo: 'XD 8801 3327 6651',
    cardType: '洗剪吹体验卡',
    faceValue: 128,
    benefit: '免费洗剪吹 1 次（含造型）',
    expireAt: '2026-12-31',
    holderName: '柳XX',
    holderPhone: '13270449686',
  },
  {
    id: 'CARD-8802',
    cardNo: 'XD 8802 7714 0093',
    cardType: '烫染抵用卡',
    faceValue: 200,
    benefit: '烫染项目抵用 200 元',
    expireAt: '2026-11-30',
    holderName: '张XX',
    holderPhone: '13520177788',
  },
  {
    id: 'CARD-8803',
    cardNo: 'XD 8803 5561 8827',
    cardType: '头皮养护卡',
    faceValue: 360,
    benefit: '头皮养护 3 次 + 洗护套装',
    expireAt: '2027-03-31',
    holderName: '王XX',
    holderPhone: '13908655231',
  },
]

/** 体验项目（与回访问卷保持一致） */
export const EXPERIENCE_PROJECTS = ['洗吹', '剪发', '染烫', '护理']

/** 原始任务模板（每次重置时深拷贝，避免交叉污染） */
const TASK_TEMPLATES: MysteryTask[] = [
  {
    id: 'MV-26091001',
    status: '待领取',
    shopName: '徐东理发连锁（徐东旗舰店）',
    shopType: '直营旗舰店',
    address: '武汉市武昌区徐东大街 18 号徐东销品茂 3F-06',
    lat: 30.5936,
    lng: 114.3132,
    appointAt: '2026-09-10 15:30',
    project: '洗剪吹套餐 · 60 分钟体验',
    budget: 128,
    contact: '门店店长 · 138****6721',
    notes: '重点观察迎宾接待、发型沟通与洗剪吹流程规范性，全程不要主动透露身份。',
    checkIn: null,
    photos: [],
    photoAudit: null,
    cardIssue: null,
    submittedAt: null,
  },
  {
    id: 'MV-26091202',
    status: '待领取',
    shopName: '徐东理发连锁（光谷标准店）',
    shopType: '标准门店',
    address: '武汉市洪山区珞喻路 726 号光谷步行街 B1-12',
    lat: 30.5085,
    lng: 114.4002,
    appointAt: '2026-09-12 11:00',
    project: '烫染护理 · 120 分钟体验',
    budget: 398,
    contact: '前台 · 027-****8821',
    notes: '留意染发前的头皮隔离与过敏提示，记录加价项目与办卡推荐话术。',
    checkIn: null,
    photos: [],
    photoAudit: null,
    cardIssue: null,
    submittedAt: null,
  },
]

/** 历史暗访记录 */
const HISTORY_TEMPLATES: HistoryItem[] = [
  {
    id: 'MV-26090203',
    shopName: '徐东理发连锁（街道口店）',
    shopType: '标准门店',
    date: '2026-09-02',
    score: 4.6,
    budget: 158,
    status: '已完成',
  },
  {
    id: 'MV-26082704',
    shopName: '徐东理发连锁（汉口社区店）',
    shopType: '社区快剪店',
    date: '2026-08-27',
    score: 3.8,
    budget: 58,
    status: '已完成',
  },
  {
    id: 'MV-26081505',
    shopName: '徐东理发连锁（徐东旗舰店）',
    shopType: '直营旗舰店',
    date: '2026-08-15',
    score: 4.2,
    budget: 288,
    status: '已完成',
  },
]

/** 任务池初始任务数量，用于判断是否存在演示进度 */
export const TOTAL_TASKS = TASK_TEMPLATES.length

/** 深拷贝，保证多次重置演示时数据干净 */
export const cloneTasks = (): MysteryTask[] =>
  TASK_TEMPLATES.map((task) => ({
    ...task,
    checkIn: null,
    photos: [],
    photoAudit: null,
    cardIssue: null,
    submittedAt: null,
  }))

export const cloneHistory = (): HistoryItem[] => HISTORY_TEMPLATES.map((item) => ({ ...item }))

/** 初始状态 */
export const createInitialState = (): VisitorState => ({
  pageState: 'welcome',
  profile: null,
  pool: cloneTasks(),
  activeTask: null,
  history: cloneHistory(),
})

/** 演示用的「暗访员当前位置」（武汉徐东商圈），用于首页展示距门店距离 */
export const MOCK_VIEWPOINT = { lat: 30.5902, lng: 114.3105 }

/** 校验工号密码 */
export const verifyAccount = (staffNo: string, password: string) =>
  staffNo.trim().toUpperCase() === DEMO_ACCOUNT.staffNo && password.trim() === DEMO_ACCOUNT.password
