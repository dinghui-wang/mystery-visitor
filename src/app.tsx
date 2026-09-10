import React, { useEffect } from 'react'
import { useDidShow, useDidHide } from '@tarojs/taro'
import { VisitorProvider } from './store/VisitorContext'
// 全局样式
import './app.scss'

function App(props: { children?: React.ReactNode }) {
  // 可以使用所有的 React Hooks
  useEffect(() => {})

  // 对应 onShow
  useDidShow(() => {})

  // 对应 onHide
  useDidHide(() => {})

  return <VisitorProvider>{props.children}</VisitorProvider>
}

export default App
