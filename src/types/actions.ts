import { Recommend, ListDetails, ListDetailsItem, UserRecommendSongs, SearchSongsItem } from './songlist'
import { Search } from '../types/search'
import { Profile, UserPlayList } from './user'
import { Step } from '../types/common'
export interface Actions {
  type: string
  data?: {
    result: Recommend[],
    playlist: ListDetails
  }
  playingSong?: ListDetailsItem
  newPlayingSong?: ListDetailsItem
  songId?: number
  profile: Profile
  userPlayList: UserPlayList
  userRecommendSongs: UserRecommendSongs[]
  betcheSongs: ListDetailsItem[]
  search: Search
  step: Step
}