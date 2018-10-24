import { recommendList, listDetails } from '../services/SongList'
import { searchDate } from '../services/Search'
import { store } from '../reducers/index'
import { Dispatch } from 'redux'
import { ListDetailsItem } from '../types/songlist';
import { Search } from '../types/search'
import { getUserList, login, logout, UserRecommendSongs } from '../services/User'

/**
 * 推荐歌单
 * @param dispatch 
 */
export const getRecommendList = async (dispatch: Dispatch) => {
  let recommendListResult = await recommendList()
  let action = {
    type: 'GET_RECOMMEND_LIST',
    data: recommendListResult
  }
  dispatch(action)
}

/**
 * 歌单详情
 * @param dispatch 
 * @param id 
 */
export const getListDetails = async (dispatch: Dispatch, id: string) => {
  let listDetailsResult = await listDetails(id)
  let action = {
    type: 'GET_LIST_DETAILS',
    data: listDetailsResult
  }
  dispatch(action)
}

/**
 * 设置正在播放的歌曲
 * @param playingSong 
 */
export const setPlaying = (playingSong: ListDetailsItem) => ({
  type: 'SET_PLAYING_SONG',
  playingSong
})

/**
 * 添加新播放的歌曲进入播放队列
 * @param newPlayingSong 
 */
export const addToPlaylist = (newPlayingSong: ListDetailsItem) => ({
  type: 'ADD_NEW_SONG_TO_PLAYLIST',
  newPlayingSong
})


/**
 * 从播放列表中删除歌曲
 * @param songId 
 */
export const removeSongFromPalyingList = (songId: number) => ({
  type: 'REMOVE_SONG_FROM_PLAYING_LIST',
  songId
})

/**
 * 获取用户歌单列表
 * @param userId 
 * @param dispatch 
 */
export const getUserSongList = async (userId: number, dispatch: Dispatch) => {
  let result = await getUserList(userId)
  let action = {
    type: 'GET_USER_SONG_LIST',
    userPlayList: result.playlist
  }
  dispatch(action)
}

/**
 * 打乱播放列表顺序
 */
export const upsetPlayingList = () => ({
  type: 'UPSET_PLAYING_LIST'
})

/**
 * 清空播放列表
 */
export const cleanPlayingList = () => ({
  type: 'CLEAN_PLAYING_LIST'
})

/**
 * 用户登陆
 * @param phone 
 * @param password 
 * @param dispatch 
 */
export const phoneLogin = async (phone: string, password: string, dispatch: Dispatch) => {
  let result = await login(phone, password)
  if (result.code === 200) {
    let action = {
      type: 'LOGIN',
      profile: result.profile,
    }
    dispatch(action)
    return result
  }
}

/**
 * 设置本地用户
 * @param dispatch 
 */
export const setLocalUser = async (dispatch: Dispatch) => {
  let result = await logout()
  let action = {
    type: 'SET_LOCAL_USER'
  }
  if (result.code === 200) {
    dispatch(action)
  }
}

/**
 * 获取用户每日推荐歌单
 * @param dispatch 
 */
export const UserRecommendSongsAction = async (dispatch: Dispatch) => {
  let result = await UserRecommendSongs()
  let action = {
    type: 'GET_USER_RECOMMEND_SONGS',
    userRecommendSongs: result.recommend
  }
  if (result.code === 200) {
    dispatch(action)
  }
}

/**
 * 添加列表全部歌曲进入播放列表
 * @param betcheSongs 
 */
export const setPlayList = (betcheSongs: ListDetailsItem[]) => {
  return {
    type: 'SET_PLAYING_LIST',
    betcheSongs
  }
}

/**
 * 获取搜索歌曲信息
 * @param keywords 
 * @param pagesize 
 * @param pagenow 
 * @param dispatch 
 */
export const searchSongList = async (keywords: string, pagesize: number, pagenow: number, dispatch: Dispatch) => {
  let result = await searchDate(keywords, pagesize, pagenow)
  if (result && result.result) {
    let searchObj: Search = {
      keywords: keywords,
      pagesize: pagesize,
      pageNow: pagenow,
      searchList: result && result.result.songs,
      searchTotal: result && result.result.songCount
    }
    let action = {
      type: 'SEARCH',
      search: searchObj
    }
    dispatch(action)
  }
}





