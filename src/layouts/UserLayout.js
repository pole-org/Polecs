import React from 'react';
import PropTypes from 'prop-types';
import {Link, Route} from 'dva/router';
import DocumentTitle from 'react-document-title';
import {Icon} from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import {getRouteData} from '../utils/utils';

import rs from '../rs/';

const links = [{
  title: '帮助',
  href: '',
}, {
  title: '隐私',
  href: '',
}, {
  title: '条款',
  href: '',
}];

const copyright = <div>Copyright <Icon type="copyright"/> 2017 蚂蚁金服体验技术部出品</div>;

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }

  getChildContext() {
    const {location} = this.props;
    return {location};
  }

  getPageTitle() {
    const {location} = this.props;
    const {pathname} = location;
    let title = rs.config.title;
    getRouteData('UserLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - ${rs.config.title}`;
      }
    });
    return title;
  }

  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header} style={{marginLeft: '-26px'}}>
              <Link to="/">
                <img
                  alt=""
                  className={styles.logo}
                  src="https://gw.alipayobjects.com/zos/rmsportal/NGCCBOENpgTXpBWUIPnI.svg"/>
                <span className={styles.title}>{rs.config.title}</span>
              </Link>
            </div>
            <p className={styles.desc}>长风破浪会有时，直挂云帆济沧海</p>
          </div>
          {
            getRouteData('UserLayout').map(item =>
              (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  component={item.component}
                />
              )
            )
          }
          {/*<GlobalFooter className={styles.footer} links={links} copyright={copyright}/>*/}
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
