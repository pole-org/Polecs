import React from 'react';
import PropTypes from 'prop-types';
import {Layout, Menu, Icon, Avatar, Dropdown, Tag, message, Spin, Tooltip} from 'antd';
import DocumentTitle from 'react-document-title';
import {connect} from 'dva';
import {Link, Route, Redirect, Switch} from 'dva/router';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import {ContainerQuery} from 'react-container-query';
import classNames from 'classnames';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import styles from './BasicLayout.less';
import HeaderSearch from '../components/HeaderSearch';
import NoticeIcon from '../components/NoticeIcon';
import GlobalFooter from '../components/GlobalFooter';
import {getNavData} from '../common/nav';
import {getRouteData, getRedirectData} from '../utils/utils';

import rs from '../rs/';

const {Header, Sider, Content} = Layout;
const {SubMenu} = Menu;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let lastHref

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }

  constructor(props) {
    super(props);
    // 把一级 Layout 的 children 作为菜单项
    this.menus = getNavData().reduce((arr, current) => arr.concat(current.children), []);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }

  getChildContext() {
    const {location} = this.props;
    const routeData = getRouteData('BasicLayout');
    const menuData = getNavData().reduce((arr, current) => arr.concat(current.children), []);
    const breadcrumbNameMap = {};
    routeData.concat(menuData).forEach((item) => {
      breadcrumbNameMap[item.path] = item.name;
    });
    return {location, breadcrumbNameMap};
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.props.dispatch({
      type: 'user/query',
    });
  }

  componentWillUnmount() {
    clearTimeout(this.resizeTimeout);
  }

  onCollapse = (collapsed) => {

    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  onMenuClick = ({key}) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  }

  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    currentMenuSelectedKeys.splice(-1, 1);
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard'];
    }
    return currentMenuSelectedKeys;
  }

  getCurrentMenuSelectedKeys(props) {
    const {location: {pathname}} = props || this.props;
    const keys = pathname.split('/').slice(1);
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key];
    }
    return keys;

  }

  getNavMenuItems(menusData, parentPath = '') {
    const {moduleList, viewList} = this.props;
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null;
      }
      let itemPath;
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (moduleList.includes(item.code) && item.children && item.children.some(child => child.name)
        && item.children.filter(child => child.show).length > 0
        && item.children.filter(child => viewList.includes(child.code)).length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon}/>
                  <span>{item.name}</span>
                </span>
              ) : item.name
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children, itemPath)}
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={item.icon}/>;
      if (item.show && viewList.includes(item.code)) {
        return (
          <Menu.Item key={item.key || item.path}>
            {
              /^https?:\/\//.test(itemPath) ? (
                <a href={itemPath} target={item.target}>
                  {icon}<span>{item.name}</span>
                </a>
              ) : (
                <Link to={itemPath} target={item.target}>
                  {icon}<span>{item.name}</span>
                </Link>
              )
            }
          </Menu.Item>
        );
      }
    });
  }

  getPageTitle() {
    const {location} = this.props;
    const {pathname} = location;
    let title = rs.config.title;
    getRouteData('BasicLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - ${title}`;
      }
    });
    return title;
  }

  getNoticeData() {
    const {notices = []} = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = {...notice};
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{marginRight: 0}}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  handleOpenChange = (openKeys) => {
    console.log(openKeys)
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    this.setState({
      openKeys: latestOpenKey ? [latestOpenKey] : [],
    });
  }
  toggle = () => {
    const {collapsed} = this.props;
    console.log(collapsed)
    if (!collapsed) {
      this.setState({
        openKeys: []
      })
    }
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
    // this.resizeTimeout = setTimeout(() => {
    //   const event = document.createEvent('HTMLEvents');
    //   event.initEvent('resize', true, false);
    //   window.dispatchEvent(event);
    // }, 600);
  }
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

  render() {
    const {currentUser, collapsed, fetchingNotices, location, loading} = this.props;
    let {hash} = location;
    hash = hash.startsWith('#/') ? hash : `#/${hash}`;
    const href = window.location.href;
    if (lastHref !== href) {
      NProgress.start();
      if (!loading.global) {
        NProgress.done();
        lastHref = href;
      }
      setTimeout(() => {
        NProgress.done();
      }, 10000)
    }
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled><Icon type="user"/>个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting"/>设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout"/>退出登录</Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();

    // Don't show popup menu when it is been collapsed
    // const MenuProps=!collapsed?{ openKeys:this.state.openKeys}:{}

    const layout = (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onCollapse={this.onCollapse}
          width={256}
          className={styles.sider}
        >
          <div className={styles.logo}>
            <Link to="/">
              <img src="https://gw.alipayobjects.com/zos/rmsportal/iwWyPinUoseUxIAeElSx.svg" alt="logo"/>
              <h1>{rs.config.title}</h1>
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            openKeys={this.state.openKeys}
            onOpenChange={this.handleOpenChange}
            selectedKeys={this.getCurrentMenuSelectedKeys()}
            style={{margin: '16px 0', width: '100%'}}
            inlineCollapsed={this.state.collapsed}
          >
            {this.getNavMenuItems(this.menus)}
          </Menu>
        </Sider>
        <Layout
          className={classNames({[styles.content]: true, [styles.contentCollapsed]: collapsed})}
        >
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className={styles.right}>
              {/*<HeaderSearch*/}
              {/*className={`${styles.action} ${styles.search}`}*/}
              {/*placeholder="站内搜索"*/}
              {/*dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}*/}
              {/*onSearch={(value) => {*/}
              {/*console.log('input', value); // eslint-disable-line*/}
              {/*}}*/}
              {/*onPressEnter={(value) => {*/}
              {/*console.log('enter', value); // eslint-disable-line*/}
              {/*}}*/}
              {/*/>*/}
              <Tooltip placement="bottomLeft" title="返回erp">
                <a href={`${rs.config.getConfig('api')}/home/desktop`}><Icon
                  className={styles.trigger}
                  type="rocket"
                />
                </a>
              </Tooltip>
              {/*<NoticeIcon*/}
              {/*className={styles.action}*/}
              {/*count={currentUser.notifyCount}*/}
              {/*onItemClick={(item, tabProps) => {*/}
              {/*console.log(item, tabProps); // eslint-disable-line*/}
              {/*}}*/}
              {/*onClear={this.handleNoticeClear}*/}
              {/*onPopupVisibleChange={this.handleNoticeVisibleChange}*/}
              {/*loading={fetchingNotices}*/}
              {/*popupAlign={{offset: [20, -16]}}*/}
              {/*>*/}
              {/*<NoticeIcon.Tab*/}
              {/*list={noticeData['通知']}*/}
              {/*title="通知"*/}
              {/*emptyText="你已查看所有通知"*/}
              {/*emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"*/}
              {/*/>*/}
              {/*<NoticeIcon.Tab*/}
              {/*list={noticeData['消息']}*/}
              {/*title="消息"*/}
              {/*emptyText="您已读完所有消息"*/}
              {/*emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"*/}
              {/*/>*/}
              {/*<NoticeIcon.Tab*/}
              {/*list={noticeData['待办']}*/}
              {/*title="待办"*/}
              {/*emptyText="你已完成所有待办"*/}
              {/*emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"*/}
              {/*/>*/}
              {/*</NoticeIcon>*/}
              {currentUser ? (
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar
                      size="small"
                      className={styles.avatar}
                      src={rs.util.string.isNullOrEmpty(currentUser.head_imgurl)
                        ? rs.config.defaultAvator : `${rs.config.getConfig('imgUrl')}${currentUser.head_imgurl}`}
                    />
                    {currentUser.user_name}
                  </span>
                </Dropdown>
              ) : <Spin size="small" style={{marginLeft: 8}}/>}
            </div>
          </Header>
          <Content style={{margin: '24px 24px 0', height: '100%'}}>
            <Switch>
              {
                getRouteData('BasicLayout').map(item => {
                    return (
                      <Route
                        exact={item.exact}
                        key={item.path}
                        path={item.path}
                        component={item.component}
                      />
                    );
                  }
                )
              }
              {
                getRedirectData('BasicLayout').map(item => {
                  if (item.redirect) {
                    return (
                      <Redirect
                        from={item.fullPath}
                        to={item.redirect}
                      />
                    );
                  }
                })
              }
            </Switch>
            {/*<GlobalFooter*/}
              {/*links={[{*/}
                {/*title: 'Pro 首页',*/}
                {/*href: 'http://pro.ant.design',*/}
                {/*blankTarget: true,*/}
              {/*}, {*/}
                {/*title: 'GitHub',*/}
                {/*href: 'https://github.com/ant-design/ant-design-pro',*/}
                {/*blankTarget: true,*/}
              {/*}, {*/}
                {/*title: 'Ant Design',*/}
                {/*href: 'http://ant.design',*/}
                {/*blankTarget: true,*/}
              {/*}]}*/}
              {/*copyright={*/}
                {/*<div>*/}
                  {/*Copyright <Icon type="copyright"/> 2017 蚂蚁金服体验技术部出品*/}
                {/*</div>*/}
              {/*}*/}
            {/*/>*/}
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  moduleList: state.user.moduleList,
  viewList: state.user.viewList,
  currentUser: state.user.currentUser,
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
  loading: state.loading,
}))(BasicLayout);
