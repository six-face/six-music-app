import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { remote } from 'electron'
import { Icon, Button } from 'antd'
import { connect } from 'react-redux'
import { Store } from '../../types/store'
import { Step } from '../../types/common'
import './style.less'
import * as Util from '../../services/util'

interface StateProps {
  step: Step
}

const mapStateToProps = (state: Store) => ({
  step: state.step
})

const isWin = process.platform === 'win32'

class TopBar extends React.Component<StateProps & RouteComponentProps> {

  constructor(props: (StateProps & RouteComponentProps)) {
    super(props)
    this.max = this.max.bind(this)
    this.min = this.min.bind(this)
    this.close = this.close.bind(this.close)
  }

  max() {
    let win = remote.getCurrentWindow()
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  }

  min() {
    remote.getCurrentWindow().minimize()
  }

  close() {
    remote.getCurrentWindow().close()
  }

  get step() {
    return this.props.step
  }

  render() {
    return (
      <div className="top-bar">
        <div className="navigate">
          <Button type="primary" className="history" icon="left-circle" disabled={this.step.total === 0} onClick={() => Util.back()} />
          <Button type="primary" className="history" icon="right-circle" disabled={this.step.total === this.step.current} onClick={() => Util.forward()} />
        </div>
        {isWin &&
          <div className="win-controller" style={isWin ? { display: '' } : { display: 'none' }}>
            <Button icon="arrows-alt" size="small" onClick={this.max}></Button>
            <Button icon="minus" size="small" onClick={this.min}></Button>
            <Button icon="close" size="small" onClick={this.close}></Button>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(connect<StateProps>(mapStateToProps)(TopBar))
