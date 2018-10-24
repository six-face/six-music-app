import { Store } from '../types/store'
import { Search } from '../types/search'
import { Actions } from '../types/actions'
import { SearchSongsItem } from '../types/songlist'

const initSearch: Search = {
  pageNow: 0,
  pagesize: 15,
  searchList: [],
  keywords: '',
  searchTotal: 0
}

const search = (state: Search = initSearch, action: Actions) => {
  switch (action.type) {
    case 'SEARCH':
      return {
        ...state,
        searchList: [...action.search.searchList],
        keywords: action.search.keywords,
        pagesize: action.search.pagesize,
        pageNow: action.search.pageNow,
        searchTotal: action.search.searchTotal
      }
    default:
      return state
  }
}

export default search