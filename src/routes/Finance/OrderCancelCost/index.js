import React, {PureComponent, Component} from 'react';
import lodash from 'lodash';
import {connect} from 'dva';
import {
  Card,
  Form,
  Button,
  Table,
  Input,
  Modal,
  Select,
  Tag,
  Badge,
  Alert,
  Checkbox,
  Dropdown,
  Menu,
  Icon,
  InputNumber,
  Radio,
  Popconfirm,
} from 'antd';
import CountDown from 'ant-design-pro/lib/CountDown';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ProductInfo from '../../../myComponents/ProductInfo/';
import rs from '../../../rs/';


function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const modelNameSpace = 'finance_orderCancelCost';

@connect(state => ({
  [modelNameSpace]: state[modelNameSpace],
  loading: state.loading,
  myShop: state.global.myShop,
}))//注入state
@Form.create()
@rs.component.injectRole(modelNameSpace)//注入权限验证
@rs.component.injectModel(modelNameSpace)//注入model
@rs.component.injectPagination({model: modelNameSpace})//注入分页器
export default class StockProductSku extends PureComponent {
  state = {
    columns: [
      {
        title: '流水号',
        dataIndex: 'serial_no',
        key: 'serial_no',
      },
      {
        title: '关联订单',
        dataIndex: 'order_bid',
        key: 'order_bid',
      },
      {
        title: '商品ID',
        dataIndex: 'pro_id',
        key: 'pro_id',
      },
      {
        title: '商品SKU',
        dataIndex: 'sku_code',
        key: 'sku_code',
      },
      {
        title: '退货数量',
        dataIndex: 'num',
        key: 'num',
      },
      {
        title: '金额',
        children: [
          {
            title: '商品总成本',
            dataIndex: 'order_cost',
            key: 'order_cost',
          },
          {
            title: '供应商退款',
            dataIndex: 'merchant_refund',
            key: 'merchant_refund',
          },
          {
            title: '自费物流费用',
            dataIndex: 'logistics_cost',
            key: 'logistics_cost',
          },
          {
            title: '结算成本',
            dataIndex: 'cost',
            key: 'cost',
            render: (text, record) => {
              const cost = record.order_cost - record.merchant_refund + record.logistics_cost;
              return lodash.round(cost, 2);
            },
          },
        ],

      },
      {
        title: '操作时间',
        dataIndex: 'create_date',
        key: 'create_date',
        render: (text, record) => {
          return rs.util.date.toString(text);
        },
      },
      {
        title: '操作人员',
        dataIndex: 'create_user_name',
        key: 'create_user_name',
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
        width: 150,
        render: (text, record) => {
          if (record.isCancel || record.status !== 0) {
            return null;
          }
          const menu = (
            <Menu>
              <Menu.Item>
                <a onClick={() => this.openRemarkModel(record)}>备注</a>
              </Menu.Item>
              <Menu.Item>
                <Popconfirm
                  placement="left"
                  title={'确定要作废吗，操作后将无法撤回。'}
                  onConfirm={() => this.cancel(record.id)}>
                  <a>作废</a>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          );

          const MoreBtn = () => (
            <Dropdown overlay={menu}>
              <a>
                更多 <Icon type="down"/>
              </a>
            </Dropdown>
          );
          return (
            <div>
              {record.instockStatus === 1 ?
                <a onClick={() => this.openInstockModal(record)}>收货入库</a> :
                <a onClick={() => this.openPurchaseModal(record)}>结算成本</a>
              }
              <span className="ant-divider"/>
              <MoreBtn/>
            </div>
          );
        },
      },
    ],
    visible: false,
    purchaseVisible: false,
    remarkVisible: false,
    record: {},
    skuCodeDisabled: true,
  };

  /**
   * 全局的加载方法
   */
  handleSearch = () => {
    const {orderReturn: {pageIndex, pageSize}, model, form, myShop} = this.props;
    model.setState({
      data: {
        list: [],
        total: 0,
      },
    }).then(() => {
      model.dispatch({
        type: 'load',
        payload: {
          pageIndex,
          pageSize,
        },
      });
    });
  }

  /**
   * 打开Modal
   * @param record
   */
  openInstockModal = (record) => {
    const {model: {dispatch}} = this.props;
    this.setState({
      visible: true,
      skuCodeDisabled: true,
      record,
    });
    dispatch({
      type: 'getWar',
      payload: {
        isCancel: true,
      },
    });
  }

  openPurchaseModal = (record) => {
    this.setState({
      purchaseVisible: true,
      record,
    });
  }
  openRemarkModel = (record) => {
    this.setState({
      remarkVisible: true,
      record,
    });
  }

