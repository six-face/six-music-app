import { UserRecommendSongs } from './songlist'
export interface UserInfo {
  profile: Profile
  playlist: UserPlayList[]
  isLocal?: boolean
  userRecommendSongs: UserRecommendSongs[]
}

/**
 * 用户歌单信息
 */
export interface UserPlayList {
  id: number,
  name: string,
  coverImgUrl: string
}

/**
 * 用户信息
 */
export interface Profile {
  userId: number
  nickname: string
  avatarUrl: string
  signature: string
}

