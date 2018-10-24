import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Store } from '../../types/store'
import { UserInfo, UserPlayList } from '../../types/user'
import { getUserSongList, searchSongList } from '../../actions/index'
import * as Util from '../../services/util'
import { Menu, Icon, Spin, Input } from 'antd'
import './style.less'
import { MenuState, ClickParam, MenuProps } from 'antd/lib/menu';
import User from '../User'

interface StateToProps {
  user: UserInfo
}

interface StateToDispatch {
  dispatch: Dispatch
}

interface State {
  activeMenu: string
  spinning: boolean
}

const mapStateToProps = (state: Store) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch: dispatch
})

const Search = Input.Search

class SideBar extends React.Component<StateToProps & StateToDispatch & RouteComponentProps, State> {

  constructor(props: (StateToProps & StateToDispatch & RouteComponentProps)) {
    super(props)
    this.menuItemClick = this.menuItemClick.bind(this)
    this.getMenuContent = this.getMenuContent.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }

  state = {
    activeMenu: 'main',
    spinning: false
  }

  componentWillMount() {
    const { location, history, match } = this.props
    const pathName = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)
    // 刷新页面 如果路由不存在sidebar 跳转到首页
    if (!this.menuData.some(item => item.key === pathName)) {
      this.setState({
        activeMenu: null
      })
      return Util.go(`/home/main`, history)
    }
    pathName && this.setState({
      activeMenu: pathName
    })
  }

  componentWillReceiveProps(nextProps: (StateToProps & RouteComponentProps)) {
    const { history } = this.props
    let pathIndex = nextProps.location.pathname.lastIndexOf('/') + 1
    const nextPathName = nextProps.location.pathname.slice(pathIndex)
    let oldId = this.props.user && this.props.user && this.props.user.profile.userId
    let newId = nextProps.user && nextProps.user.profile && nextProps.user.profile.userId
    if (newId && newId !== oldId) {
      const { dispatch } = this.props
      this.setState({ spinning: true })
      getUserSongList(newId, dispatch)
        .then(() => this.setState({ spinning: false }))
        .catch(err => {
          console.warn(err)
          this.setState({ spinning: false })
        }
        )
    }
  }

  menuItemClick({ domEvent, key, keyPath }: ClickParam) {
    const { location, history, match, user } = this.props
    const newPath = `/${keyPath.reverse().join('/')}`
    if (`${match.url}${newPath}` !== location.pathname) {
      Util.go(`${match.url}${newPath}`, history)
      this.setState({
        activeMenu: key
      })
    }
  }

  getMenuContent(menu: any[], userSongList?: UserPlayList[], sub: boolean = false) {
    return menu.map(item => {
      let subMenu = item.key === 'list-detail' ? userSongList : item.menu
      return subMenu ?
        <Menu.SubMenu
          key={item.key || item.id}
          title={<span><Icon type={item.icon} />{item.name}</span>}
        >
          {this.getMenuContent(subMenu, null, true)}
        </Menu.SubMenu>
        :
        <Menu.Item key={item.key || item.id}>
          {item.icon ? <Icon type={item.icon} /> : null}
          {item.name}
        </Menu.Item>
    })
  }

  onSearch(keywords: string) {
    const { dispatch, history, location } = this.props
    if (keywords === '') return
    searchSongList(keywords, 20, 0, dispatch)
    if (location.pathname !== '/home/search-list') {
      Util.go('/home/search-list', history)
    }
  }

  menuData = [{
    name: '发现音乐',
    key: 'main',
    icon: 'appstore'
  }, {
    name: '播放列表',
    key: 'playlist',
    icon: 'customer-service'
  }, {
    name: '我的歌单',
    key: 'list-detail',
    icon: 'heart-o',
    isLocal: false,
    subMenu: [] as any[]
  }]

  get user() {
    return this.props.user
  }

  get menu() {
    return !this.user.isLocal ? this.menuData : this.menuData.filter(item => item.isLocal !== false)
  }

  get userSonglist() {
    return (this.user && this.user.playlist) || []
  }

  render() {
    return (
      <div className="side-bar">
        <Spin spinning={this.state.spinning}>
          <User />
          <div className="search">
            <Search placeholder="搜索" onSearch={(value) => this.onSearch(value)} style={{ width: 200 }} />
          </div>
          <Menu
            mode="inline"
            selectedKeys={[this.state.activeMenu]}
            defaultOpenKeys={['userSonglist']}
            onClick={this.menuItemClick}
          >
            {this.getMenuContent(this.menu, this.userSonglist)}
          </Menu>
        </Spin>
      </div>
    )
  }
}

export default withRouter(connect<StateToProps, StateToDispatch>(mapStateToProps, mapDispatchToProps)(SideBar))