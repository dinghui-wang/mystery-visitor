import type {
  HistoryItem,
  MysteryTask,
  PhotoCategory,
  ShopType,
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
  { name: '门头', min: 1, max: 3, tip: '含完整招牌与门牌号' },
  { name: '环境', min: 2, max: 4, tip: '接待区、护理间、洗手间' },
  { name: '服务过程', min: 2, max: 6, tip: '护理中、产品展示、仪容仪表' },
  { name: '消费小票', min: 1, max: 2, tip: '需清晰可见金额与门店名' },
]

/** 回访评分维度 */
export const REVIEW_DIMENSIONS = [
  { key: '环境卫生', desc: '门店整洁度、消毒与气味' },
  { key: '接待服务', desc: '迎宾、倒水、需求沟通' },
  { key: '专业手法', desc: '手法熟练度与专业讲解' },
  { key: '流程规范', desc: '是否按标准服务流程执行' },
  { key: '性价比', desc: '体验感受与价目匹配度' },
]

/** 回访多选亮点 */
export const REVIEW_HIGHLIGHTS = [
  '主动倒水',
  '主动介绍项目',
  '手法专业',
  '环境舒适',
  '无强制推销',
  '按时完成',
  '离店送别',
  '卫生细节到位',
]

/** 原始任务模板（每次重置时深拷贝，避免交叉污染） */
const TASK_TEMPLATES: MysteryTask[] = [
  {
    id: 'MV-26091001',
    status: '待领取',
    shopName: '悦己·轻奢美学馆（天河北店）',
    shopType: '生活美容',
    address: '广州市天河区天河北路 233 号中信广场 3F-08',
    lat: 23.1356,
    lng: 113.3245,
    appointAt: '2026-09-10 15:30',
    project: '深层清洁护理 · 90 分钟体验',
    budget: 398,
    contact: '门店店长 · 138****6721',
    notes: '重点观察接待话术与护理流程规范性，全程不要主动透露身份。',
    requirePhotos: ['门头', '环境', '服务过程', '消费小票'],
    cardTypes: [
      '体验卡 · 免费面部护理 1 次',
      '闺蜜同行卡 · 到店买一赠一',
      '新客礼遇卡 · 首次到店 5 折',
    ],
    checkIn: null,
    photos: [],
    cardIssue: null,
    submittedAt: null,
  },
  {
    id: 'MV-26091202',
    status: '待领取',
    shopName: 'Miss Nail 美甲·美睫（珠江新城店）',
    shopType: '美甲美睫',
    address: '广州市天河区珠江东路 12 号高德置地冬广场 4F-21',
    lat: 23.1189,
    lng: 113.3241,
    appointAt: '2026-09-12 11:00',
    project: '单色美甲 + 睫毛修补体验',
    budget: 268,
    contact: '前台 · 020-****8821',
    notes: '留意工具消毒流程与是否额外推荐办卡，记录报价口径。',
    requirePhotos: ['门头', '环境', '服务过程', '消费小票'],
    cardTypes: ['体验卡 · 免费单色美甲 1 次', '储值卡 · 充 500 送 120'],
    checkIn: null,
    photos: [],
    cardIssue: null,
    submittedAt: null,
  },
]

/** 历史暗访记录 */
const HISTORY_TEMPLATES: HistoryItem[] = [
  {
    id: 'MV-26090203',
    shopName: '肌研·皮肤管理中心（体育西店）',
    shopType: '皮肤管理',
    date: '2026-09-02',
    score: 4.6,
    budget: 458,
    status: '已完成',
  },
  {
    id: 'MV-26082704',
    shopName: '花漾美容 SPA（江南西店）',
    shopType: '生活美容',
    date: '2026-08-27',
    score: 3.8,
    budget: 328,
    status: '已完成',
  },
  {
    id: 'MV-26081505',
    shopName: '指间艺语美甲（岗顶店）',
    shopType: '美甲美睫',
    date: '2026-08-15',
    score: 4.2,
    budget: 198,
    status: '已完成',
  },
]

/** 任务池初始任务数量，用于判断是否存在演示进度 */
export const TOTAL_TASKS = TASK_TEMPLATES.length

/** 深拷贝，保证多次重置演示时数据干净 */
export const cloneTasks = (): MysteryTask[] =>
  TASK_TEMPLATES.map((task) => ({
    ...task,
    requirePhotos: [...task.requirePhotos],
    cardTypes: [...task.cardTypes],
    checkIn: null,
    photos: [],
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

/** 品类说明，用于欢迎态展示 */
export const SHOP_TYPE_INTRO: { type: ShopType; desc: string }[] = [
  { type: '生活美容', desc: '面部护理 · SPA' },
  { type: '美甲美睫', desc: '美甲 · 美睫 · 手足' },
  { type: '皮肤管理', desc: '轻医美 · 光电项目' },
]

/** 演示用的「暗访员当前位置」（广州市天河城商圈），用于首页展示距门店距离 */
export const MOCK_VIEWPOINT = { lat: 23.1325, lng: 113.3208 }

/** 校验工号密码 */
export const verifyAccount = (staffNo: string, password: string) =>
  staffNo.trim().toUpperCase() === DEMO_ACCOUNT.staffNo && password.trim() === DEMO_ACCOUNT.password
