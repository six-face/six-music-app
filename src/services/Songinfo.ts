import * as Http from './Http'
import { CommonResponse } from '../types/response'
import { SongUrlInfo } from '../types/songlist'
import { message } from 'antd'

interface GetLyricResponse extends CommonResponse {
  lrc: {
    lyric: string
  }
}

interface GetSongUrlResponse extends CommonResponse {
  data: SongUrlInfo[]
}

/**
 * 获取歌词
 * @param id 
 */
export async function getLyric(id?: number): Promise<GetLyricResponse> {
  let result = await Http.get<GetLyricResponse>(`/lyric?id=${id}`)
  if (result.code === 200) {
    return result
  }
  message.warning('获取歌词失败了呢～')
}

/**
 * 获取歌曲Url
 * @param id 
 */
export async function getSongUrl(id?: number): Promise<GetSongUrlResponse> {
  let result = await Http.get<GetSongUrlResponse>(`/song/url?id=${id}`)
  return result
}