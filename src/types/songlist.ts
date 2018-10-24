import { duration } from "moment";

/**
 * 推荐歌单类型
 */
export interface Recommend {
  id: number
  name: string
  picUrl: string
}

/**
 * 歌单详情
 */
export interface ListDetails {
  coverImgUrl: string
  id: number
  name: string
  subscribedCount: number
  tracks: ListDetailsItem[]
}

/**
 * 歌单详情里的歌单信息
 */
export interface ListDetailsItem {
  url?: string
  dt?: number
  name: string
  id: number
  /**
   * 歌曲专辑信息
   */
  al: {
    id: number
    name: string
    picUrl: string
  }
  /**
   * 歌手信息
   */
  ar: SongerDetails[]
  /**
   * 歌曲影剧相关
   */
  alia?: string[]
  /**
   * 时长
   */
  publishTime?: number
}

/**
 * 歌手信息
 */
export interface SongerDetails {
  name: string
  id: number
  img1v1Url?: string
}

/**
 * 用户每日推荐歌曲信息
 */
export interface UserRecommendSongs {
  id: number
  name: string
  album: {
    id: number
    name: string
    picUrl: string
    artists: SongerDetails[]
  }
  mp3Url: string
  duration: number
}

/**
 * 歌曲URL信息
 */

export interface SongUrlInfo {
  id: number
  url: string
}

/**
 * 搜索歌曲列表条目信息
 */
export interface SearchSongsItem {
  name: string,
  id: number,
  duration: number,
  artists: SongerDetails[],
  album: {
    name: string,
    id: number
  }
}

