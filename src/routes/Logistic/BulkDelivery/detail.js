import React, {PureComponent} from 'react';
import Debounce from 'lodash-decorators/debounce';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {List, Button, Icon, Row, Col, Steps, Card, Modal, Badge, Table, Spin, Alert, Avatar} from 'antd';
import classNames from 'classnames';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import styles from '../../../theme/common.less';

import rs from '../../../rs/';
import ProductInfo from '../../../myComponents/ProductInfo/';

const {Description} = DescriptionList;
const ButtonGroup = Button.Group;
const {Column, ColumnGroup} = Table;
const {Step} = Steps;

const tabList = [
  {
    key: 'detail',
    tab: '详细信息',
  },
  {
    key: 'sku',
    tab: 'SKU列表',
  },
  {
    key: 'box',
    tab: '箱子',
  },
  {
    key: 'op',
    tab: '操作日志',
  }];

@connect(state => ({
  bulkDelivery: state.logistic_bulkDelivery,
  loading: state.loading,
}))
@rs.component.injectModel('logistic_bulkDelivery')
export default class BulkDeliveryApplyDetail extends PureComponent {
  state = {
    operationType: 'detail',
    columns: [
      {
        title: '操作类型',
        dataIndex: 'status_after',
        key: 'status_after',
        render: (text) => {
          return this.getStatus(text).text;
        },
      },
      {
        title: '操作人',
        dataIndex: 'handle_userName',
        key: 'handle_userName',
      },
      {
        title: '执行结果',
        dataIndex: 'status',
        key: 'status',
        render: () => (
          <Badge status="success" text="成功"/>
        ),
      },
      {
        title: '操作时间',
        dataIndex: 'handle_date',
        key: 'handle_date',
        render: (text) => {
          return rs.util.date.toString(text);
        },
      },
      {
        title: '内容',
        dataIndex: 'handle_content',
        key: 'handle_content',
      }],
  }

  componentDidMount() {

  }

  getStatus = (status) => {
    const props = {};
    switch (status) {
      case 'new':
        props.text = '新的计划';
        props.status = '';
        break;
      case 'wait_outstock':
        props.text = '等待出库';
        props.status = '';
        break;
      case 'packing':
        props.text = '正在打包';
        props.status = 'processing';
        break;
      case 'send_logistics':
        props.text = '已经交运';
        props.status = 'warning';
        break;
      case 'deriving':
        props.text = '正在发货';
        props.status = 'warning';
        break;
      case 'delivery':
        props.text = '已经发货';
        props.status = 'error';
        break;
      case 'instock':
        props.text = '已经入库';
        props.status = 'success';
        break;
    }
    return props;
  }

  changeType = (key) => {
    this.setState({
      operationType: key,
    });
  }

  changeStep = () => {
    let current = 1;
    const {bulkDelivery: {deliveryPlanDataDetail: {entity}}} = this.props;
    switch (entity.status) {
      case 'wait_outstock':
        current = 2;
        break;
      case 'packing':
        current = 3;
        break;
      case 'send_logistic':
        current = 4;
        break;
      case 'delivery':
        current = 5;
        break;
      case 'instock':
        current = 6;
        break;
    }
    return current;
  }

  refresh = () => {
    const {location: {pathname}, model} = this.props;
    const match = rs.util.url.match('/logistics/bulkDelivery/detail/:no', pathname);
    if (match) {
      model.dispatch({
        type: 'loadDeliveryPlanDetail',
        payload: {
          serialNo: match[1],
        },
      });
    }
  }

  createDesc = (type) => {
    const {bulkDelivery: {deliveryPlanDataDetail: {processList}}} = this.props;
    const record = processList.filter(x => x.status_after === type);
    if (record.length === 0) {
      return null;
    }
    return (
      <div className={classNames(styles.textSecondary, styles.stepDescription)} style={{left: 0}}>
        <div>
          {record[0].handle_userName}
          <Icon type="dingding-o" style={{marginLeft: 8}}/>
        </div>
        <div>{rs.util.date.toString(record[0].handle_date)}</div>
      </div>
    );
  }

  renderPlanInfo() {
    const {bulkDelivery: {deliveryPlanDataDetail: {entity}}} = this.props;
    return (
      <div>
        <DescriptionList style={{marginBottom: 24}}>
          <Description term="计划ID">{entity.planId}</Description>
          <Description term="计划编号">{entity.planNo}</Description>
          <Description term="货件编号">{entity.goodsNo}</Description>
          <Description term="货件名称">{entity.goodsName}</Description>
          <Description term="商品总数">{entity.proCount}</Description>
          <Description term="SKU总数">{entity.skuCount}</Description>
          <Description term="所有箱子重量">{`${entity.actualWeight} 克`}</Description>
        </DescriptionList>
        <DescriptionList style={{marginBottom: 24}} title="发货信息">
          <Description term="收货国家">{entity.country}</Description>
          <Description term="最晚到货期">{rs.util.date.toString(entity.lastDate, 'yyyy-MM-dd')}</Description>
          <Description term="发往仓库">{entity.warName}</Description>
          <Description term="收货地址" style={{width: '100%'}}>{entity.address}</Description>
        </DescriptionList>
      </div>
    );
  }

