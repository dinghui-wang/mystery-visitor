/** 体验项目（多选） */
export const EXPERIENCE_PROJECTS = ['洗吹', '剪发', '染烫', '护理'] as const

export type AnswerValue = string | string[]

export interface FormItem {
  key: string
  /** 题目文本 */
  text: string
  /** 选项（单选时为 3 个；多选时 4 个） */
  options: string[]
  /** 是否多选 */
  multi?: boolean
  /** 该题对应的备注提示（红色小字） */
  noteHint?: string
}

export interface FormSection {
  key: 'service' | 'hygiene' | 'sendOff' | 'keyPoint'
  title: string
  /** 若定义，则在本节末尾渲染建议/意见文本框 */
  noteField?: 'service' | 'hygiene' | 'sendOff'
  items: FormItem[]
}

export const FORM_SECTIONS: FormSection[] = [
  {
    key: 'service',
    title: '服务',
    noteField: 'service',
    items: [
      {
        key: 's1',
        text: '进门店是否会员热情欢迎迎语，欢迎光临徐东美发！',
        options: ['没有喊', '个别喊', '全员喊'],
      },
      {
        key: 's2',
        text: '是否有人主动接待？引导您存包？如需等位，是否告知您等待时间？',
        options: ['没有接待', '随意接待', '热情接待引导'],
      },
      {
        key: 's3',
        text: '洗发时是否有洗头工．A:水温合适吗？ B: 头皮痒不痒？ C:力度怎么样？',
        options: ['没有询问', '询问其中1项或2项', '都有询问'],
      },
      {
        key: 's4',
        text: '剪发时发型师是否认真了解您的需求',
        options: ['没有沟通', '随口一问', '详细了解'],
      },
      {
        key: 's5',
        text: '门店一共有几位工作人员？',
        options: ['1-2位', '3到4位', '5位及以上'],
      },
    ],
  },
  {
    key: 'hygiene',
    title: '卫生',
    noteField: 'hygiene',
    items: [
      {
        key: 'h1',
        text: '员工装是否整齐？',
        options: ['没有工装', '个别有', '有工装'],
        noteHint: '卫生板块细节请备注（如：台面有碎发）',
      },
      {
        key: 'h2',
        text: '形象是否得体？（有无异味？衣着是否干净清爽？发型是否干净清爽？）',
        options: ['都不得体', '个别不得体', '都很得体'],
      },
      {
        key: 'h3',
        text: '毛巾、围布是否干净？是否有异味？',
        options: ['有异味且有污渍', '有其中一项', '无异味且干净'],
      },
      {
        key: 'h4',
        text: '洗头床是否整洁干净？（洗头盆有无杂物污染．床上有无水渍污渍）',
        options: ['脏污', '一般整洁', '很整洁无污渍'],
      },
      {
        key: 'h5',
        text: '镜子台面是否明亮干净？',
        options: ['脏污', '一般明亮干净', '很明亮干净'],
      },
      {
        key: 'h6',
        text: '置物架上物品是否摆放整齐？（产品置物架．工具架是否规整）',
        options: ['杂乱', '一般整齐', '很整齐'],
      },
      {
        key: 'h7',
        text: '一眼看去是否存在卫生死角？（地面清洁．天花板蜘蛛网．角落积灰）',
        options: ['观感差', '有死角但不明显', '很整洁无任何死角'],
      },
    ],
  },
  {
    key: 'sendOff',
    title: '送客',
    noteField: 'sendOff',
    items: [
      {
        key: 'o1',
        text: '服务结束后是否有人询问您体验满意度，并告知您尊享后内容？',
        options: ['没有询问介绍', '简单告知', '详细询问介绍'],
        noteHint: '离店送客板块的建议/意见',
      },
      {
        key: 'o2',
        text: '是否有人积极给您介绍门店优惠活动或会员卡/充值/套餐？是否知道会员金额？',
        options: ['都没有', '只说了其中一项', '介绍了活动，也告知了金额'],
      },
      {
        key: 'o3',
        text: '是否热情送您离店？',
        options: ['没有送客', '随意送客', '热情送客到门口'],
      },
    ],
  },
  {
    key: 'keyPoint',
    title: '重点',
    items: [
      {
        key: 'k1',
        text: '门店员工是否存在嚼槟榔．打游戏．睡觉行为？',
        multi: true,
        options: ['嚼槟榔', '打游戏', '睡觉', '都没有'],
      },
      {
        key: 'k2',
        text: '门店内是否有播放舒适的音？',
        options: ['没有', '有但不舒服', '有'],
      },
    ],
  },
]

/** 根据答案计算 1-5 综合分（演示用） */
export function computeScore(answers: Record<string, AnswerValue>): number {
  const items: FormItem[] = []
  for (let i = 0; i < FORM_SECTIONS.length; i++) {
    const section = FORM_SECTIONS[i]
    for (let j = 0; j < section.items.length; j++) {
      items.push(section.items[j])
    }
  }
  if (!items.length) return 0
  const total = items.reduce((sum, item) => {
    const v = answers[item.key]
    if (item.multi) {
      return sum + (Array.isArray(v) && v.includes('都没有') ? 5 : 2)
    }
    if (typeof v !== 'string') return sum
    const idx = item.options.indexOf(v)
    return sum + (idx === 2 ? 5 : idx === 1 ? 3 : 1)
  }, 0)
  return Number((total / items.length).toFixed(1))
}
