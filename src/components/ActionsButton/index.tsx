import * as React from 'react'
import { connect } from 'react-redux'
import { Button, message } from 'antd'
import { Dispatch } from 'redux'
import { setPlaying, addToPlaylist, removeSongFromPalyingList } from '../../actions/index'
import { Store } from '../../types/store'
import { ListDetailsItem } from '../../types/songlist'
import { getSongUrl } from '../../services/Songinfo'

interface StateProps {
  playingList: ListDetailsItem[]
  playingSong: ListDetailsItem
}

interface Props {
  actions: string[]
  song: ListDetailsItem
}

interface StateDispatch {
  dispatch: Dispatch
}

const mapStateToProps = (state: Store) => ({
  playingList: state.playingList,
  playingSong: state.playingSong
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch: dispatch
})

class ActionButton extends React.Component<Props & StateProps & StateDispatch> {

  /**
   * 添加新歌曲进入播放列表
   * @param song 
   * @param ignoreError
   */
  addSongToPlayingList(song: ListDetailsItem, ignoreError: boolean) {
    const { dispatch, playingList } = this.props
    const exist = playingList.length > 1 && playingList.findIndex(item => item.id === song.id) !== -1
    if (!exist) dispatch(addToPlaylist(song))
    else if (!ignoreError) message.warning('播放列表有它啦：p')
  }

  /**
   * 渲染Button信息
   * @param action 
   * @param song 
   */
  switchButton(action: string, song: ListDetailsItem) {
    const { dispatch, playingSong } = this.props
    switch (action) {
      case 'play':
        return {
          icon: 'caret-right',
          title: '播放',
          disabled: playingSong && playingSong.id === song.id,
          onClick: () => {
            this.addSongToPlayingList(song, true)
            if (!playingSong || playingSong.id !== song.id) dispatch(setPlaying(song))
          }
        }
      case 'add':
        return {
          icon: 'plus-circle',
          title: '添加到播放列表',
          onClick: () => this.addSongToPlayingList(song, true)
        }
      case 'remove':
        return {
          icon: 'delete',
          title: '从播放列表中删除',
          onClick: () => dispatch(removeSongFromPalyingList(song.id))
        }
    }
  }

  get actions() {
    return this.props.actions
  }

  get song() {
    return this.props.song
  }

  render() {
    return (
      <Button.Group>
        {this.actions.map((item, index) => {
          const props = this.switchButton(item, this.song)
          return <Button key={index} type="primary" {...props} />
        })}
      </Button.Group>
    )
  }
}

export default connect<StateProps, StateDispatch>(mapStateToProps, mapDispatchToProps)(ActionButton)