  changeSkuCode = () => {
    this.setState({
      skuCodeDisabled: false,
    })
  }

  closeModal = () => {
    this.setState({
      visible: false,
      purchaseVisible: false,
      remarkVisible: false,
    });
  }

  changeCost = () => {
    const {model, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      model.dispatch({
        type: 'changeCost',
        payload: {
          id: this.state.record.id,
          merchantRefund: fieldsValue.merchantRefund,
          logisticsCost: fieldsValue.logisticsCost,
        },
      }).then((res) => {
        this.closeModal();
        if (res) {
          this.handleSearch();
        }
      });
    });
  }

  cancel = (id) => {
    const {model} = this.props;
    model.dispatch({
      type: 'cancel',
      payload: {
        id,
      },
    }).then((res) => {
      if (res) {
        this.handleSearch()
      }
    });
  }

  renderForm() {
    const {myShop} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline">
        <FormItem label="商品ID">
          {getFieldDecorator('proId')(
            <Input placeholder="请输入商品ID"/>
          )}
        </FormItem>
        <FormItem label="订单编号">
          {getFieldDecorator('orderNo')(
            <Input placeholder="请输入订单编号"/>
          )}
        </FormItem>
        <FormItem label="选择店铺">
          {getFieldDecorator('shopName', {})(
            <Select
              allowClear
              showSearch
              style={{width: 200}}
              placeholder="请选择店铺"
            >
              {myShop.map(shop =>
                (
                  <Option key={shop.shopId} value={shop.shopName} title={shop.shopName}>
                    {shop.shopName}
                  </Option>))
              }
            </Select>
          )}
        </FormItem>
        <FormItem >
          {getFieldDecorator('isOk')(
            <Checkbox >已处理申请</Checkbox>
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            icon="search"
            onClick={() => this.handleSearch()}
          >查询
          </Button>
        </FormItem>
      </Form>
    );
  }

  renderTable() {
    const {
      [modelNameSpace]: {data: {list, total}, pageIndex, pageSize}, loading, model, pagination,
    } = this.props;
    // const expandedRowRender = (record) => {
    //   return 1;
    // }
    const {columns} = this.state;
    return (
      <Table
        rowkey="serial_no"
        columns={columns}
        size="middle"
        loading={loading.effects[`${model.name}/load`]}
        dataSource={list}
        pagination={pagination({pageIndex, pageSize, total}, this.handleSearch)}
      />
    )
  }


  renderModalForm() {
    const {getFieldDecorator} = this.props.form;
    const {orderReturn: {warList, hjList}} = this.props;
    return (
      <Form layout="horizontal">
        <FormItem label="商品SKU" labelCol={{span: 4}} wrapperCol={{span: 14}}>
          {getFieldDecorator('skuCode', {
            initialValue: this.state.record.skuCode,
            rules: [{
              required: true, message: '请填写SKU',
            }],
          })(
            <Input disabled={this.state.skuCodeDisabled} style={{width: 200}}/>
          )}
          <a style={{marginLeft: 10}} onClick={() => this.changeSkuCode()}>更改</a>
        </FormItem>
        <FormItem label="选择仓库" labelCol={{span: 4}} wrapperCol={{span: 14}}>
          {getFieldDecorator('warId', {
            rules: [{
              required: true, message: '请选择仓库！',
            }],
          })(
            <Select
              placeholder="请选择仓库"
              onChange={value => this.getHj(value)}
            >
              {warList.map(x => (
                <Option key={x.warId} value={x.warId}>{x.warName}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="选择货架" labelCol={{span: 4}} wrapperCol={{span: 14}}>
          {getFieldDecorator('hjNo', {
            rules: [{
              required: true, message: '请选择货架！',
            }],
          })(
            <Select
              placeholder="请选择货架"
            >
              {hjList.map(x => (
                <Option key={x.hj_no} value={x.hj_no}>{x.hj_no}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="退货数量" labelCol={{span: 4}} wrapperCol={{span: 14}}>
          {getFieldDecorator('proNum', {
            initialValue: this.state.record.proNum,
            rules: [{
              required: true, message: '请填写退货数量',
            }],
          })(
            <InputNumber min={1} max={this.state.record.proNum}/>
          )}
        </FormItem>
      </Form>
    );
  }

  render() {
    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          {/*<div className="tool-bar">*/}
          {/*{this.renderForm()}*/}
          {/*</div>*/}
          {this.renderTable()}
        </Card>
        {this.state.visible ? <Modal
          title="确认收货"
          width={500}
          visible={this.state.visible}
          onCancel={() => this.closeModal()}
          onOk={() => this.receive()}
        >
          {this.renderModalForm()}
        </Modal> : null}
      </PageHeaderLayout>
    );
  }
}