  renderSkuList() {
    const {
      bulkDelivery: {deliveryPlanDataDetail: {skuList}},
    } = this.props;
    return (
      <Table
        pagination={false}
        size="middle"
        dataSource={skuList}
      >
        <Column
          title="图片"
          dataIndex="pro-img"
          key="pro-img"
          render={(text, record) => {
            return (<ProductInfo proId={record.pro_id}/>);
          }}
        />
        <Column title="商品ID" dataIndex="box_id" key="box_id"/>
        <Column title="商品SKU" dataIndex="sku_code" key="sku_code"/>
        <Column title="ASIN" dataIndex="ASIN" key="ASIN"/>
        <Column title="FNSKU" dataIndex="FNSKU" key="FNSKU"/>
        <Column title="外部编码" dataIndex="wbCode" key="wbCode"/>
        <ColumnGroup title="数量">
          <Column title="总计划" dataIndex="allCount" key="allCount"/>
          <Column title="实际出库" dataIndex="boxCount" key="allCount"/>
          <Column title="已装箱" dataIndex="boxCount" key="allCount"/>
        </ColumnGroup>
      </Table>
    );
  }

  renderBox() {
    const {
      bulkDelivery: {deliveryPlanDataDetail: {boxList}},
    } = this.props;
    return (
      <Table
        pagination={false}
        size="middle"
        dataSource={boxList}
      >
        {/*<Column*/}
        {/*title=""*/}
        {/*dataIndex="pro-img"*/}
        {/*key="pro-img"*/}
        {/*render={(text, record) => {*/}
        {/*return (<Avatar  shape="square" size="large" src={rs.config.serialLogo}/>);*/}
        {/*}}*/}
        {/*/>*/}
        <Column title="箱子ID" dataIndex="box_id" key="box_id"/>
        <Column title="箱子编号" dataIndex="box_name" key="box_name"/>
        <Column title="箱子体积" dataIndex="box_tj" key="box_tj"/>
        <Column
          title="箱子重量（克）"
          render={(text, record) => {
            return (
              <div>
                <p>计算：{record.trade_plan_weight}</p>
                <p>实际：{record.trade_actual_weight}</p>
              </div>
            );
          }}
        />
        <Column
          title="箱子金额（元）"
          render={(text, record) => {
            return (
              <div>
                <p>计算：¥{record.actual_plan_amount}</p>
                <p>实际：¥{record.actual_logistics_amount}</p>
              </div>
            );
          }}
        />
        <Column title="商品总数" dataIndex="pro_num" key="pro_num"/>
        <Column title="SKU总数" dataIndex="sku_num" key="sku_num"/>
        <Column title="打包人员" dataIndex="apply_userName" key="apply_userName"/>
        <Column
          title="状态"
          dataIndex="box_status"
          key="box_status"
          render={(text) => {
            return (<Badge text={this.getStatus(text).text} status={this.getStatus(text).status}/>);
          }}
        />
      </Table>
    );
  }


  render() {
    const {
      bulkDelivery: {
        deliveryPlanDataDetail: {entity, processList},
      }, loading, model,
    } = this.props;
    const action = (
      <div>
        <ButtonGroup>
          <Link to={'/logistics/bulkDelivery'}><Button>返回列表</Button></Link>
        </ButtonGroup>
        <Button type="primary" onClick={() => this.refresh()}>刷新</Button>
      </div>
    );
    const extra = (
      <Row>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{this.getStatus(entity.status).text}</div>
        </Col>
      </Row>
    );
    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="申请人">{entity.applyUser}</Description>
        <Description term="申请时间">{rs.util.date.toString(entity.applyDate)}</Description>
        <Description term="来源店铺">{entity.shopName}</Description>
        <Description term="发往仓库">{entity.warName}</Description>
        <Description term="备注">
          {rs.util.string.isNullOrEmpty(entity.remark) ? '暂无备注信息' : entity.remark}
        </Description>
      </DescriptionList>
    );
    return (
      <PageHeaderLayout
        title={`流水号：${entity.serialNo}`}
        logo={<img alt="" src={rs.config.serialLogo}/>}
        action={action}
        content={description}
        extraContent={extra}
        tabList={tabList}
        onTabChange={key => this.changeType(key)}
      >
        <Spin
          tip="正在从服务器加载数据...."
          spinning={loading.effects[`${model.name}/loadDeliveryPlanDetail`]}
        >
          {this.state.operationType === 'detail' ?
            (
              <div>
                <Card title="流程进度" style={{marginBottom: 24}} bordered={false}>
                  <Steps direction="horizontal" current={this.changeStep()}>
                    <Step title="新的申请" description={this.createDesc('new')}/>
                    <Step title="商品出库" description={this.createDesc('wait_outstock')}/>
                    <Step title="商品打包" description={this.createDesc('packing')}/>
                    {/*<Step title="已经交运" description={this.createDesc('send_logistic')}/>*/}
                    <Step title="发往仓库" description={this.createDesc('delivery')}/>
                    <Step title="入库完成" description={this.createDesc('instock')}/>
                  </Steps>
                </Card>
                <Card title="计划详情" style={{marginBottom: 24}} bordered={false}>
                  {this.renderPlanInfo()}
                </Card>
              </div>
            ) : null}
          {this.state.operationType === 'sku' ?
            <Card title="SKU列表" bordered={false} style={{marginBottom: 24}}>
              <Alert type="info" showIcon message="实际可发货数量以出库数量为准" style={{marginBottom: 16}}/>
              {this.renderSkuList()}
            </Card> : null}
          {this.state.operationType === 'box' ?
            <Card title="箱子列表" bordered={false} style={{marginBottom: 24}}>
              {this.renderBox()}
            </Card> : null}
          {this.state.operationType === 'op' ?
            (
              <Card bordered={false} title="操作日志">
                <Table pagination={false} dataSource={processList} columns={this.state.columns}/>
              </Card>
            ) : null}
        </Spin>
        {/*<Modal*/}
        {/*title=""*/}
        {/*visible={visible}*/}
        {/*onOk={this.handleOk}*/}
        {/*confirmLoading={confirmLoading}*/}
        {/*onCancel={this.handleCancel}*/}
        {/*>*/}
        {/*<p>{ModalText}</p>*/}
        {/*</Modal>*/}
      </PageHeaderLayout>
    );
  }
}

