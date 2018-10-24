/**
 * 获取歌曲列表相关服务
 */
import * as Http from '../services/Http'
import { CommonResponse } from '../types/response'
import { Recommend, ListDetails } from '../types/songlist'
import { message } from 'antd'

interface RecomendListResponse extends CommonResponse {
  result: Recommend[]
}

interface ListDetailsResponse extends CommonResponse {
  playlist: ListDetails
}

export async function recommendList(): Promise<RecomendListResponse> {
  let result = await Http.get<RecomendListResponse>('/personalized')
  if (result.code === 200) {
    return result
  }
  message.warning('获取歌单信息失败( ･᷄ὢ･᷅ )')
}

export async function listDetails(id: string): Promise<ListDetailsResponse> {
  let result = await Http.get<ListDetailsResponse>(`/playlist/detail?id=${id}`)
  if (result.code === 200) {
    return result
  }
  message.warning('获取歌单详情失败(；´Д`A')
}



