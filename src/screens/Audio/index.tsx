import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { ListDetailsItem } from '../../types/songlist'
import { Store } from '../../types/store'
import { FormatDate } from '../../services/util'
import { setPlaying } from '../../actions'
import { message, Icon, Tooltip } from 'antd'
import Lyric from '../../components/Lyric'
import './style.less'

interface StateProps {
  playingSong: ListDetailsItem
  playingList: ListDetailsItem[]
}

interface StateDispatch {
  dispatch: Dispatch
}

interface State {
  running: boolean,
  percent: number,
  currentTime: string,
  mouseoverTime: string,
  lyricVisible: boolean
}

const mapStateToProprs = (state: Store) => ({
  playingSong: state.playingSong,
  playingList: state.playingList
})

const mapDispathToProps = (dispatch: Dispatch) => ({
  dispatch: dispatch
})

class Audio extends React.Component<StateProps & StateDispatch, State> {

  constructor(props: (StateProps & StateDispatch)) {
    super(props)
    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
    this.toggleLyric = this.toggleLyric.bind(this)
    this.togglePlay = this.togglePlay.bind(this)
    this.onError = this.onError.bind(this)
    this.onTimeUpdate = this.onTimeUpdate.bind(this)
    this.sliderClick = this.sliderClick.bind(this)
    this.sliderMousever = this.sliderMousever.bind(this)
  }

  state = {
    running: false,
    percent: 0,
    currentTime: '00:00',
    mouseoverTime: '00:00',
    lyricVisible: false
  }

  /**
   * audio标签ref
   */
  audio = React.createRef<HTMLAudioElement>()

  /**
   * 歌曲时间轴元素ref
   */
  bar = React.createRef<HTMLDivElement>()

  /**
   * 接收到新歌曲，重置播放进度
   */
  componentWillReceiveProps(nextProps: StateProps) {
    // playing 改变才是新歌曲
    if (nextProps.playingSong !== this.props.playingSong) {
      let newStatus = true
      this.setState({
        currentTime: '00:00',
        percent: 0,
        running: true
      })
      this.setCurrentTimeByPercent(0)
    }
  }

  /**
  * 暂停/播放
  */
  togglePlay() {
    // error.code: 1、用户终止 2、网络错误 3、解码错误 4、URL无效
    if (this.audio.current.error) return
    let newStatus = !this.state.running
    this.setState({ running: newStatus })
    newStatus ? this.audio.current.play() : this.audio.current.pause()
  }

  /**
   * 上一首
   */
  next() {
    const { dispatch, playingList, playingSong } = this.props
    if (!playingList.length) return
    let index = playingList.findIndex(item => item.id === playingSong.id)
    // 最后一首回到第一首
    let newIndex = index !== -1 && playingList.length - 1 !== index ? index + 1 : 0
    dispatch(setPlaying(playingList[newIndex]))
  }

  /**
   * 下一首
   */
  prev() {
    const { dispatch, playingList, playingSong } = this.props
    if (!playingList.length) return
    let index = playingList.findIndex(item => item.id === playingSong.id)
    // 第一首不前进
    let newIndex = index > 0 ? index - 1 : 0
    dispatch(setPlaying(playingList[newIndex]))
  }

  /**
   * 监听播放进度的变化
   */
  onTimeUpdate() {
    const { playingSong } = this.props
    const newTime = FormatDate(this.audio.current.currentTime)
    const percent = (this.audio.current.currentTime / this.audio.current.duration * 10000) / 100
    this.setState({
      currentTime: newTime,
      percent
    })
  }

  /**
   * 错误处理
   * @param error 
   */
  onError(error: any) {
    console.log('error', event, this.audio && this.audio.current.error)
    const { running } = this.state
    if (running) {
      message.warning('当前歌曲无法播放，即将播放下一首')
      this.setState({ running: false })
      setTimeout(() => this.next(), 2000)
    }
  }

  /**
   * 进度条点击
   * @param event 
   */
  sliderClick(event: React.MouseEvent<HTMLDivElement>) {
    let width = this.bar.current.clientWidth
    let left = event.clientX - this.bar.current.offsetLeft
    this.setCurrentTimeByPercent(left / width)
  }

  /**
   * 进度条悬浮
   * @param event 
   */
  sliderMousever(event: any) {
    let width = this.bar.current.clientWidth
    let left = event.clientX - this.bar.current.offsetLeft
    let percent = left / width
    let time = FormatDate(this.getCuurentTimeByPercent(percent))
    this.setState({
      mouseoverTime: time
    })
  }

  /**
   * 根据进度条设置当前播放时间
   * @param percent 
   */
  setCurrentTimeByPercent(percent: number) {
    this.audio.current.currentTime = this.getCuurentTimeByPercent(percent)
  }

  /**
   * 获取由于进度条改变设置的时间
   * @param percent 
   */
  getCuurentTimeByPercent(percent: number) {
    return Math.floor(percent * (this.audio.current.duration || 0))
  }

  /**
   * 切换歌词界面
   */
  toggleLyric() {
    const { playingSong } = this.props
    if (playingSong && playingSong.id) {
      this.setState({ lyricVisible: !this.state.lyricVisible })
    }
  }

  get playingSong() {
    if (this.props.playingSong) {
      return this.props.playingSong
    } else {
      return {} as ListDetailsItem
    }
  }

  get playIcon() {
    if (this.state.running) {
      return 'pause-circle'
    } else {
      return 'play-circle'
    }
  }

  get src() {
    if (this.playingSong && this.playingSong.url) {
      return this.playingSong.url
    }
    if (this.playingSong && this.playingSong.id) {
      return `http://music.163.com/song/media/outer/url?id=${this.playingSong.id}.mp3`
    }
  }

  render() {
    return (
      <div
        className={`audio-controller${this.state.lyricVisible ? 'lyric-active' : ''}`}
        style={{ background: '' }}
      >
        <audio
          autoPlay={this.state.running}
          src={this.src}
          onTimeUpdate={this.onTimeUpdate}
          onError={this.onError}
          onEnded={this.next}
          ref={this.audio}
        />
        <div className="play-wrapper">
          <Icon type="step-backward" onClick={this.prev} style={{ fontSize: '28px' }} />
          <Icon type={this.playIcon} onClick={this.togglePlay} style={{ fontSize: '28px' }} />
          <Icon type="step-forward" onClick={this.next} style={{ fontSize: '28px' }} />
        </div>
        <div className="slider-wrapper">
          <div className="meta">
            <div className="name">
              <span onClick={this.toggleLyric}>{this.playingSong.name || 'sixface'}</span>
            </div>
            <div className="audio-time">
              <span>{this.state.currentTime} | </span>
              <span>{FormatDate(this.playingSong.dt / 1000)}</span>
            </div>
          </div>
          <Tooltip title={this.state.mouseoverTime}>
            <div ref={this.bar} className="slider-runway"
              onClick={this.sliderClick}
              onMouseMove={this.sliderMousever}
            >
              <div className="slider-bar" style={{ transform: `translateX(-${100 - this.state.percent}%)` }}></div>
            </div>
          </Tooltip>
        </div>
        <Lyric
          visible={this.state.lyricVisible}
          running={this.state.running}
          currentTime={this.state.currentTime}
          onClose={() => this.setState({ lyricVisible: false })}
        />
      </div>
    )
  }
}

export default connect<StateProps, StateDispatch>(mapStateToProprs, mapDispathToProps)(Audio)