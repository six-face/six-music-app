/**
 * 初始化用户信息
 */
import { UserInfo, UserPlayList } from '../types/user'
import { Actions } from '../types/actions'
import { stat } from 'fs';

const initUser: UserInfo = {
  playlist: [],
  profile: {
    userId: 0,
    nickname: '',
    avatarUrl: '',
    signature: ''
  },
  isLocal: true,
  userRecommendSongs: []
}

const user = (state: UserInfo = initUser, action: Actions) => {
  switch (action.type) {
    case 'GET_USER_SONG_LIST':
      return { ...state, playlist: action.userPlayList }
    case 'LOGIN':
      return { ...state, profile: action.profile, isLocal: false }
    case 'GET_USER_RECOMMEND_SONGS':
      return { ...state, userRecommendSongs: action.userRecommendSongs }
    // 设置为本地用户
    case 'SET_LOCAL_USER':
      return { ...state, profile: { ...initUser.profile }, isLocal: true }
    default:
      return state
  }
}

export default user