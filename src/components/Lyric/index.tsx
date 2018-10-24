import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import { getLyric } from '../../services/Songinfo'
import { Store } from '../../types/store'
import { ListDetailsItem } from '../../types/songlist'
import './style.less'

interface StateProps {
  playingSong: ListDetailsItem
}

interface OwnProps {
  visible: boolean,
  running: boolean,
  currentTime: string,
  onClose: () => any
}

interface State {
  noTransform: boolean,
  fetching: boolean,
  lyricArr: LyricArrItem[],
  lyricMap: LyricMap,
  activeIndex: number
}

interface LyricMap {
  [propName: string]: {
    content: string,
    index: number
  }
}

interface LyricArrItem {
  time: string,
  content: string
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  playingSong: state.playingSong,
  visible: ownProps.visible,
  running: ownProps.running,
  currentTime: ownProps.currentTime,
  onClose: ownProps.onClose
})


class Lyric extends React.Component<StateProps & OwnProps, State> {

  state: State = {
    noTransform: false, // 是否设置成Transform
    fetching: false, // 是否正在获取歌词
    lyricArr: [], // 当前歌曲的歌词
    lyricMap: {
      '00:00': {
        content: '',
        index: 0
      }
    }, // 数据查找
    activeIndex: 0, //匹配歌词索引
  }

  componentWillReceiveProps(nextProps: StateProps & OwnProps) {
    if (nextProps.visible !== this.props.visible) {
      setTimeout(() => this.setState({ noTransform: nextProps.visible }), 100)
    }
    this.watchPlaying(nextProps.playingSong, this.props.playingSong)
    this.watchCurrentTime(nextProps.currentTime, this.props.currentTime)
  }

  /**
   * 监听播放歌曲变化，重新设置歌词
   * @param newPlaying 
   * @param oldPlaying 
   */
  async watchPlaying(newPlaying = {} as ListDetailsItem, oldPlaying = {} as ListDetailsItem) {
    if (newPlaying.id && newPlaying.id !== oldPlaying.id) {
      let lyricArr: LyricArrItem[] = []
      let lyricMap: LyricMap = {}
      try {
        this.setState({ fetching: true, activeIndex: 0 })
        const result = await getLyric(newPlaying.id)
        if (result) {
          const lyricStr = (result.lrc && result.lrc.lyric) || ''
          lyricArr = lyricStr.replace(/\n/g, ',')
            .split(',')
            .filter((item: string) => item)
            .map((item: string) => {
              let contentStartIndex = item.indexOf(']') + 1
              return {
                time: item.slice(1, 6),
                content: item.slice(contentStartIndex || 10).trim()
              }
            })
          lyricArr.forEach((item, index) => (
            lyricMap[item.time] = {
              content: item.content,
              index
            }
          ))

        }
        this.setState({ fetching: false, lyricArr, lyricMap })
      } catch (err) {
        console.warn(err)
        this.setState({ fetching: false, lyricArr, lyricMap })
      }
    }
  }

  /**
   * 监听播放时间的变化
   * @param newTime 
   * @param oldTime 
   */
  watchCurrentTime(newTime: string = '', oldTime: string = '') {
    if (!newTime) return
    const { index, content } = this.state.lyricMap[newTime] || { index: 0, content: '' }
    if (content && index !== undefined) {
      this.setState({ activeIndex: index })
    }
  }

  get visible() {
    return this.props.visible
  }

  get running() {
    return this.props.running
  }

  get onClose() {
    return this.props.onClose
  }

  get playingSong() {
    return this.props.playingSong
  }

  get album() {
    return this.playingSong.al || {}
  }

  get artist() {
    return (this.playingSong.ar && this.playingSong.ar[0]) || {}
  }

  get coverUrl() {
    return this.playingSong.al.picUrl || ''
  }

  render() {
    if (!this.visible) return null
    return (
      <div className="lyric" style={{ transform: this.state.noTransform ? 'none' : '' }}>
        <div className="background" style={{ backgroundImage: `url(${this.coverUrl})` }}></div>
        <div className="content">
          <Icon type="close" onClick={this.onClose} />
          <div
            className={`cover ${this.running ? 'is-running' : ''}`}
            style={{ backgroundImage: `url(${this.coverUrl})` }}
          ></div>
          <div className="wrapper">
            <div className="wrapper-title">
              <h3>{this.playingSong.name}</h3>
              <div className="song-massage">
                <span>歌手：{this.playingSong.ar[0].name || '未知'}</span>
                <span>专辑：{this.playingSong.al.name || '未知'}</span>
              </div>
            </div>
            <div className="wrapper-content">
              <div
                className="lyric-show"
                style={{ transform: `translateY(${160 + -40 * this.state.activeIndex}px)` }}
              >
                {this.state.lyricArr.length && this.state.lyricArr.map((item, index) =>
                  <p
                    key={index}
                    className={this.state.activeIndex === index ? 'active' : ''}
                  >{item.content}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect<StateProps, any, OwnProps, any>(mapStateToProps)(Lyric)