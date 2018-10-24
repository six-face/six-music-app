/**
 * 搜索相关服务
 */
import * as Http from './Http'
import { CommonResponse } from '../types/response'
import { SearchSongsItem } from '../types/songlist'
import { message } from 'antd'

interface SearchDateResponse extends CommonResponse {
  result: {
    songCount: number,
    songs: SearchSongsItem[]
  }
}

export async function searchDate(keywords: string, limit: number = 20, offset: number = 0): Promise<SearchDateResponse> {
  keywords = encodeURI(keywords)
  let result = await Http.get<SearchDateResponse>(`/search?keywords=${keywords}&limit=${limit}&offset=${offset}`)
  if (result.code !== 200) {
    return message.warning(`获取搜索列表失败啦(/ω＼)`)
  }
  if (result && result.result.songCount === 0) return message.info('没有该搜索信息的歌曲╮(╯▽╰)╭')
  return result
}
