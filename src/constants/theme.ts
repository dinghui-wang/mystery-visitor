/** TS 侧的色值常量，供内联样式（进度条、图表、动态色）使用 */
export const THEME = {
  cream: '#FBF8F5',
  card: '#FFFFFF',
  lavender50: '#F8F5FA',
  lavender100: '#F1EBF6',
  lavender200: '#E5DCEE',
  purple: '#9C8AA5',
  purpleDeep: '#7B6A86',
  purpleLight: '#B79BC4',
  purpleInk: '#4A3F52',
  text: '#4A3F52',
  textSub: '#8B8195',
  textWeak: '#B5AEBD',
  rose: '#D8B4A8',
  success: '#7FA88B',
  warning: '#D9A05B',
  danger: '#C77B7B',
} as const

/** 门店品类与标签色映射 */
export const SHOP_TYPE_COLOR: Record<string, string> = {
  直营旗舰店: '#9C8AA5',
  标准门店: '#C79BB0',
  社区快剪店: '#8FA3B8',
}
