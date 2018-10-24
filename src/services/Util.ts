import * as H from 'history'
import { store } from '../reducers'

/**
 * 格式化时间
 */
export function FormatDate(sec: number) {
  // 个位数补0
  const patch = (val: number) => {
    val = Math.floor(val)
    if (val < 10) return '0' + val
    else return isNaN(val) ? '00' : val + ''
  }
  let min = Math.floor(sec / 60)
  sec = sec - min * 60
  return `${patch(min)}:${patch(sec)}`
}

export function go(route: string, history: H.History) {
  history.push(route)
  let step = store.getState().step
  store.dispatch({
    type: 'SET_STEP',
    step: {
      current: step.current + 1,
      total: step.current + 1
    }
  })
}

export function back() {
  let step = store.getState().step
  if (step.current === 0) {
    return
  }
  history.go(-1)
  store.dispatch({
    type: 'SET_STEP',
    step: {
      current: step.current - 1,
      total: step.total
    }
  })
}

export function forward() {
  let step = store.getState().step
  if (step.current === step.total) {
    return
  }
  history.go(1)
  store.dispatch({
    type: 'SET_STEP',
    step: {
      current: step.current + 1,
      total: step.total
    }
  })
}