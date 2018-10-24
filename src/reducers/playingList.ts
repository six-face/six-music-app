import { Recommend, ListDetails, ListDetailsItem, SongerDetails } from '../types/songlist'
import { Actions } from '../types/actions'

// 本地播放列表储存键名
const KEY = 'playinglist'
const LOCAL = getLocalPlayingList()

/**
 * 获取本地播放列表
 */
function getLocalPlayingList(key: string = KEY) {
  let str = localStorage.getItem(key)
  return str ? JSON.parse(str) : []
}

/**
 * 储存播放列表到本地
 */

function setLocalStorage(value: ListDetailsItem[] = [], key: string = KEY) {
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 获取歌单详情列表
 */
const playingList = (state: ListDetailsItem[] = LOCAL, action: Actions) => {
  let result: ListDetailsItem[]
  switch (action.type) {
    case 'ADD_NEW_SONG_TO_PLAYLIST':
      result = [action.newPlayingSong, ...state]
      break
    case 'UPSET_PLAYING_LIST':
      result = [...state].sort((a, b) => Math.random() - 0.5)
      break
    case 'SET_PLAYING_LIST':
      result = [...action.betcheSongs]
      break
    case 'CLEAN_PLAYING_LIST':
      result = []
      break
    case 'REMOVE_SONG_FROM_PLAYING_LIST':
      let index = state.findIndex(item => item.id === action.songId)
      let newList = [...state]
      newList.splice(index, 1)
      result = newList
      break
    default:
      result = state
      break
  }
  if (setLocalStorageTimer) clearTimeout(setLocalStorageTimer)
  var setLocalStorageTimer = setTimeout(() => setLocalStorage(result), 500)
  return result
}

export default playingList