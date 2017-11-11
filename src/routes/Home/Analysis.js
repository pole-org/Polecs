import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Form, Button, Table, DatePicker, Progress} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import rs from '../../rs/';

const FormItem = Form.Item;


@connect(state => ({
    home: state.home,
    loading: state.loading,
  })
)
@Form.create()
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
        title: '预计交易额',
        dataIndex: 'planMoney',
        key: 'planMoney',
        width: 150,
        sortOrder: true,
        render: (text) => {
          return (<span style={{float: 'right'}}>{'$' + text}</span>);
        },
      },
      {
        title: '实际交易额',
        dataIndex: 'actualMoney',
        key: 'actualMoney',
        width: 150,
        sortOrder: true,
        render: (text) => {
          return (<span style={{float: 'right'}}>{'$' + text}</span>);
        },
      },
      {
        title: '完成率',
        key: 'okPercent',
        width: 150,
        render: (text, record) => {
          return (<span style={{float: 'right'}}>{this.getPercentRange(record.actualMoney, record.planMoney)}</span>);
        },
      },
      {
        title: '进度',
        key: 'progress',
        render: (text, record) => {
          return (
            <div style={{width: 170}}>
              <Progress
                percent={this.getProgress(record.actualMoney, record.planMoney).value}
                strokeWidth={5}
                status={this.getProgress(record.actualMoney, record.planMoney).status}
              />
            </div>
          );
        },
      },
    ],
  };

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/validRole',
      payload: {
        roleCode: 'home_analysis',
      },
    });
  }

  getPercentRange = (one, two) => {
    if (two === 0 || two === null) {
      return '';
    } else {
      return eval((one / two) * 100).toFixed(2) + '%';
    }
  }

  getProgress = (one, two) => {
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

  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        startMonth: fieldsValue.startDate.format('YYYY-MM-DD'),
        endMonth: fieldsValue.endDate.format('YYYY-MM-DD'),
      };

      dispatch({
        type: 'home/fetchList',
        payload: values,
      });
    });
  }

  exportData = () => {
    const {home: {data: {list}}} = this.props;
    let arr = list.concat([])
    const title = [
      {"value": "店铺名称", "type": "ROW_HEADER_HEADER", "datatype": "string"},
      {"value": "目标额", "type": "ROW_HEADER_HEADER", "datatype": "number"},
      {"value": "实际完成", "type": "ROW_HEADER_HEADER", "datatype": "number"},
      {"value": "完成率", "type": "ROW_HEADER_HEADER", "datatype": "string"},
    ]
    let dataArr = []
    arr.map(x => {
      const obj = [
        {"value": x.shopName, "type": "ROW_HEADER"},
        {"value": x.planMoney === null ? 0 : x.planMoney, "type": "ROW_HEADER"},
        {"value": x.actualMoney === null ? 0 : x.actualMoney, "type": "ROW_HEADER"},
        {"value": this.getPercentRange(x.actualMoney, x.planMoney), "type": "ROW_HEADER"},
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
    const {home: {data}, loading} = this.props;
    const {columns} = this.state
    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <div className="tool-bar">
            {this.renderForm()}
          </div>
          <Table
            bordered
            columns={columns}
            loading={loading.effects['home/fetchList']}
            dataSource={data.list}
            pagination={false}
            scroll={{y: 500}}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
