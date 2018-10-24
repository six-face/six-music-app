import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import './assets/static/public.less'
import { reducer, store } from './reducers'
import { userDetail, UserRecommendSongs } from './services/User'
import { searchDate } from './services/Search'
import App from './screens/App'

/**
 * 检测用户是否已经登录 初始化用户信息
 */
(async function checkLoginStatus() {
  let loginStatusResult = await UserRecommendSongs()
  if (loginStatusResult.code === 200) {
    let userDetailResult = await userDetail()
    if (userDetailResult.code === 200) {
      store.dispatch({
        type: 'LOGIN',
        profile: userDetailResult.profile
      })
    }
  }
})()

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Redirect from="/" exact to="/home/main" />
        <Route path="/home" component={App} />
      </Switch>
    </HashRouter>
  </Provider>
  ,
  document.getElementById('app')
)