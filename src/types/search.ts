import { SearchSongsItem } from './songlist'
export interface Search {
  searchList: SearchSongsItem[],
  keywords: string,
  pagesize: number,
  pageNow: number,
  searchTotal: number
}