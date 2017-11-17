import React, {PureComponent} from 'react';
import {Card, Row, Col} from 'antd';
import styles from './index.less';

export default class HeadInfo extends PureComponent {
  renderInfo() {
    const {options} = this.props;
    if (options === undefined || options === null || options.length === 0) {
      return null;
    }
    options.map((opt, idx) => {
      opt.sm = (24 / options.length);
      opt.bordered = idx !== options.length;
    });
    return (
      <Row>
        {options.map(opt => {
          return (
            <Col sm={opt.sm} xs={24}>
              <div className={styles.item}>
                <span>{opt.title}</span>
                <p>{opt.value}</p>
                {opt.bordered && <em />}
              </div>
            </Col>
          );
        })}
      </Row>
    );
  }

  render() {
    return (
      <div className={styles.headInfo}>
        <Card bordered={false} style={{marginBottom: 24}}>
          {this.renderInfo()}
        </Card>
      </div>
    );
  }
}

