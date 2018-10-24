import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { UserInfo } from '../../types/user'
import { Store } from '../../types/store'
import { Recommend, UserRecommendSongs } from '../../types/songlist'
import { getRecommendList } from '../../actions/index'
import SongItem from '../../components/SongItem'
import * as Util from '../../services/util'
import { Spin } from 'antd'
import './style.less'

interface StateProps {
  recommendList: Recommend[]
  user: UserInfo
}
interface StateDispatch {
  dispatch: Dispatch
}

const mapStateToProps = (state: Store) => ({
  recommendList: state.playlist,
  user: state.user
})

const mapStateToDispatch = (dispatch: Dispatch) => ({
  dispatch: dispatch
})

class Content extends React.Component<StateProps & StateDispatch & RouteComponentProps> {

  componentWillMount() {
    const { dispatch } = this.props
    getRecommendList(dispatch)
    this.props.history.listen(() => getRecommendList(dispatch))
  }

  getRandomNums(count: number, range: number, nums: number[] = []) {
    let num = Math.floor(Math.random() * range)
    if (nums.includes(num)) {
      nums = this.getRandomNums(count, range, nums)
    } else {
      nums.push(num)
    }
    if (nums.length < count) {
      nums = this.getRandomNums(count, range, nums)
    }
    return nums
  }

  /**
   * 随机获取推荐歌单
   */
  get randomList() {
    const { recommendList } = this.props
    if (!recommendList.length) return []
    let list = recommendList.slice(0, 9)
    let getRandomNums = (): any => {
      let num = []
      let same = false
      for (let i = 0; i < 2; i++) {
        num.push(Math.floor(Math.random() * 9))
      }
      num.length && num.forEach((n, index, arr) => { if (arr.indexOf(n) !== arr.lastIndexOf(n)) { same = true } })
      if (same) { return getRandomNums() }
      return num
    }
    let randomList: Recommend[] = []
    let listRan = this.getRandomNums(2, 9)
    if (listRan.length) {
      for (let i = 0; i < listRan.length; i++) {
        randomList.push(list[listRan[i]])
      }
    }
    return randomList
  }

  get recommendList() {
    return this.props.recommendList
  }

  get user() {
    return this.props.user
  }

  get match() {
    return this.props.match
  }

  get history() {
    return this.props.history
  }

  get loading() {
    return !(this.recommendList && this.recommendList.length)
  }

  get cutRecommendList() {
    return this.recommendList && this.recommendList.slice(0, 9)
  }

  get userRandomList() {
    return this.randomList
  }

  get now() {
    return (new Date).getDate()
  }

  render() {
    return (
      <div className="content">
        <div className="song-list">
          <div className="list-title">
            <span>热门精选</span>
          </div>
          <Spin spinning={this.loading}>
            <div className="list-content">
              {this.cutRecommendList.length && this.cutRecommendList.map((song, index) =>
                <SongItem key={song.id} imgUrl={song.picUrl} itemName={song.name} clickItem={() => {
                  Util.go('/home/list-detail/' + song.id, this.props.history)
                }} />
              )}
            </div>
          </Spin>
        </div>
        <div className="user-recommend" style={this.user.isLocal ? { display: 'none' } : null}>
          <div className="list-title">
            <span>个性推荐</span>
          </div>
          <Spin spinning={this.loading}>
            <div className="list-content">
              <SongItem imgUrl={''} itemName="每日歌曲推荐" clickItem={() => { Util.go(`/home/user-recommend-songs`, this.history) }}>
                <div className="user-now-wrap"><span className="user-now">{this.now}</span></div>
              </SongItem>
              {
                this.userRandomList && this.userRandomList.map(item =>
                  <SongItem key={item.id} itemName={item.name} imgUrl={item.picUrl} clickItem={() => Util.go('/home/list-detail/' + item.id, this.props.history)} />
                )
              }
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}

export default withRouter(connect<StateProps, StateDispatch, any, any>(mapStateToProps, mapStateToDispatch)(Content))