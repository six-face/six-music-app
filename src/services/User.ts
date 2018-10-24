import * as Http from './Http'
import { CommonResponse } from '../types/response'
import { UserPlayList, Profile } from '../types/user'
import { message } from 'antd'
import { UserRecommendSongs } from '../types/songlist'

interface GetUserSongListResponse extends CommonResponse {
  playlist: UserPlayList[]
}

interface LoginResponse extends CommonResponse {
  profile: Profile
  cookie: string[]
}

interface UserDetailInfoResponse extends CommonResponse {
  profile: Profile
}

interface UserRecommendSonsResponse extends CommonResponse {
  recommend: UserDetailInfoResponse
}

/**
 * 获取用户歌单
 * @param userId 
 */
export async function getUserList(userId: number): Promise<GetUserSongListResponse> {
  let result = await Http.get<GetUserSongListResponse>(`/user/playlist?uid=${userId}`)
  if (result.code !== 200) {
    message.warning('获取用户歌单失败啦(/ω＼)')
  }
  return result

}

/**
 * 用户登录
 * @param phone 
 * @param password 
 */
export async function login(phone: string, password: string): Promise<LoginResponse> {
  let result = await Http.get<LoginResponse>(`/login/cellphone?phone=${phone}&password=${password}`)
  if (result.code !== 200) {
    return message.warning(result.msg || '登录失败啦(｡ ́︿ ̀｡)')
  }
  localStorage.setItem('uid', result.profile.userId + '')
  return result
}

/**
 * 退出登录
 */
export async function logout(): Promise<CommonResponse> {
  let result = await Http.get<CommonResponse>('/logout')
  if (result.code !== 200) {
    message.warning('登出失败(＞人＜;)')
  }
  localStorage.removeItem('cookie')
  return result
}

/**
 * 获取用户信息（需登录）
 */
export async function userDetail(): Promise<UserDetailInfoResponse> {
  let result = await Http.get<UserDetailInfoResponse>(`/user/detail?uid=${localStorage.getItem('uid')}`)
  if (result.code !== 200) {
    message.warning('获取用户信息失败(´･Д･)」')
  }
  return result
}

/**
 * 获取用户登陆状态
 */
export async function loginStatus(): Promise<CommonResponse> {
  let result = await Http.get<CommonResponse>('/login/refresh')
  return result
}

/**
 * 获取用户每日推荐歌曲
 */
export async function UserRecommendSongs(): Promise<UserRecommendSonsResponse> {
  let result = await Http.get<UserRecommendSonsResponse>('/recommend/songs')
  return result
}

