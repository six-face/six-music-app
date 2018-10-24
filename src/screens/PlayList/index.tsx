import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Table, Popconfirm, Button, Tag } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Store } from '../../types/store'
import { upsetPlayingList, cleanPlayingList } from '../../actions'
import { ListDetailsItem } from '../../types/songlist'
import ActionsButton from '../../components/ActionsButton'
import './style.less'

interface StateProps {
  playingList: ListDetailsItem[]
  playingSong: ListDetailsItem
}

interface StateDispatch {
  dispatch: Dispatch
}

interface State {
  currentPage: number
  pageSize: number
}

const mapStateToProps = (state: Store) => ({
  playingList: state.playingList,
  playingSong: state.playingSong
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch: dispatch
})

class PlayList extends React.Component<StateProps & StateDispatch & RouteComponentProps, State> {
  constructor(props: (StateProps & StateDispatch & RouteComponentProps)) {
    super(props)
    this.setCurrentPage = this.setCurrentPage.bind(this)
  }
  state = {
    currentPage: 1,
    pageSize: 10
  }

  componentWillMount() {
    this.handlePageIndexByPlayingSong()
  }

  componentWillReceiveProps(nextProp: StateProps) {
    if (nextProp.playingSong !== this.props.playingSong) {
      this.handlePageIndexByPlayingSong()
    }
  }

  /**
   * 设置当前页码
   * @param currentPage 
   */
  setCurrentPage(currentPage: number) {
    this.setState({ currentPage })
  }

  /**
   * 根据当前播放的歌曲决定是否切换直歌曲当前页面
   */
  handlePageIndexByPlayingSong() {
    const { playingList, playingSong } = this.props
    let playingSongIndex = playingList.findIndex((item, index) => item.id === playingSong.id)
    let currentPage = playingSongIndex !== -1 ? Math.ceil(playingSongIndex / this.state.pageSize) : 1
    this.setCurrentPage(currentPage)
  }

  colums: ColumnProps<ListDetailsItem>[] = [{
    title: '歌曲名',
    dataIndex: 'name',
    render: (text: string, record: ListDetailsItem) => {
      return this.playingSong && this.playingSong.id === record.id ? <span><Tag color="magenta" style={{ marginLeft: 10 }}>正在播放</Tag>{record.name}</span> : <span>{record.name}</span>
    }
  }, {
    title: '歌手',
    dataIndex: 'ar',
    render: (text: string, record: ListDetailsItem) => <span>{record.ar[0].name}</span>
  }, {
    title: '专辑',
    dataIndex: 'al',
    render: (text: string, record: ListDetailsItem) => <span>{record.al.name}</span>
  }, {
    title: '操作',
    dataIndex: 'options',
    width: '20%',
    render: (text: string, record: ListDetailsItem) =>
      <ActionsButton actions={['play', 'remove']} song={record} />
  }]

  get playingList() {
    return this.props.playingList
  }

  get dispatch() {
    return this.props.dispatch
  }

  get playingSong() {
    return this.props.playingSong
  }

  get disabled() {
    return this.playingList && this.playingList.length
  }

  render() {
    return (
      <div className="play-list">
        <div className="top-options">
          <Button icon="rocket" size="small" disabled={!this.disabled} onClick={() => this.dispatch(upsetPlayingList())}>打乱歌曲顺序</Button>
          <Popconfirm title="你要清空播放列表了吗？(˶‾᷄ ⁻̫ ‾᷅˵)" onConfirm={() => this.dispatch(cleanPlayingList())} cancelText="取消" okText="确定">
            <Button icon="delete" size="small" disabled={!this.disabled}>清空播放列表</Button>
          </Popconfirm>
        </div>
        <Table
          size="middle"
          columns={this.colums}
          dataSource={this.playingList}
          pagination={{
            current: this.state.currentPage,
            pageSize: this.state.pageSize,
            total: this.playingList && this.playingList.length,
            onChange: this.setCurrentPage
          }}
          locale={{ emptyText: '暂无歌曲' }}
          rowKey={"id"}
        />
      </div>
    )
  }
}

export default withRouter(connect<StateProps, StateDispatch>(mapStateToProps, mapDispatchToProps)(PlayList))