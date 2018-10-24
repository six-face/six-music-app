import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Store } from '../../types/store'
import { UserRecommendSongs, ListDetailsItem } from '../../types/songlist'
import ActionsButton from '../../components/ActionsButton'
import { setPlayList, setPlaying, UserRecommendSongsAction } from '../../actions'
import { Table, Tag, Card, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import './style.less'

interface StateProps {
  userRecommendSongs: UserRecommendSongs[]
  playingSong: ListDetailsItem,
  playingList: ListDetailsItem[]
}

interface StateDispatch {
  dispatch: Dispatch
}

const mapStateToProps = (state: Store) => ({
  userRecommendSongs: state.user.userRecommendSongs,
  playingSong: state.playingSong,
  playingList: state.playingList
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch: dispatch
})

class RecommendSongs extends React.Component<StateProps & StateDispatch>{

  constructor(props: (StateProps & StateDispatch)) {
    super(props)
    this.playingAll = this.playingAll.bind(this)
    this.formateData = this.formateData.bind(this)
  }

  componentWillMount() {
    const { dispatch } = this.props
    UserRecommendSongsAction(dispatch)
  }

  /**
   * 格式化相同数据类型
   */
  formateData(song: UserRecommendSongs) {
    let obj: ListDetailsItem = {
      url: song.mp3Url,
      dt: song.duration,
      name: song.name,
      id: song.id,
      al: {
        id: song.album.id,
        name: song.album.name,
        picUrl: song.album.picUrl
      },
      ar: [{ id: song.album.artists[0].id, name: song.album.artists[0].name }]
    }
    return obj
  }

  /**
   * 播放全部歌曲
   */
  playingAll() {
    const { dispatch, userRecommendSongs } = this.props
    let songs: UserRecommendSongs[] = [...userRecommendSongs]
    let addSongs: any[] = []
    /**
     * 构造相同数据类型
     */
    addSongs = songs.map(item => this.formateData(item))
    dispatch(setPlayList(addSongs))
    dispatch(setPlaying(addSongs[0]))
  }

  columns: ColumnProps<UserRecommendSongs>[] = [{
    title: '歌曲信息',
    dataIndex: 'name',
    render: (text: string, record: UserRecommendSongs) => {
      return this.playingSong && this.playingSong.id === record.id ? <span><Tag color="magenta" style={{ marginLeft: 10 }}>正在播放</Tag>{record.name}</span> : <span>{record.name}</span>
    }
  }, {
    title: '歌手',
    dataIndex: 'ar',
    render: (text: string, record: UserRecommendSongs) => <span>{record.album.artists[0].name}</span>
  },
  {
    title: '专辑',
    dataIndex: 'al',
    render: (text: string, record: UserRecommendSongs) => <span>{record.album.name}</span>
  },
  {
    title: '播放',
    dataIndex: 'options',
    render: (text: string, record: UserRecommendSongs) => {
      return <ActionsButton actions={['play']} song={this.formateData(record)} />
    }
  }]

  get userRecommendSongs() {
    return this.props.userRecommendSongs
  }

  get playingSong() {
    return this.props.playingSong
  }

  get loading() {
    return !(this.userRecommendSongs && this.userRecommendSongs.length)
  }

  get now() {
    return (new Date).getDate()
  }

  render() {
    return (
      <div className="user-recommend-songs">
        <Card
          hoverable
          loading={this.loading}
          cover={<span className="recommend-now">{this.now}</span>}
        >
          <Card.Meta
            title="每日推荐"
          />
        </Card>
        <div className="options">
          <Button icon="caret-right" size="small" disabled={this.loading} onClick={this.playingAll}>全部播放</Button>
        </div>
        <Table
          columns={this.columns}
          dataSource={this.userRecommendSongs}
          pagination={false}
          loading={this.loading}
          locale={{ emptyText: '暂无歌曲' }}
          rowKey="id"
        />
      </div>
    )
  }
}

export default connect<StateProps, StateDispatch>(mapStateToProps, mapDispatchToProps)(RecommendSongs)