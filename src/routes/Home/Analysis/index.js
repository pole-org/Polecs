import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col, Icon, Card, Tabs, Table, Radio, DatePicker, Tooltip, Menu, Dropdown, Button, Select} from 'antd';
import numeral from 'numeral';
import Trend from '../../../components/Trend';
import {rmb, dollar, fix} from '../../../rs/format/'
import {
  ChartCard, yuan, MiniArea, MiniBar, MiniProgress, Field, Bar, Pie, TimelineChart,
} from '../../../components/Charts';
import {getTimeDistance} from '../../../utils/utils';
import rs from '../../../rs/'

import styles from './index.less';

const {TabPane} = Tabs;
const Option = Select.Option


const modelNamespace = 'dashboard_analysis';

@connect(state => ({
  loading: state.loading,
  chart: state.chart,
  [modelNamespace]: state[modelNamespace]
}))
@rs.component.injectRole('home_analysis')
@rs.component.injectModel(modelNamespace)
export default class extends PureComponent {
  state = {
    salesType: 'all',
    currentTabKey: 'sales',
  }

  componentDidMount() {
    const year = new Date().getFullYear()
    this.fetchSales(year)
  }


  componentWillUnmount() {
    const {model} = this.props;
    model.setState({
      salesData: [],
      shopRankingData: []
    })
  }

  fetchSales = (year) => {
    const {model} = this.props;
    const {[model.name]: {currentYear}} = this.props;
    model.dispatch({
      type: 'fetchSales',
      payload: {
        year: year || currentYear,
        shopCount: 7
      },
    });
  }

  fetchOrder = (year) => {
    const {model} = this.props;
    const {[model.name]: {currentYear}} = this.props;
    model.dispatch({
      type: 'fetchOrder',
      payload: {
        year: year || currentYear,
        shopCount: 7
      },
    });
  }

  handleChangeSalesType = (e) => {
    this.setState({
      salesType: e.target.value,
    });
  }

  handleTabChange = (key) => {
    console.log(key)
    this.setState({
      currentTabKey: key,
    });
    if (key === 'sales') {
      this.fetchSales();
    } else {
      this.fetchOrder();
    }
  }

  handleSelect = (value) => {
    this.handleSearch(value)
  }

  render() {
    const {rangePickerValue} = this.state;
    const {model, loading} = this.props;
    const {
      [model.name]: {
        salesTrendData, shopSalesRankingData,
        orderTrendData, shopOrderRankingData, currentYear
      }
    } = this.props;
    const options = [
      {label: '2017', value: '2017'},
      {label: '2018', value: '2018'},
      {label: '2019', value: '2019'},
      {label: '2020', value: '2020'},
      {label: '2021', value: '2021'},
    ]
    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <Select
          value={currentYear}
          style={{width: 100}}
          onSelect={value => this.handleSelect(value)}>
          {options.map(opt => {
            return <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          })}
        </Select>
      </div>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: {marginBottom: 24},
    };

    return (
      <div>
        {/*<Row gutter={24}>*/}
        {/*<Col {...topColResponsiveProps}>*/}
        {/*<ChartCard*/}
        {/*bordered={false}*/}
        {/*title="总销售额"*/}
        {/*action={<Tooltip title=""><Icon type="info-circle-o"/></Tooltip>}*/}
        {/*total={numeral(1381747).format('$ 0,0.00')}*/}
        {/*footer={<Field label="日均销售额" value={`$${numeral(12423).format('0,0')}`}/>}*/}
        {/*contentHeight={46}*/}
        {/*>*/}
        {/*<Trend flag="up" style={{marginRight: 16}}>*/}
        {/*周同比<span className={styles.trendText}>12%</span>*/}
        {/*</Trend>*/}
        {/*<Trend flag="down">*/}
        {/*日环比<span className={styles.trendText}>11%</span>*/}
        {/*</Trend>*/}
        {/*</ChartCard>*/}
        {/*</Col>*/}
        {/*<Col {...topColResponsiveProps}>*/}
        {/*<ChartCard*/}
        {/*bordered={false}*/}
        {/*title="访问量"*/}
        {/*action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}*/}
        {/*total={numeral(8846).format('0,0')}*/}
        {/*footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}*/}
        {/*contentHeight={46}*/}
        {/*>*/}
        {/*<MiniArea*/}
        {/*color="#975FE4"*/}
        {/*height={46}*/}
        {/*data={visitData}*/}
        {/*/>*/}
        {/*</ChartCard>*/}
        {/*</Col>*/}
        {/*<Col {...topColResponsiveProps}>*/}
        {/*<ChartCard*/}
        {/*bordered={false}*/}
        {/*title="支付笔数"*/}
        {/*action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}*/}
        {/*total={numeral(6560).format('0,0')}*/}
        {/*footer={<Field label="转化率" value="60%" />}*/}
        {/*contentHeight={46}*/}
        {/*>*/}
        {/*<MiniBar*/}
        {/*height={46}*/}
        {/*data={visitData}*/}
        {/*/>*/}
        {/*</ChartCard>*/}
        {/*</Col>*/}
        {/*<Col {...topColResponsiveProps}>*/}
        {/*<ChartCard*/}
        {/*bordered={false}*/}
        {/*title="运营活动效果"*/}
        {/*action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}*/}
        {/*total="78%"*/}
        {/*footer={*/}
        {/*<div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>*/}
        {/*<Trend flag="up" style={{ marginRight: 16 }}>*/}
        {/*周同比<span className={styles.trendText}>12%</span>*/}
        {/*</Trend>*/}
        {/*<Trend flag="down">*/}
        {/*日环比<span className={styles.trendText}>11%</span>*/}
        {/*</Trend>*/}
        {/*</div>*/}
        {/*}*/}
        {/*contentHeight={46}*/}
        {/*>*/}
        {/*<MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />*/}
        {/*</ChartCard>*/}
        {/*</Col>*/}
        {/*</Row>*/}
        <Card
          loading={
            this.state.currentTabKey === 'sales'
              ? loading.effects[`${model.name}/fetchSales`]
              : loading.effects[`${model.name}/fetchOrder`]
          }
          bordered={false}
          bodyStyle={{padding: 0}}
        >
          <div className={styles.salesCard}>
            <Tabs
              activeKey={this.state.currentTabKey}
              tabBarExtraContent={salesExtra}
              size="large"
              tabBarStyle={{marginBottom: 24}}
              onChange={key => this.handleTabChange(key)}>
              <TabPane tab="销售额" key="sales">
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar
                        height={295}
                        margin={[32, 0, 32, 80]}
                        title={`${currentYear}年 销售额趋势`}
                        data={salesTrendData}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>店铺销售额排名</h4>
                      <ul className={styles.rankingList}>
                        {
                          shopSalesRankingData.map((item, i) => (
                            <li key={item.x}>
                              <span className={(i < 3) ? styles.active : ''}>{i + 1}</span>
                              <span>{item.x}</span>
                              <span>{dollar(item.y)}</span>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="订单量" key="order">
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar
                        height={295}
                        margin={[32, 0, 32, 80]}
                        title={`${currentYear}年 订单量趋势`}
                        data={orderTrendData}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>店铺订单量排名</h4>
                      <ul className={styles.rankingList}>
                        {
                          shopOrderRankingData.map((item, i) => (
                            <li key={item.x}>
                              <span className={(i < 3) ? styles.active : ''}>{i + 1}</span>
                              <span>{item.x}</span>
                              <span>{fix(item.y)}</span>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </div>
    );
  }
}
