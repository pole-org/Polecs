import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Form, Button, Table, DatePicker, Checkbox, Radio, Tag, Badge} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import rs from '../../../rs/';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@connect(state => ({
    outStock: state.stock_outStock,
    loading: state.loading,
  })
)
@Form.create()
export default class TableList extends PureComponent {
  state = {
    typeOptions: [
      {label: '大货装箱', value: 0},
      {label: '订单发货', value: 1},
    ],
    columns: [
      {
        title: '流水号',
        dataIndex: 'apply_serial',
        key: 'apply_serial',
        width: 280,
        // render: (text) => {
        //   return (<strong>{text}</strong>);
        // },
      },
      {
        title: '类型',
        dataIndex: 'apply_type',
        key: 'apply_type',
        width: 150,
        render: (text) => {
          let res = ''
          switch (text) {
            case 0:
              res = '大货装箱';
              break;
            case 1:
              res = '订单发货';
              break;
            default:
              res = '大货装箱';
          }
          return (<Tag>{res}</Tag>);
        },
      },
      {
        title: '申请人',
        dataIndex: 'apply_user_name',
        key: 'apply_user_name',
        width: 100,
      },
      {
        title: '申请时间',
        dataIndex: 'apply_date',
        key: 'apply_date',
        width: 180,
        render: (text) => {
          return (<div>{rs.util.date.toString(text)}</div>);
        },
      },
      {
        title: '状态',
        dataIndex: 'apply_status',
        key: 'apply_status',
        width: 150,
        render: (text) => {
          const res = {}
          switch (text) {
            case 0:
              res.text = '申请中';
              res.status = 'processing';
              break;
            case 3:
              res.text = '正在拣货';
              res.status = 'warning';
              break;
            case 4:
              res.text = '拣货完成';
              res.status = 'error';
              break;
            case 98:
              res.text = '处理完成';
              res.status = 'success';
              break;
            default:
              res.text = '申请中';
              res.status = 'processing';
          }
          return (
            <Badge status={res.status} text={res.text}/>
          );
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
        width: 180,
        render: (text, record) => {
          return (<a onClick={() => this.showDetail(record.apply_serial)}>查看详情</a>);
        },
      },
    ],
  };

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/validRole',
      payload: {
        roleCode: 'stock_outStock',
      },
    });
  }

  componentDidMount() {
    this.handleSearch();
  }

  showDetail = (serialNo) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'stock_outStock/showDetail',
      payload: {
        query: {
          serialNo,
        },
      },
    });
  }

  handleSearch = () => {
    const {outStock: {query}, dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        startDate: fieldsValue.startDate === undefined || fieldsValue.startDate === null ? null
          : fieldsValue.startDate.format('YYYY-MM-DD HH:MM:SS'),
        applyTypeList: fieldsValue.applyTypeList,
      };
      dispatch({
        type: 'stock_outStock/loadList',
        payload: {
          ...query,
          ...values,
        },
      });
    });
  }

  changeType = (status) => {
    const {outStock: {query}, dispatch} = this.props;
    dispatch({
      type: 'stock_outStock/setState',
      payload: {
        query: {
          ...query,
          status,
        },
      },
    }).then(() => {
      this.handleSearch();
    });
  }

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline">
        <FormItem label="开始时间">
          {getFieldDecorator('startDate', {})(
            <DatePicker foramt="YYYY-MM-DD HH:MM:SS" style={{width: 200}} placeholder="请选择开始时间"/>
          )}
        </FormItem>
        <FormItem label="类型">
          {getFieldDecorator('applyTypeList', {
            initialValue: [0, 1],
          })(
            <CheckboxGroup options={this.state.typeOptions}/>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" icon="search" style={{marginRight: '10px'}}
                  onClick={() => this.handleSearch()}>查询</Button>
        </FormItem>
      </Form>
    );
  }

  render() {
    const {outStock: {data: {list, total}, query}, loading, dispatch} = this.props;
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
          type: 'stock_outStock/setState',
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
          type: 'stock_outStock/setState',
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
          <div style={{marginBottom: 10}}>
            <RadioGroup value={query.status} onChange={e => this.changeType(e.target.value)}>
              <RadioButton value={0}>新的申请</RadioButton>
              <RadioButton value={3}>正在捡货</RadioButton>
              <RadioButton value={4}>拣货完成</RadioButton>
              <RadioButton value={98}>处理完成</RadioButton>
            </RadioGroup>
          </div>
          <Table
            columns={columns}
            loading={loading.effects['stock_outStock/loadList']}
            dataSource={list}
            pagination={pagination}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

