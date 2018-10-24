import * as React from 'react'
import { Table, Tag, Card } from 'antd'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RouteComponentProps } from 'react-router-dom'
import { ColumnProps } from 'antd/lib/table'
import { Store } from '../../types/store'
import { ListDetails, ListDetailsItem } from '../../types/songlist'
import { getListDetails } from '../../actions'
import ActionsButton from '../../components/ActionsButton'
import './style.less'
import Content from '../Content';

interface RouterParams {
  id: string
}

interface State {
  currentPage: number,
  pageSize: number
}

interface StateProps {
  listDetails: ListDetails
  playingInfo: ListDetailsItem
}

interface StateDispatch {
  dispatch: Dispatch
}

const mapStateToProps = (state: Store) => ({
  listDetails: state.detailsList,
  playingInfo: state.playingSong
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch: dispatch
})

class ListCommonDetails extends React.Component<RouteComponentProps<RouterParams> & StateProps & StateDispatch, State> {

  constructor(props: (RouteComponentProps<RouterParams> & StateProps & StateDispatch)) {
    super(props)
    this.setCurrentPage = this.setCurrentPage.bind(this)
  }

  state: State = {
    currentPage: 0,
    // 分页大小
    pageSize: 10
  }

  componentWillMount() {
    let { dispatch } = this.props
    getListDetails(dispatch, this.props.match.params.id)
    this.handlePageByPlaying(this.props)
  }

  componentWillReceiveProps(nextProps: (StateProps & RouteComponentProps<RouterParams>)) {
    // playingInfo 改变更新页码
    let { dispatch } = this.props
    if (nextProps.playingInfo !== this.props.playingInfo) {
      this.handlePageByPlaying(nextProps)
    }
    // 检测路由变化做改变
    if (nextProps.match.params.id !== this.props.match.params.id)
      getListDetails(dispatch, nextProps.match.params.id)
  }

  /**
   * 设置当前页码
   * @param currentPage 
   */
  setCurrentPage(currentPage: number) {
    this.setState({ currentPage: currentPage })
  }

  /**
   * 处理页码
   * @param props 
   */
  handlePageByPlaying(props: StateProps) {
    const { pageSize } = this.state
    const { playingInfo, listDetails } = props
    const list = listDetails.tracks
    const index = list && list.findIndex(item => item.id === playingInfo.id)
    const current = index !== -1 ? Math.ceil(index + 1 / pageSize) : 1
  }

  columns: ColumnProps<ListDetailsItem>[] = [{
    title: '音乐标题',
    dataIndex: 'name',
    className: 'columns-align',
    key: 'name',
    render: (text: string, record: ListDetailsItem) => {
      return this.props.playingInfo && this.props.playingInfo.id === record.id ?
        <span>
          <Tag color="magenta" style={{ marginLeft: 10 }}>正在播放</Tag>
          {record.name}
        </span> :
        <span>{record.name}</span>
    }
  },
  {
    title: '歌手',
    dataIndex: 'ar',
    className: 'columns-align',
    key: 'ar',
    render: (text: string, record: ListDetailsItem) => <span>{record.ar[0].name} </span>
  },
  {
    title: '专辑',
    dataIndex: 'al',
    className: 'columns-align',
    key: 'al',
    render: (text: string, record: ListDetailsItem) => <span>{record.al.name}</span>
  },
  {
    title: '播放',
    key: 'action',
    className: 'columns-align',
    width: '20%',
    render: (text: string, record: ListDetailsItem) => <ActionsButton actions={['play']} song={record} />
  }]

  get loading() {
    return !(this.props.listDetails.tracks && this.props.listDetails.tracks.length)
  }

  get listDetails() {
    return this.props.listDetails;
  }

  get playingInfo() {
    return this.props.playingInfo;
  }

  get list() {
    return this.listDetails.tracks
  }

  render() {
    return (
      <div className="list-details">
        <Card
          hoverable
          loading={this.loading}
          cover={<img src={this.listDetails.coverImgUrl} />}
        >
          <Card.Meta
            title={this.listDetails.name}
          />
        </Card>
        <Table
          size="middle"
          loading={this.loading}
          columns={this.columns}
          dataSource={this.listDetails.tracks}
          pagination={{
            current: this.state.currentPage,
            pageSize: this.state.pageSize,
            size: 'middle',
            total: this.list && this.list.length,
            onChange: (current) => {
              this.setCurrentPage(current)
            }
          }}
          locale={{
            emptyText: '暂无歌曲'
          }}
          rowKey="id"
        />
      </div>
    )
  }
}

export default connect<StateProps, StateDispatch>(mapStateToProps, mapDispatchToProps)(ListCommonDetails)