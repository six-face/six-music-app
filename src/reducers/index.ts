import { combineReducers, createStore, AnyAction } from "redux"
import { Actions } from '../types/actions'
import { Store } from '../types/store'
import { Step } from '../types/common'
import { Recommend, ListDetails, ListDetailsItem, SongerDetails } from '../types/songlist'
import user from './user'
import playingList from './playingList'
import search from './search'

/**
 * 推荐歌单、热门歌单
 * @param state 
 * @param action 
 */
const playlist = (state: Recommend[] = [], action: Actions) => {
  switch (action.type) {
    case 'GET_RECOMMEND_LIST':
      return action.data.result
    default:
      return state
  }
}

/**
 * 歌单详情
 * @param state 
 * @param action 
 */
const detailsList = (state: {} = {}, action: Actions) => {
  switch (action.type) {
    case 'GET_LIST_DETAILS':
      return action.data.playlist
    default:
      return state
  }
}

/**
 * 设置当前播放的歌曲
 * @param state 
 * @param action 
 */
const playingSong = (state: {} = {}, action: Actions) => {
  switch (action.type) {
    case 'SET_PLAYING_SONG':
      return action.playingSong
    default:
      return state
  }
}

/**
 * 路由前进步数
 * @param state 
 * @param action 
 */
const step = (state: Step = { current: 0, total: 0 }, action: Actions) => {
  switch (action.type) {
    case "SET_STEP":
      return action.step
    default:
      return state
  }
}

const reducer = combineReducers({
  playlist,
  playingSong,
  playingList,
  detailsList,
  user,
  step,
  search
})

const store = createStore(reducer)

export { reducer, store }

