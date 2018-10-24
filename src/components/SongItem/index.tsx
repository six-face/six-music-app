import * as React from 'react'
import './style.less'

interface Props {
  imgUrl: string
  itemName: string
  clickItem: () => any
}

class SongItem extends React.Component<Props> {
  render() {
    const { clickItem, imgUrl, itemName } = this.props
    return (
      <div className="song-item" onClick={() => clickItem()}>
        <div className="item-img">
          {imgUrl ? <img src={imgUrl} alt={itemName} /> : this.props.children}
        </div>
        <p className="song-name">{this.props.itemName}</p>
      </div>
    )
  }
}

export default SongItem