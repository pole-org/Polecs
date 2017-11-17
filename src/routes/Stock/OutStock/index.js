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
@rs.component.injectRole('stock_outStock')
@rs.component.injectModel('stock_outStock')
@rs.component.injectPagination({model: 'stock_outStock'})
export default class StockOutStock extends PureComponent {
  state = {
    typeOptions: [
      {label: '大货发货', value: 0},
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
              res = '大货发货';
              break;
            case 1:
              res = '订单发货';
              break;
            default:
              res = '大货发货';
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

  componentDidMount() {
    this.handleSearch();
  }

  showDetail = (serialNo) => {
    const {model} = this.props;
    model.dispatch({
      type: 'showDetail',
      payload: {
        query: {
          serialNo,
        },
      },
    });
  }

  handleSearch = () => {
    const {outStock: {query, pageIndex, pageSize}, form, model} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        startDate: fieldsValue.startDate === undefined || fieldsValue.startDate === null ? null
          : fieldsValue.startDate.format('YYYY-MM-DD HH:MM:SS'),
        applyTypeList: fieldsValue.applyTypeList,
      };
      model.call('loadList', {
        ...query,
        pageIndex,
        pageSize,
        ...values,
      });
    });
  }

  changeType = (status) => {
    const {outStock: {query, pageIndex, pageSize}, model} = this.props;
    model.setState({
      query: {
        ...query,
        pageIndex,
        pageSize,
        status,
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
          <Button
            type="primary"
            icon="search"
            style={{marginRight: '10px'}}
            onClick={() => this.handleSearch()}
          >查询
          </Button>
        </FormItem>
      </Form>
    );
  }

  render() {
    const {
      outStock: {
        query: {status},
        data: {list, total}, pageIndex,
        pageSize,
      }, loading, pagination, model,
    } = this.props;
    const {columns} = this.state;
    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <div className="tool-bar">
            {this.renderForm()}
          </div>
          <div style={{marginBottom: 10}}>
            <RadioGroup value={status} onChange={e => this.changeType(e.target.value)}>
              <RadioButton value={0}>新的申请</RadioButton>
              <RadioButton value={3}>正在捡货</RadioButton>
              <RadioButton value={4}>拣货完成</RadioButton>
              <RadioButton value={98}>处理完成</RadioButton>
            </RadioGroup>
          </div>
          <Table
            size="middle"
            columns={columns}
            loading={loading.effects[`${model.name}/loadList`]}
            dataSource={list}
            pagination={pagination({pageIndex, pageSize, total}, this.handleSearch)}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

