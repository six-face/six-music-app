import * as React from 'react'
import { connect } from 'react-redux'
import './style.less'
import Audio from '../Audio'

class BottomBar extends React.Component {
  render() {
    return (
      <div className="bottom-bar">
        <Audio />
      </div>
    )
  }
}

export default connect()(BottomBar)