import React, {PureComponent, Component} from 'react';
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
  Tabs,

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
const CheckGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;

@connect(state => ({
  orderReturn: state.stock_orderReturn,
  loading: state.loading,
  myShop: state.global.myShop,
}))//注入state
@Form.create()
@rs.component.injectRole('stock_orderReturn')//注入权限验证
@rs.component.injectModel('stock_orderReturn')//注入model
@rs.component.injectPagination({model: 'stock_orderReturn'})//注入分页器
@rs.component.injectOption('loadMyShop')//注入选项值
export default class StockProductSku extends PureComponent {
  state = {
    columns: [
      {
        title: '商品信息',
        children: [
          {
            title: '图片',
            dataIndex: 'pro-img',
            className: 'align-center',
            key: 'pro-img',
            render: (text, record) => {
              return (<ProductInfo proId={record.proId}/>);
            },
          },
          {
            title: 'ID',
            dataIndex: 'proId',
            className: 'align-center',
            key: 'proId',
          },
          {
            title: 'SKU',
            dataIndex: 'skuCode',
            key: 'skuCode',
          },
        ]
      },
      {
        title: '来源订单',
        dataIndex: 'orderNo',
        key: 'orderNo',
      },
      {
        title: '来源店铺',
        dataIndex: 'shopName',
        key: 'shopName',
      },
      {
        title: '是否入库',
        dataIndex: 'instockStatus',
        key: 'instockStatus',
        render: (text) => {
          let type = '';
          switch (text) {
            case 0:
              type = "否";
              break;
            case 1:
              type = "是";
              break;
          }
          return type;
        },
      },
      {
        title: '退货数量',
        dataIndex: 'proNum',
        key: 'proNum',
      },
      {
        title: '剩余过期时间',
        dataIndex: 'time',
        key: 'time',
        render: (text, record) => {
          if (record.isCancel) {
            return "已过期";
          } else {
            let days = record.type === 0 ? 30 : 180
            if (record.status === 0) {
              const dateTime = new Date(parseInt(record.createDate.substring(6
                , record.createDate.length - 2)));
              const  currentDate = new Date();
              const  dif = (currentDate.getTime() - dateTime.getTime()) / (24 * 60 * 60 * 1000);
              if (dif < 20) {
                return "大于10天";
              }
              return (<
                CountDown
                format={time => {
                  const hours = 60 * 60 * 1000;
                  const day = 24 * 60 * 60 * 1000;
                  const minutes = 60 * 1000;
                  const d = fixedZero(Math.floor(time / day));
                  const h = fixedZero(Math.floor(time / hours));
                  const m = fixedZero(Math.floor((time - (h * hours)) / minutes));
                  const s = fixedZero(Math.floor((time - (h * hours) - (m * minutes)) / 1000));
                  return (
                    <span>{d}天 {h % 24}时 {m}分 {s}秒</span>
                  );
                }}
                target={dateTime.getTime() + (days * 60 * 60 * 24 * 1000)}
              />);
            }
          }
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          const props = {};
          if (record.isCancel) {
            props.text = "已过期";
            props.status = 'warning';
          } else {
            switch (text) {
              case 0:
                props.text = "进行中";
                props.status = 'processing';
                break;
              case 1:
                props.text = "已完成";
                props.status = 'success';
                break;
              case 2:
                props.text = "已作废";
                props.status = 'error';
                break;
            }
          }
          return <Badge text={props.text} status={props.status}/>;
        },
      },
      {
        title: '申请人员',
        dataIndex: 'createUser',
        key: 'createUser',
      },
      {
        title: '申请时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text, record) => {
          return rs.util.date.toString(text);
        },
      },
      {
        title: '操作备注',
        dataIndex: 'opRemark',
        key: 'opRemark',
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
        width: 220,
        render: (text, record) => {
          if (record.isCancel || record.status === 2) {
            return null;
          }
          if (record.status === 1 && record.instockStatus === 0) {
            return <a onClick={() => this.openPurchaseModal(record)}>修正结算成本</a>;
          }
          if (record.status === 1 && record.instockStatus === 1) {
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
              <a onClick={() => this.openInstockModal(record)}>收货入库</a>
              {record.type === 0 ? [
                <span className="ant-divider"/>,
                <a onClick={() => this.openPurchaseModal(record)}>结算成本</a>] : null
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
  handleSearch = (page) => {
    const {orderReturn: {pageIndex, pageSize}, model, form, myShop} = this.props;
    model.setState({
      data: {
        list: [],
        total: 0,
      },
      pageIndex: page === undefined ? pageIndex : page,
    }).then(() => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const proId = fieldsValue.proId === undefined ? null : fieldsValue.proId;
        const shopId = rs.util.string.isNullOrEmpty(fieldsValue.shopName) ?
          null : myShop.filter(x => x.shopName === fieldsValue.shopName)[0].shopId;
        const isOk = false;
        model.dispatch({
          type: 'load',
          payload: {
            isOk,
            orderNo: fieldsValue.orderNo,
            orderId: fieldsValue.orderId,
            skuCode: fieldsValue.skuCode,
            type: rs.util.url.query('type') === null ? 0 : rs.util.url.query('type'),
            shopId,
            proId,
            pageIndex: page === undefined ? pageIndex : page,
            pageSize,
          },
        });
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
    const {model} = this.props;
    this.setState({
      purchaseVisible: true,
      record,
    });
    model.dispatch({
      type: 'loadOrderCancelCost',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        orderBid: record.order_bid,
      },
    })
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

  getHj = (value) => {
    const {model} = this.props;
    model.dispatch({
        type: 'getHj',
        payload: {
          warId: value,
        },
      },
    );
  }

  receive = () => {
    const {model, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      rs.util.loadingService.startSubmit();
      model.dispatch({
        type: 'receive',
        payload: {
          id: this.state.record.id,
          warId: fieldsValue.warId,
          hjNo: fieldsValue.hjNo,
          skuCode: fieldsValue.skuCode,
          proNum: fieldsValue.proNum,
        },
      }).then((res) => {
        this.closeModal();
        rs.util.loadingService.done();
        if (res) {
          this.reset();
        }
      });
    });
  }

  addRemark = () => {
    const {model, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      model.dispatch({
        type: 'addRemark',
        payload: {
          id: this.state.record.id,
          remark: fieldsValue.remark,
        },
      }).then((res) => {
        this.closeModal();
        if (res) {
          this.handleSearch();
        }
      });
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
          remark: fieldsValue.remark,
        },
      }).then((res) => {
        this.closeModal();
        if (res) {
          this.reset();
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
        this.reset();
      }
    });
  }

  changeReturnType = (type) => {
    const {model} = this.props;
    model.setState({
      data: {
        list: [],
        total: 0,
      },
    }).then(() => {
      model.dispatch({
        type: 'changeReturnType',
        payload: {
          type,
        }
      });
    });
  }

  reset = () => {
    const {form} = this.props;
    form.resetFields();
    this.handleSearch(1);
  }


  renderForm() {
    const {myShop} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline">
        <FormItem label="订单ID">
          {getFieldDecorator('orderId')(
            <Input placeholder="请输入订单ID"/>
          )}
        </FormItem>
        <FormItem label="商品ID">
          {getFieldDecorator('proId')(
            <Input placeholder="请输入商品ID"/>
          )}
        </FormItem>
        <FormItem label="SKU编号">
          {getFieldDecorator('skuCode')(
            <Input style={{width: 240}} placeholder="请输入sku编号"/>
          )}
        </FormItem>
        {/*<FormItem label="订单编号(BID)">*/}
        {/*{getFieldDecorator('orderNo')(*/}
        {/*<Input placeholder="请输入订单编号"/>*/}
        {/*)}*/}
        {/*</FormItem>*/}
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
        {/*<FormItem >*/}
        {/*{getFieldDecorator('isOk', {*/}
        {/*initialValue: true,*/}
        {/*})(*/}
        {/*<Checkbox >已处理申请</Checkbox>*/}
        {/*)}*/}
        {/*</FormItem>*/}
        <FormItem>
          <Button
            type="primary"
            icon="search"
            onClick={() => this.handleSearch(1)}
          >查询
          </Button>
        </FormItem>
        <FormItem>
          <Button
            icon="reload"
            onClick={() => this.reset()}
          >重置
          </Button>
        </FormItem>
      </Form>
    );
  }

  renderTable() {
    const {
      orderReturn: {data: {list, total}, pageIndex, pageSize}, loading, model, pagination,
    } = this.props;
    // const expandedRowRender = (record) => {
    //   return 1;
    // }
    const {columns} = this.state;
    return (
      <Table
        rowkey="id"
        columns={columns}
        size="middle"
        loading={loading.effects[`${model.name}/load`]}
        dataSource={list}
        pagination={pagination({pageIndex, pageSize, total}, this.handleSearch)}
      />
    )
  }

  renderPurchaseModalForm() {
    const {model, form: {getFieldDecorator}} = this.props;
    const {orderReturn: {orderCancelCost}} = this.props;
    return (
      <Form layout="horizontal">
        <FormItem label="供应商退款">
          {getFieldDecorator('merchantRefund', {
            initialValue: orderCancelCost.length > 0 ? orderCancelCost[0].merchant_refund : 0,
            rules: [{
              required: true, message: '请输入数字类型',
            }],
          })(
            <Input style={{width: 200}} placeholder="请输入供应商退款金额"/>
          )}
        </FormItem>
        <FormItem label="自费物流费用">
          {getFieldDecorator('logisticsCost', {
            initialValue: orderCancelCost.length > 0 ? orderCancelCost[0].logistics_cost : 0,
            rules: [{
              required: true, message: '请输入数字类型',
            }],
          })(
            <Input style={{width: 200}} placeholder="请输入自费物流费用"/>
          )}
        </FormItem>
        <FormItem label="备注">
          {getFieldDecorator('remark', {
            initialValue: this.state.record.opRemark,
          })(
            <Input.TextArea autosize={{minRows: 4}}/>
          )}
        </FormItem>
      </Form>
    );
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
              showSearch
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
    const {loading, model, orderReturn: {returnType}} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <Tabs activeKey={rs.util.url.query('type', "0")}
                style={{marginBottom: 8}}
                onChange={type => this.changeReturnType(type)}>
            <TabPane tab="国内退货（取消）" key="0"/>
            <TabPane tab="国外退货（退款）" key="1"/>
          </Tabs>
          <div className="tool-bar">
            {this.renderForm()}
          </div>
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
        {this.state.purchaseVisible ? <Modal
          title="结算成本"
          width={500}
          visible={this.state.purchaseVisible}
          onCancel={() => this.closeModal()}
          onOk={() => this.changeCost()}
        >
          {this.renderPurchaseModalForm()}
        </Modal> : null}
        {this.state.remarkVisible ? <Modal
          title="备注"
          width={500}
          visible={this.state.remarkVisible}
          onCancel={() => this.closeModal()}
          onOk={() => this.addRemark()}
        >
          <Form layout="horizontal">
            <FormItem label="操作备注" labelCol={{span: 4}} wrapperCol={{span: 20}}>
              {getFieldDecorator('remark', {
                initialValue: this.state.record.opRemark,
              })(
                <Input.TextArea autosize={{minRows: 4}}/>
              )}
            </FormItem>
          </Form>
        </Modal> : null}
      </PageHeaderLayout>
    );
  }
}

