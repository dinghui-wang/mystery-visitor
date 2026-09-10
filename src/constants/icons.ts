/**
 * 线性图标：以 SVG data-uri 形式提供，避免引入二进制图片资源。
 * 用法：<View style={{ backgroundImage: icon('location', '#8B8195') }} />
 */
export const ICON_PATHS = {
  location: `<path d='M12 21.2s7-6.3 7-11.2a7 7 0 1 0-14 0c0 4.9 7 11.2 7 11.2z'/><circle cx='12' cy='10' r='2.6'/>`,
  locationSolid: `<path d='M12 2a7.2 7.2 0 0 0-7.2 7.2c0 5 7.2 12.8 7.2 12.8s7.2-7.8 7.2-12.8A7.2 7.2 0 0 0 12 2zm0 9.8a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z'/>`,
  camera: `<path d='M3 9a2 2 0 0 1 2-2h1.6l1-2.2h6.8l1 2.2H17a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><circle cx='12' cy='13' r='3.4'/>`,
  card: `<rect x='2.5' y='5' width='19' height='14' rx='2.6'/><path d='M2.5 9.8h19'/><path d='M6.2 14.6h4.4'/>`,
  check: `<path d='M4.6 12.6l4.9 4.9L19.4 7.6'/>`,
  checkSolid: `<path d='M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.1 14.4-4-4 1.5-1.5 2.5 2.5 5.2-5.2 1.5 1.5z'/>`,
  clock: `<circle cx='12' cy='12' r='8.6'/><path d='M12 7.4V12l3 1.9'/>`,
  chevron: `<path d='M9.2 5.2l7 6.8-7 6.8'/>`,
  shop: `<path d='M4 9.6V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.6'/><path d='M2.6 9.6L5.2 4h13.6l2.6 5.6'/><path d='M9.6 20v-6.2h4.8V20'/>`,
  user: `<circle cx='12' cy='8.4' r='3.9'/><path d='M4.4 20c0-3.7 3.4-6.2 7.6-6.2s7.6 2.5 7.6 6.2'/>`,
  logout: `<path d='M15 4.6h3.4A1.6 1.6 0 0 1 20 6.2v11.6a1.6 1.6 0 0 1-1.6 1.6H15'/><path d='M10 8.4l-3.8 3.6L10 15.6'/><path d='M6.2 12H15'/>`,
  plus: `<path d='M12 5.4v13.2M5.4 12h13.2'/>`,
  phone: `<path d='M6.4 3.6h3l1.5 4-2 1.5a11.4 11.4 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A15.8 15.8 0 0 1 4.4 5.8 2 2 0 0 1 6.4 3.6z'/>`,
  lock: `<rect x='4.6' y='10' width='14.8' height='9.6' rx='2.2'/><path d='M8.2 10V7.6a3.8 3.8 0 0 1 7.6 0V10'/>`,
  close: `<path d='M6.2 6.2l11.6 11.6M17.8 6.2L6.2 17.8'/>`,
  sparkle: `<path d='M12 3.2l1.9 4.9 4.9 1.9-4.9 1.9L12 16.8l-1.9-4.9L5.2 10l4.9-1.9z'/><path d='M18.6 16.4l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z'/>`,
  refresh: `<path d='M20.2 12a8.2 8.2 0 1 1-2.4-5.8'/><path d='M20.4 4.2v4.2h-4.2'/>`,
  image: `<rect x='3' y='4.6' width='18' height='14.8' rx='2.4'/><circle cx='8.6' cy='9.8' r='1.6'/><path d='M3.4 16.4l4.6-4.2 3.6 3.2 3-2.6 5.8 5'/>`,
  note: `<path d='M6 3.6h9.4L20 8.2V20a1.4 1.4 0 0 1-1.4 1.4H6A1.4 1.4 0 0 1 4.6 20V5A1.4 1.4 0 0 1 6 3.6z'/><path d='M8.6 12.4h6.8M8.6 16.2h4.6'/>`,
  wallet: `<path d='M3.6 7.6a2 2 0 0 1 2-2h11.2a2 2 0 0 1 2 2v.8'/><rect x='3.6' y='7.6' width='16.8' height='11.2' rx='2.2'/><circle cx='16.2' cy='13.2' r='1.2'/>`,
} as const

export type IconName = keyof typeof ICON_PATHS

/** 生成 SVG data-uri（stroke 线性图标） */
export function icon(name: IconName, color = '#8B8195', strokeWidth = 1.6): string {
  const body = ICON_PATHS[name]
  const filled = name.endsWith('Solid')
  const paint = filled
    ? `fill='${encodeColor(color)}'`
    : `fill='none' stroke='${encodeColor(color)}' stroke-width='${strokeWidth}' stroke-linecap='round' stroke-linejoin='round'`
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' ${paint}>${body}</svg>")`
}

function encodeColor(color: string) {
  return color.replace('#', '%23')
}
