import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { UserInfo, Profile } from '../../types/user'
import { Store } from '../../types/store'
import { Avatar, Button, Modal, Card, Form, Input, Icon, Popover, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { setLocalUser, phoneLogin } from '../../actions/index'
import { go } from '../../services/util'
import './style.less'


const FormItem = Form.Item

interface StateProps {
  user: UserInfo
}

interface StateDispatch {
  dispatch: Dispatch
}

interface State {
  visible: boolean
  confirmLoading: boolean
}

const mapStateToProps = (state: Store) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch: dispatch
})

/**
 * 头像组件
 * @param param0 
 */
function UserAvatar({ profile, onClick }: { profile: Profile, onClick: () => any }) {
  return (
    <div className="avatar" onClick={onClick}>
      {
        profile && profile.userId
          ? <Avatar size="large" src={profile.avatarUrl} />
          : <span>Sixface</span>
      }
    </div>
  )
}

/**
 * 表单组件
 * @param param0 
 */
function LoginForm({ props, onSubmit }: { props: (FormComponentProps & any), onSubmit: (event?: React.FormEvent) => any }) {
  const { getFieldDecorator } = props.form
  return (
    <Form onSubmit={onSubmit}>
      <FormItem>
        {
          getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入手机号码' }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="手机号"
            />
          )
        }
      </FormItem>
      <FormItem>
        {
          getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="密码"
              type="password"

            />
          )
        }
      </FormItem>
      {/* 触发onSubmit事件 */}
      <button style={{ display: 'none' }}></button>
    </Form>
  )
}

class User extends React.Component<StateProps & StateDispatch & FormComponentProps & RouteComponentProps, State> {

  constructor(props: (StateProps & StateDispatch & FormComponentProps & RouteComponentProps)) {
    super(props)
    this.loginOut = this.loginOut.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
    this.toggleShow = this.toggleShow.bind(this)
  }
  state = {
    visible: false,
    confirmLoading: false
  }

  loginOut() {
    const { dispatch, location, history, match } = this.props
    let pathName = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)
    setLocalUser(dispatch)
    this.setState({ visible: false })
    if (pathName !== 'main') return go(`${match.url}/main`, history)
  }

  onSubmit(event: React.FormEvent) {
    const { form, dispatch } = this.props
    event.preventDefault()
    form.validateFields(async (error: Error, values: { phone: string, password: string }) => {
      try {
        const { dispatch } = this.props
        const { phone, password } = values
        this.setState({ confirmLoading: true })
        const result = await phoneLogin(phone, password, dispatch)
        if (result && result.code === 200) {
          this.setState({
            visible: false,
            confirmLoading: false
          })
          let id = result.profile && result.profile.userId
          result.cookie.forEach(cookie => {
            cookie = cookie.replace('HttpOnly', '')
            document.cookie = cookie
          })
        } else {
          message.warning(result.msg || '登录异常，请稍后重试')
        }
      } catch (err) {
        console.log(err)
        message.warning(err.msg || '网络异常，请稍后再试')
      }
      this.setState({ confirmLoading: false })
    })
  }

  show() { this.setState({ visible: true }) }

  hide() { this.setState({ visible: false }) }

  toggleShow() {
    if (this.state.visible) {
      this.hide()
    } else {
      this.show()
    }
  }

  get user() {
    return this.props.user
  }

  get profile() {
    return this.user.profile
  }

  render() {
    let content = null
    if (this.user.isLocal === false && !this.state.confirmLoading) {
      content = (
        <Popover
          placement="rightTop"
          content={
            <Card
              style={{ width: 200 }}
              cover={<img src={this.profile.avatarUrl} alt="头像" />}
              actions={[<Button type="danger" onClick={this.loginOut}>退出登录</Button>]}
            >
              <Card.Meta
                title={this.profile.nickname}
                description={this.profile.signature}
              />
            </Card>
          }
          trigger="click"
          visible={this.state.visible}
        >
          <UserAvatar profile={this.profile} onClick={this.toggleShow} />
        </Popover>
      )
    } else {
      content = (
        <div>
          <UserAvatar profile={this.profile} onClick={this.toggleShow} />
          <Modal
            visible={this.state.visible}
            title="使用网易云账号登陆"
            wrapClassName="login-modal"
            width={400}
            okText="登录"
            cancelText="取消"
            onOk={(event) => this.onSubmit(event)}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.hide}
          >
            <LoginForm props={this.props} onSubmit={this.onSubmit} />
          </Modal>
        </div>
      )
    }
    return (
      <div className="user-info">
        {content}
      </div>
    )
  }
}

export default Form.create()(withRouter(connect<StateProps, StateDispatch>(mapStateToProps, mapDispatchToProps)(User)))