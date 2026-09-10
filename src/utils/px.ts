/** 设计稿 375 下的 px 转 rpx，用于必须内联的尺寸（CSS 文件内直接写 px 即可） */
export const rpx = (value: number) => `${value * 2}rpx`

/** 拼接 className，自动过滤空值 */
export const cx = (...names: (string | false | undefined | null)[]) =>
  names.filter(Boolean).join(' ')
