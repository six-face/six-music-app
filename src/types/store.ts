import { Recommend, ListDetails, ListDetailsItem } from './songlist'
import { Search } from './search'
import { UserInfo } from './user'
import { Step } from './common'
import { any } from 'prop-types';

export interface Store {
  playlist: Recommend[],
  detailsList: ListDetails,
  playingSong: ListDetailsItem
  playingList: ListDetailsItem[]
  user: UserInfo,
  step: Step,
  search: Search
}

