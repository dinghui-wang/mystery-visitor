import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { createInitialState } from '../services/mock'
import { clearState, PERSIST_ENABLED, readState, writeState } from '../services/storage'
import { formatNow } from '../utils/date'
import type {
  CheckInRecord,
  HistoryItem,
  MemberCardIssue,
  ReviewRecord,
  VisitorAction,
  VisitorProfile,
  VisitorState,
  VisitPhoto,
} from '../types/business'

const initialState = createInitialState()

/** 启动时合并缓存进度，保证刷新后仍能继续演示 */
function bootstrap(): VisitorState {
  if (!PERSIST_ENABLED) return initialState
  const cached = readState()
  if (!cached) return initialState
  const merged = { ...initialState, ...cached }
  // 容错：缓存中存在非法状态时回落到首页
  if ((merged.pageState === 'task' || merged.pageState === 'review') && !merged.activeTask) {
    return { ...merged, pageState: merged.profile ? 'home' : 'welcome' }
  }
  if (merged.pageState !== 'welcome' && !merged.profile) {
    return { ...merged, pageState: 'welcome' }
  }
  return merged
}

function updateActiveTask(
  state: VisitorState,
  patch: (task: NonNullable<VisitorState['activeTask']>) => NonNullable<VisitorState['activeTask']>
): VisitorState {
  if (!state.activeTask) return state
  return { ...state, activeTask: patch(state.activeTask) }
}

function reducer(state: VisitorState, action: VisitorAction): VisitorState {
  switch (action.type) {
    case 'login':
      return { ...state, pageState: 'home', profile: action.profile }

    case 'logout':
      // 未提交的任务退回任务池并恢复为「待领取」，避免任务丢失
      return {
        ...state,
        pageState: 'welcome',
        profile: null,
        activeTask: null,
        pool: state.activeTask
          ? [{ ...state.activeTask, status: '待领取' }, ...state.pool]
          : state.pool,
      }

    case 'acceptTask': {
      const target = state.pool.find((task) => task.id === action.taskId)
      if (!target) return state
      return {
        ...state,
        pageState: 'task',
        activeTask: { ...target, status: '进行中' },
        pool: state.pool.filter((task) => task.id !== action.taskId),
      }
    }

    case 'checkIn':
      return updateActiveTask(state, (task) => ({ ...task, checkIn: action.record }))

    case 'addPhotos':
      return updateActiveTask(state, (task) => ({
        ...task,
        photos: [...task.photos, ...action.photos],
      }))

    case 'removePhoto':
      return updateActiveTask(state, (task) => ({
        ...task,
        photos: task.photos.filter((photo) => photo.id !== action.photoId),
      }))

    case 'issueCard':
      return updateActiveTask(state, (task) => ({ ...task, cardIssue: action.issue }))

    case 'submitTask': {
      const next = updateActiveTask(state, (task) => ({
        ...task,
        status: '待回访',
        submittedAt: action.submittedAt,
      }))
      return { ...next, pageState: 'review' }
    }

    case 'submitReview': {
      const task = state.activeTask
      if (!task) return { ...state, pageState: 'home' }
      const record: HistoryItem = {
        id: task.id,
        shopName: task.shopName,
        shopType: task.shopType,
        date: action.review.submittedAt.slice(0, 10),
        score: action.review.score,
        budget: task.budget,
        status: '已完成',
      }
      return {
        ...state,
        pageState: 'home',
        activeTask: null,
        history: [record, ...state.history],
        profile: state.profile
          ? { ...state.profile, points: state.profile.points + 120 }
          : state.profile,
      }
    }

    case 'reset':
      clearState()
      return createInitialState()

    default:
      return state
  }
}

interface VisitorContextValue {
  state: VisitorState
  login: (profile: VisitorProfile) => void
  logout: () => void
  acceptTask: (taskId: string) => void
  checkIn: (record: CheckInRecord) => void
  addPhotos: (photos: VisitPhoto[]) => void
  removePhoto: (photoId: string) => void
  issueCard: (issue: MemberCardIssue) => void
  submitTask: () => void
  submitReview: (review: ReviewRecord) => void
  reset: () => void
}

const VisitorContext = createContext<VisitorContextValue | null>(null)

export function VisitorProvider({ children }: { children?: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, bootstrap)

  // 进度落盘
  useEffect(() => {
    if (!PERSIST_ENABLED) return
    writeState(state)
  }, [state])

  const login = useCallback(
    (profile: VisitorProfile) => dispatch({ type: 'login', profile }),
    []
  )
  const logout = useCallback(() => dispatch({ type: 'logout' }), [])
  const acceptTask = useCallback(
    (taskId: string) => dispatch({ type: 'acceptTask', taskId }),
    []
  )
  const checkIn = useCallback(
    (record: CheckInRecord) => dispatch({ type: 'checkIn', record }),
    []
  )
  const addPhotos = useCallback(
    (photos: VisitPhoto[]) => dispatch({ type: 'addPhotos', photos }),
    []
  )
  const removePhoto = useCallback(
    (photoId: string) => dispatch({ type: 'removePhoto', photoId }),
    []
  )
  const issueCard = useCallback(
    (issue: MemberCardIssue) => dispatch({ type: 'issueCard', issue }),
    []
  )
  const submitTask = useCallback(
    () => dispatch({ type: 'submitTask', submittedAt: formatNow() }),
    []
  )
  const submitReview = useCallback(
    (review: ReviewRecord) => dispatch({ type: 'submitReview', review }),
    []
  )
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  const value = useMemo(
    () => ({
      state,
      login,
      logout,
      acceptTask,
      checkIn,
      addPhotos,
      removePhoto,
      issueCard,
      submitTask,
      submitReview,
      reset,
    }),
    [
      state,
      login,
      logout,
      acceptTask,
      checkIn,
      addPhotos,
      removePhoto,
      issueCard,
      submitTask,
      submitReview,
      reset,
    ]
  )

  return <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>
}

export function useVisitor() {
  const ctx = useContext(VisitorContext)
  if (!ctx) throw new Error('useVisitor 必须在 VisitorProvider 内使用')
  return ctx
}
