import React, {PureComponent, Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Button, Table, Input, Modal, Select, Tag, Badge, Alert, Checkbox} from 'antd';
import CountDown from 'ant-design-pro/lib/CountDown';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ProductInfo from '../../../myComponents/ProductInfo/';
import rs from '../../../rs/';


function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}
const FormItem = Form.Item;
const Option = Select.Option;

@connect(state => ({
    orderReturn: state.stock_orderReturn,
    loading: state.loading,
    myShop: state.global.myShop,
  })
)
@Form.create()
@rs.component.injectRole('stock_orderReturn')
@rs.component.injectModel('stock_orderReturn')
@rs.component.injectPagination({model: 'stock_orderReturn'})
@rs.component.injectOption('loadMyShop')
export default class StockProductSku extends PureComponent {
  state = {
    columns: [
      {
        title: '商品图片',
        dataIndex: 'pro-img',
        key: 'pro-img',
        render: (text, record) => {
          return (<ProductInfo proId={record.proId}/>);
        },
      },
      // {
      //   title: '流水号',
      //   dataIndex: 'serialNo',
      //   key: 'serialNo',
      // },
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
        title: '退货类型',
        dataIndex: 'type',
        key: 'type',
        render: (text) => {
          let type = '';
          switch (text) {
            case 0:
              type = "订单取消";
              break;
            case 1:
              type = "订单退款";
              break;
          }
          return <Tag>{type}</Tag>;
        },
      },
      {
        title: '退货数量',
        dataIndex: 'proNum',
        key: 'proNum',
      },
      {
        title: '退货时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text) => {
          return rs.util.date.toString(text);
        },
      },
      {
        title: '剩余收货时间',
        dataIndex: 'time',
        key: 'time',
        render: (text, record) => {
          const dateTime = new Date(parseInt(record.createDate.substring(6
            , record.createDate.length - 2)));
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
            target={dateTime.getTime() + (30 * 60 * 60 * 24 * 1000)}
          />);
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          const props = {};
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
          return <Badge text={props.text} status={props.status}/>;
        },
      },
      {
        title: '退货人员',
        dataIndex: 'createUser',
        key: 'createUser',
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
        width: 150,
        render: (text, record) => {
          return (
            <div>
              <a onClick={() => this.openModal(record)}>收货</a>
              <span className="ant-divider"/>
              <a onClick={() => this.openModal(record)}>作废</a>
            </div>
          );
        },
      },
    ],
    visible: false,
    record: {},
  };

  componentDidMount() {
  }


  handleSearch = () => {
    const {orderReturn: {pageIndex, pageSize}, model, form, myShop} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const proId = fieldsValue.proId === undefined ? null : fieldsValue.proId;
      const shopId = rs.util.string.isNullOrEmpty(fieldsValue.shopName) ?
        null : myShop.filter(x => x.shopName === fieldsValue.shopName)[0].shopId;
      const isOk = fieldsValue.isOk === undefined ? false : fieldsValue.isOk;
      model.dispatch({
        type: 'load',
        payload: {
          isOk,
          orderNo: fieldsValue.orderNo,
          shopId,
          proId,
          pageIndex,
          pageSize,
        },
      });
    });
  }


  openModal = (record) => {
    const {model} = this.props;
    model.dispatch({
        type: 'getWar',
        payload: {
          isCancel: true,
        },
      },
    ).then(() => {
      this.setState({
        visible: true,
        record,
      });
    });
  }
  closeModal = () => {
    this.setState({
      visible: false,
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

  changeHj = () => {
    const {model, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      model.dispatch({
        type: 'changeHj',
        payload: {
          skuId: this.state.record.sku_id,
          warId: fieldsValue.warId,
          hjNo: fieldsValue.hjNo,
        },
      }).then(() => {
        this.closeModal();
      });
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

  renderModalForm() {
    const {getFieldDecorator} = this.props.form;
    const {productSku: {warList, hjList}} = this.props;
    return (
      <Form layout="horizontal">
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
      </Form>
    );
  }

  render() {
    const {
      orderReturn: {data: {list, total}, pageIndex, pageSize}, loading, model, pagination,
    } = this.props;
    const {columns} = this.state;
    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <div className="tool-bar">
            {this.renderForm()}
          </div>
          <Alert type="info" showIcon message="剩余收货时间大于15天时不可作废，已处理申请默认不显示" style={{marginBottom: 16}}/>
          <Table
            columns={columns}
            size="middle"
            loading={loading.effects[`${model.name}/load`]}
            dataSource={list}
            pagination={pagination({pageIndex, pageSize, total}, this.handleSearch)}
          />
        </Card>
        {this.state.visible ? <Modal
          title="移至货架"
          width={500}
          visible={this.state.visible}
          confirmLoading={loading.effects[`${model.name}/changeHj`]}
          onCancel={() => this.closeModal()}
          onOk={() => this.changeHj()}
        >
          {this.renderModalForm()}
        </Modal> : null}
      </PageHeaderLayout>
    );
  }
}

