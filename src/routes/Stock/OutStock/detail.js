import React, {Component} from 'react';
import Debounce from 'lodash-decorators/debounce';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, Icon, Row, Col, Steps, Card, Modal, Badge, Table, Spin} from 'antd';
import classNames from 'classnames';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import styles from '../../../theme/common.less';

import rs from '../../../rs/';
import ProductInfo from '../../../myComponents/ProductInfo/';

const {Step} = Steps;
const {Description} = DescriptionList;
const ButtonGroup = Button.Group;

const getWindowWidth = () => (window.innerWidth || document.documentElement.clientWidth);

const tabList = [
  {
    key: 'detail',
    tab: '详情',
  },
  {
    key: 'other',
    tab: '来源信息',
  }];

const columns = [
  {
    title: '操作类型',
    dataIndex: 'op_type',
    key: 'op_type',
  },
  {
    title: '操作人',
    dataIndex: 'op_user_name',
    key: 'op_user_name',
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
    dataIndex: 'op_date',
    key: 'op_date',
    render: (text) => {
      return rs.util.date.toString(text);
    },
  },
  {
    title: '内容',
    dataIndex: 'op_content',
    key: 'op_content',
  }];

@connect(state => ({
  outStock: state.stock_outStock,
  loading: state.loading,
}))
export default class OutStockApplyDetail extends Component {
  state = {
    operationType: 'detail',
    stepDirection: 'horizontal',
    skuColumns: [
      {
        title: '图片',
        dataIndex: 'pro-img',
        key: 'pro-img',
        render: (text, record) => {
          return (<ProductInfo proId={record.proId}/>);
        },
      },
      {
        title: '商品编号',
        dataIndex: 'proId',
        key: 'proId',
      },
      {
        title: '商品SKU',
        dataIndex: 'skuCode',
        key: 'skuCode',
      },
      {
        title: '仓库',
        dataIndex: 'warName',
        key: 'warName',
        render: (text) => {
          return <span><Icon type="home"/>{text}</span>;
        },
      },
      {
        title: '货架',
        dataIndex: 'hjNo',
        key: 'hjNo',
      },
      {
        title: '数量',
        dataIndex: 'proNum',
        key: 'proNum',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          const props = {};
          switch (text) {
            case 0:
              props.text = '待捡货';
              props.status = 'processing';
              break;
            case 1:
              props.text = '捡货完成';
              props.status = 'exception';
              break;
            case 2:
              props.text = '已出库';
              props.status = 'success';
              break;
          }
          return <Badge status={props.status} text={props.text}/>;
        },
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
        render: (text, record) => {
          if (record.status === 0) {
            return (<a onClick={() => this.confirmPicking('one', record)}>确认捡货</a>);
          }
        },
      },
    ],
    updateList: [],
  }

  componentDidMount() {
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
  }

  getStatus = (status) => {
    let text = '';
    switch (status) {
      case 0:
        text = '新的申请';
        break;
      case 3:
        text = '正在拣货';
        break;
      case 4:
        text = '拣货完成';
        break;
      case 98:
        text = '出库完成';
        break;
    }
    return text;
  }
  getType = (type) => {
    let text = '';
    switch (type) {
      case 0:
        text = '大货装箱';
        break;
      case 1:
        text = '订单发货';
        break;
    }
    return text;
  }

  changeType = (key) => {
    this.setState({
      operationType: key,
    });
  }

  @Debounce(200)
  setStepDirection = () => {
    const {stepDirection} = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  changeStep = () => {
    let current = 1;
    const {outStock: {detail: {applyInfo}}} = this.props;
    switch (applyInfo.apply_status) {
      case 0:
        current = 2;
        break;
      case 3:
        current = 3;
        break;
      case 4:
        current = 3;
        break;
      case 98:
        current = 4;
        break;
    }
    return current;
  }

  createDesc = (type) => {
    const {outStock: {detail: {processList}}} = this.props;
    const record = processList.filter(x => x.op_type === type);
    if (record.length === 0) {
      return null;
    }
    return (
      <div className={classNames(styles.textSecondary, styles.stepDescription)} style={{left: 0}}>
        <div>
          {record[0].op_user_name}
          <Icon type="dingding-o" style={{marginLeft: 8}}/>
        </div>
        <div>{rs.util.date.toString(record[0].op_date)}</div>
      </div>
    );
  }

  confirmPicking = (type, row) => {
    const {dispatch, outStock: {detail: {serialNo}, updateList}} = this.props;
    Modal.confirm({
      title: '确认捡货',
      content: '确定要确认捡货吗,确定后无法撤销',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const arr = [];
        if (type === 'one') {
          arr.push({
            pro_id: row.proId,
            sku_code: row.skuCode,
            warId: row.warId,
            hjNo: row.hjNo,
          });
        } else {
          updateList.map(x => {
            arr.push({
              pro_id: x.proId,
              sku_code: x.skuCode,
              warId: x.warId,
              hjNo: x.hjNo,
            });
          });
        }
        if (arr.length > 0) {
          rs.util.loadingService.startSubmit();
          dispatch({
            type: 'stock_outStock/confirmPicking',
            payload: {
              applySerial: serialNo,
              updateList: arr,
            },
          });
        }
      },
    });
  }

  confirmOutStock = () => {
    Modal.confirm({
      title: '确认出库',
      content: '确定要确认出库吗,确定后无法撤销',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const {dispatch, outStock: {detail: {serialNo, applyInfo}}} = this.props;
        rs.util.loadingService.startSubmit();
        dispatch({
          type: 'stock_outStock/confirmOutStock',
          payload: {
            applySerial: serialNo,
            applyType: applyInfo.apply_type,
          },
        });
      },
    });
  }

  renderOrderInfo = () => {
    const {outStock: {detail: {applyInfo, orderInfo}}} = this.props;
    return (
      <DescriptionList style={{marginBottom: 24}}>
        <Description term="订单编号">{orderInfo.orderNo}</Description>
        <Description term="所属交易">{applyInfo.from_no}</Description>
        <Description term="所属店铺">{orderInfo.shopName}</Description>
        <Description term="商品图片"><ProductInfo proId={orderInfo.proId}/></Description>
        <Description term="商品编号">{orderInfo.proId}</Description>
        <Description term="商品SKU">{orderInfo.skuCode}</Description>
      </DescriptionList>
    );
  }

  renderBoxInfo = () => {
    const {outStock: {detail: {boxInfo}}} = this.props;
    return (
      <DescriptionList style={{marginBottom: 24}}>
        <Description term="箱子编号">{boxInfo.boxId}</Description>
        <Description term="箱子名称">{boxInfo.boxNo}</Description>
        <Description term="计划编号">{boxInfo.planId}</Description>
        <Description term="计划名称">{boxInfo.boxNo}</Description>
        <Description term="发货备注">{boxInfo.deliveryContent}</Description>
      </DescriptionList>
    );
  }

  render() {
    const {stepDirection} = this.state;
    const {
      outStock: {
        detail: {applyInfo, processList, skuList},
        updateList,
      }, loading, dispatch,
    } = this.props;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'stock_outStock/setState',
          payload: {
            updateList: selectedRows,
          },
        });
      },
    };
    const action = (
      <div>
        <ButtonGroup>
          <Link to={'/stock/outStock'}><Button>返回列表</Button></Link>
        </ButtonGroup>
        {applyInfo.apply_status !== 98 ?
          <Button type="primary" onClick={() => this.confirmOutStock()}>确认出库</Button> : null}
      </div>
    );
    const extra = (
      <Row>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{this.getStatus(applyInfo.apply_status)}</div>
        </Col>
      </Row>
    );
    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="申请人">{applyInfo.apply_user_name}</Description>
        <Description term="来源类型">{this.getType(applyInfo.apply_type)}</Description>
        <Description term="申请时间">{rs.util.date.toString(applyInfo.apply_date)}</Description>
        <Description term={applyInfo.apply_type === 0 ? '来源箱子' : '来源订单'}>
          {applyInfo.apply_type === 0 ?
            <a
              href={`${rs.config.getConfig('api')}/logistics/bulk_delivery#/logistics/bulk_delivery/box?planId=${applyInfo.from_no}`}>{applyInfo.from_item_no}</a>
            : <a >{applyInfo.from_item_no}</a>}
        </Description>
        <Description term="备注">
          {rs.util.string.isNullOrEmpty(applyInfo.remark) ? '暂无备注信息' : applyInfo.remark}
        </Description>
      </DescriptionList>
    );
    return (
      <PageHeaderLayout
        title={`流水号：${applyInfo.apply_serial}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"/>}
        action={action}
        content={description}
        extraContent={extra}
        tabList={tabList}
        onTabChange={key => this.changeType(key)}
      >
        <Spin
          tip="正在从服务器加载数据...."
          spinning={loading.effects['stock_outStock/loadDetail']}
        >
          {this.state.operationType === 'detail' ?
            (
              <div>
                <Card title="流程进度" style={{marginBottom: 24}} bordered={false}>
                  <Steps direction={stepDirection} current={this.changeStep()}>
                    <Step title="新的申请" description={this.createDesc('新的申请')}/>
                    <Step title="部门审核" description={this.createDesc('新的申请')}/>
                    <Step title="后勤备货" description={this.createDesc('捡货完成')}/>
                    <Step title="出库完成" description={this.createDesc('出库成功')}/>
                  </Steps>
                </Card>
                {applyInfo.apply_status === 98 ?
                  <Card
                    title="SKU列表"
                    bordered={false}
                    style={{marginBottom: 24}}
                    extra={updateList.length > 0 ?
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => this.confirmPicking('more')}
                      >批量捡货
                      </Button> : null}
                  >
                    <Table
                      rowSelection={skuList.some(x => x.status === 0) ? rowSelection : null}
                      pagination={false}
                      dataSource={skuList}
                      selectedRowKeys={this.state.updateList}
                      columns={this.state.skuColumns}
                    />
                  </Card> : null}
                <Card bordered={false} title="操作日志">
                  <Table pagination={false} dataSource={processList} columns={columns}/>
                </Card>
              </div>
            ) :
            (
              <Card title={applyInfo.apply_type === 0 ? '箱子信息' : '订单信息'} style={{marginBottom: 24}} bordered={false}>
                {applyInfo.apply_type === 0 ? this.renderBoxInfo() : this.renderOrderInfo()}
              </Card>
            )}
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

