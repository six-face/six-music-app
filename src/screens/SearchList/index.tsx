import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Table, Tag } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { Store } from '../../types/store'
import { Search } from '../../types/search'
import { SearchSongsItem, ListDetailsItem } from '../../types/songlist'
import { searchSongList } from '../../actions'
import ActionsButton from '../../components/ActionsButton'

interface StateProps {
  search: Search
  playingSong: ListDetailsItem
}

interface DispatchProps {
  dispatch: Dispatch
}

interface State {
  currentPage: number,

}

const mapStateToProps = (state: Store) => ({
  search: state.search,
  playingSong: state.playingSong
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch: dispatch
})

class SearchList extends React.Component<StateProps & DispatchProps> {

  constructor(props: (StateProps & DispatchProps)) {
    super(props)
    this.formater = this.formater.bind(this)
    this.pageChange = this.pageChange.bind(this)
  }

  /**
   * 构造与播放列表相同数据结构
   * @param song 
   */
  formater(song: SearchSongsItem) {
    let obj: ListDetailsItem = {
      url: '',
      dt: song.duration,
      name: song.name,
      id: song.id,
      al: {
        id: song.album.id,
        name: song.album.name,
        picUrl: song.artists[0].img1v1Url || ''
      },
      ar: [{ id: song.artists[0].id, name: song.artists[0].name }]
    }
    return obj
  }

  /**
   * 页数变化
   * @param pageSize 
   * @param pageNow 
   */
  pageChange(pageSize: number, pageNow: number) {
    const { search, dispatch } = this.props
    const { keywords } = search
    searchSongList(keywords, pageSize, pageNow - 1, dispatch)
  }

  columns: ColumnProps<SearchSongsItem>[] = [{
    title: '歌曲名',
    dataIndex: 'name',
    render: (text: string, record: SearchSongsItem) => {
      return this.playingSong && this.playingSong.id === record.id ? <span><Tag color="magenta" style={{ marginLeft: 10 }}>正在播放</Tag>{record.name}</span> : <span>{record.name}</span>
    }
  }, {
    title: '歌手',
    dataIndex: 'ar',
    render: (text: string, record: SearchSongsItem) => <span>{record.artists[0].name}</span>
  }, {
    title: '播放',
    dataIndex: 'options',
    render: (text: string, record: SearchSongsItem) => {
      return <ActionsButton actions={['play']} song={this.formater(record)} />
    }
  }]

  get search() {
    return this.props.search
  }

  get playingSong() {
    return this.props.playingSong
  }

  get list() {
    return this.search.searchList
  }

  render() {
    return (
      <div className="search-list">
        <Table
          columns={this.columns}
          dataSource={this.list}
          pagination={{
            pageSize: 20,
            onChange: (pageNow: number, pageSize: number) => this.pageChange(pageSize, pageNow),
            total: this.search.searchTotal
          }}
          locale={{ emptyText: '暂无歌曲' }}
          rowKey='id'
        />
      </div >
    )
  }
}

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(SearchList)