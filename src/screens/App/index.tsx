import * as React from 'react'
import { withRouter, Router, HashRouter, Route, Redirect, Switch, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Store } from '../../types/store'
import TopBar from '../TopBar'
import SideBar from '../SideBar'
import BottomBar from '../BottomBar'
import Content from '../Content'
import ListDetails from '../ListDetails'
import PlayList from '../PlayList'
import RecommendSongs from '../RecommendSongs'
import SearchList from '../SearchList'
import './style.less'


export default class App extends React.Component<RouteComponentProps> {
  render() {
    return (
      <div className="app">
        <TopBar />
        <div className="middle">
          <div className="side-bar">
            <SideBar />
          </div>
          <div className="content">
            <Route path={`${this.props.match.url}/main`} component={Content} />
            <Route path={`${this.props.match.url}/list-detail/:id`} component={ListDetails} />
            <Route path={`${this.props.match.url}/playlist`} component={PlayList} />
            <Route path={`${this.props.match.url}/user-recommend-songs`} component={RecommendSongs} />
            <Route path={`${this.props.match.url}/search-list`} component={SearchList} />
          </div>
        </div>
        <BottomBar />
      </div>
    )
  }
}


