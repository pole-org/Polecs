import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Form, Button, Table, Input, Modal, Select} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ProductInfo from '../../../myComponents/ProductInfo/';
import rs from '../../../rs/';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(state => ({
    orderReturn: state.stock_orderReturn,
    loading: state.loading,
  })
)
@Form.create()
export default class StockOrderReturn extends PureComponent {
  state = {
    columns: [
      {
        title: '商品图片',
        dataIndex: 'pro-img',
        key: 'pro-img',
        render: (text, record) => {
          return (<ProductInfo proId={record.pro_id}/>);
        },
      },
      {
        title: '商品编号',
        dataIndex: 'pro_id',
        key: 'pro_id',
      },
      {
        title: 'SKU编号',
        dataIndex: 'sku_id',
        key: 'sku_id',
      },
      {
        title: '商品SKU',
        dataIndex: 'sku_code',
        key: 'sku_code',
      },
      {
        title: '退货时间',
        dataIndex: 'create_date',
        key: 'create_date',
        render: (text) => {
          return rs.util.date.toString(text);
        },
      },
      {
        title: '退货人员',
        dataIndex: 'update_userName',
        key: 'update_userName',
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
        width: 150,
        render: (text, record) => {
          return (<a onClick={() => this.openModal(record)}>移至货架</a>);
        },
      },
    ],
    visible: false,
    record: {},
  };


  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/validRole',
      payload: {
        roleCode: 'stock_orderReturn',
      },
    });
  }

  componentDidMount() {
  }


  handleSearch = () => {
    const {orderReturn: {query}, dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const proId = fieldsValue.proId === undefined ? null : fieldsValue.proId;
      dispatch({
        type: 'stock_orderReturn/loadOrderReturn',
        payload: {
          proId,
          pageIndex: query.pageIndex,
          pageSize: query.pageSize,
        },
      });
    });
  }

  openModal = (record) => {
    const {dispatch} = this.props;
    dispatch({
        type: 'stock_orderReturn/getWar',
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
    const {dispatch} = this.props;
    dispatch({
        type: 'stock_orderReturn/getHj',
        payload: {
          warId: value,
        },
      },
    );
  }

  changeHj = () => {
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'stock_orderReturn/changeHj',
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
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline">
        <FormItem label="商品编号">
          {getFieldDecorator('proId')(
            <Input placeholder="请输入商品编号"/>
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
    const {orderReturn: {warList, hjList}} = this.props;
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
    const {dispatch, orderReturn: {data: {list, total}, query}, loading} = this.props;
    const {columns} = this.state;
    const pagination = {
      showSizeChanger: true,
      showTotal: (value) => {
        return `共 ${value}条数据`;
      },
      total,
      current: query.pageIndex,
      onChange: (pageIndex) => {
        dispatch({
          type: 'stock_orderReturn/setState',
          payload: {
            query: {
              ...query,
              pageIndex,
            },
          },
        }).then(() => {
          this.handleSearch();
        });
      },
      onShowSizeChange: (current, size) => {
        localStorage.setItem('pageSize', size);
        dispatch({
          type: 'stock_orderReturn/setState',
          payload: {
            query: {
              ...query,
              pageIndex: 1,
            },
          },
        }).then(() => {
          this.handleSearch();
        });
      },
    };
    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <div className="tool-bar">
            {this.renderForm()}
          </div>
          <Table
            columns={columns}
            loading={loading.effects['stock_orderReturn/loadOrderReturn']}
            dataSource={list}
            pagination={pagination}
          />
        </Card>
        {this.state.visible ? <Modal
          title="移至货架"
          width={500}
          visible={this.state.visible}
          confirmLoading={loading.effects['stock_orderReturn/changeHj']}
          onCancel={() => this.closeModal()}
          onOk={() => this.changeHj()}
        >
          {this.renderModalForm()}
        </Modal> : null}
      </PageHeaderLayout>
    );
  }
}
