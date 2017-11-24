import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Form, Button, Table, DatePicker, Progress, Badge} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import rs from '../../../rs/';

const FormItem = Form.Item;

const modelNamespace = 'finance_shopTradeAnalysis';
@connect(state => ({
    [modelNamespace]: state[modelNamespace],
    loading: state.loading,
  })
)
@Form.create()
@rs.component.injectRole(modelNamespace)
@rs.component.injectModel(modelNamespace)
export default class TableList extends PureComponent {
  state = {
    columns: [
      {
        title: '店铺名称',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 250,
      },
      {
        title: '店铺状态',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        filters: [
          {text: '运营中', value: 1},
          {text: '已关闭', value: 0},
        ],
        onFilter: (value, record) => {
          return record.status === parseInt(value);
        },
        render: (text) => {
          return (<Badge text={this.getStatus(text).text} status={this.getStatus(text).status}/>);
        },
      },
      {
        title: '预计交易额',
        dataIndex: 'planMoney',
        key: 'planMoney',
        width: 150,
        sorter: (a, b) => a.planMoney - b.planMoney,
        render: (text) => {
          text = text === null ? 0 : text;
          return (<span>{'$ ' + text}</span>);
        },
      },
      {
        title: '实际交易额',
        dataIndex: 'actualMoney',
        key: 'actualMoney',
        width: 150,
        sorter: (a, b) => a.actualMoney - b.actualMoney,
        render: (text) => {
          text = text === null ? 0 : text;
          return (<span>{'$ ' + text}</span>);
        },
      },
      {
        title: '已取消交易额',
        dataIndex: 'cancelMoney',
        key: 'cancelMoney',
        width: 150,
        sorter: (a, b) => a.cancelMoney - b.cancelMoney,
        render: (text) => {
          text = text === null ? 0 : text;
          return (<span>{'$ ' + text}</span>);
        },
      },
      {
        title: '已退款交易额',
        dataIndex: 'refundMoney',
        key: 'refundMoney',
        width: 150,
        sorter: (a, b) => a.refundMoney - b.refundMoney,
        render: (text) => {
          text = text === null ? 0 : text;
          return (<span>{'$ ' + text}</span>);
        },
      },
      {
        title: '完成率',
        key: 'okPercent',
        width: 150,
        render: (text, record) => {
          return (<span >{this.getPercentRange(record.actualMoney, record.planMoney)}</span>);
        },
      },
      {
        title: '进度',
        key: 'progress',
        render: (text, record) => {
          return (
            <div style={{width: 170}}>
              {this.getProgress(record.actualMoney, record.planMoney) !== null ?
                <Progress
                  percent={this.getProgress(record.actualMoney, record.planMoney).value}
                  strokeWidth={5}
                  status={this.getProgress(record.actualMoney, record.planMoney).status}
                /> : null
              }
            </div>
          );
        },
      },
    ],
  };

  getPercentRange = (one, two) => {
    if (two === 0 || two === null) {
      return null;
    } else {
      return eval((one / two) * 100).toFixed(2) + '%';
    }
  }

  getProgress = (one, two) => {
    if (two === 0 || two === null) {
      return null;
    }
    const prop = {};
    const result = eval((one / two) * 100).toFixed(0) > 100 ? 100
      : parseInt(eval((one / two) * 100).toFixed(2));
    if (result === 100) {
      prop.status = 'success';
    } else {
      prop.status = 'active';
    }
    prop.value = result
    return prop;
  }

  getStatus = (status) => {
    const props = {}
    switch (status) {
      case 1:
        props.text = "运营中";
        props.status = "processing";
        break;
      case 0:
        props.text = "已关闭";
        props.status = "error";
        break;
    }
    return props;
  }

  handleSearch = (e) => {
    e.preventDefault();
    const {form, model} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        startMonth: fieldsValue.startDate.format('YYYY-MM-DD'),
        endMonth: fieldsValue.endDate.format('YYYY-MM-DD'),
      };
      model.call('fetchList', values);
    });
  }

  exportData = () => {
    const {model} = this.props;
    const {[model.name]: {data: {list}}} = this.props;
    let arr = list.concat([])
    const title = [
      {"value": "店铺名称", "type": "ROW_HEADER_HEADER", "datatype": "string"},
      {"value": "店铺状态", "type": "ROW_HEADER_HEADER", "datatype": "string"},
      {"value": "目标额", "type": "ROW_HEADER_HEADER", "datatype": "number"},
      {"value": "实际完成", "type": "ROW_HEADER_HEADER", "datatype": "number"},
      {"value": "已取消", "type": "ROW_HEADER_HEADER", "datatype": "number"},
      {"value": "已退款", "type": "ROW_HEADER_HEADER", "datatype": "number"},
      {"value": "完成率", "type": "ROW_HEADER_HEADER", "datatype": "string"},
    ]
    let dataArr = []
    arr.map(x => {
      const obj = [
        {"value": x.shopName, "type": "ROW_HEADER"},
        {"value": this.getStatus(x.status).text, "type": "ROW_HEADER"},
        {"value": x.planMoney === null ? 0 : x.planMoney, "type": "ROW_HEADER"},
        {"value": x.actualMoney === null ? 0 : x.actualMoney, "type": "ROW_HEADER"},
        {"value": x.cancelMoney === null ? 0 : x.cancelMoney, "type": "ROW_HEADER"},
        {"value": x.refundMoney === null ? 0 : x.refundMoney, "type": "ROW_HEADER"},
        {
          "value": this.getPercentRange(x.actualMoney, x.planMoney) === null ? "" : this.getPercentRange(x.actualMoney, x.planMoney),
          "type": "ROW_HEADER",
        },
      ]
      dataArr.push(obj);
    });
    rs.util.excel.export(dataArr, '分析报表', title);
  }

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <FormItem label="开始时间">
          {getFieldDecorator('startDate', {
            rules: [{
              required: true, message: '请选择开始时间！',
            }],
          })(
            <DatePicker foramt="YYYY-MM-DD" style={{width: '100%'}} placeholder="请选择开始时间"/>
          )}
        </FormItem>
        <FormItem label="结束时间">
          {getFieldDecorator('endDate', {
            rules: [{
              required: true, message: '请选择结束时间！',
            }],
          })(
            <DatePicker foramt="YYYY-MM-DD" style={{width: '100%'}} placeholder="请选择结束时间"/>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" icon="search">查询</Button>
        </FormItem>
        <FormItem>
          <Button icon="download" onClick={() => this.exportData()}>导出数据</Button>
        </FormItem>
      </Form>
    );
  }

  render() {
    const {model} = this.props;
    const {[model.name]: {data}, loading} = this.props;
    const {columns} = this.state
    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <div className="tool-bar">
            {this.renderForm()}
          </div>
          <Table
            rowKey="shopId"
            size="middle"
            columns={columns}
            loading={loading.effects[`${model.name}/fetchList`]}
            dataSource={data.list}
            pagination={false}
            scroll={{y: 500}}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

