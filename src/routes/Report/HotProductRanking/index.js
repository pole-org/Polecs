import React, {PureComponent} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Card, Form, Button, Table, DatePicker, Progress, Badge, Input, Select} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ProductInfo from '../../../myComponents/ProductInfo/'
import rs from '../../../rs/';
import {dollar, rmb} from '../../../rs/format/'

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

@connect(state => ({
    report: state.report,
    loading: state.loading,
  })
)
@Form.create()
@rs.component.injectRole('report_hotProductRanking')
@rs.component.injectModel('report')
export default class extends PureComponent {
  state = {
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        className: 'align-center',
        width: 30,
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '缩略图',
        dataIndex: 'productImage',
        key: 'productImage',
        className: 'align-center',
        width: 70,
        render: (text, record) => {
          return (<ProductInfo proId={record.productID}/>);
        }
      },
      {
        title: '商品ID',
        dataIndex: 'productID',
        key: 'productID',
        width: 250,
        render: (text, record) => {
          return [
            <p>商品ID: {record.productID}</p>,
            <p>商品平台编号: {record.platformProductNo}</p>,
          ]
        }
      },
      {
        title: '订单量',
        dataIndex: 'orderNum',
        key: 'orderNum',
        className: 'align-center',
        width: 60,
      },
      {
        title: '商品数量',
        dataIndex: 'salesNum',
        key: 'salesNum',
        className: 'align-center',
        width: 60,
      },
      {
        title: '库存',
        children: [
          {
            title: '可售',
            dataIndex: 'stockNum',
            key: 'stockNum',
            className: 'align-center',
            width: 60,
          },
          {
            title: '正在中转',
            dataIndex: 'allotNum',
            key: 'allotNum',
            className: 'align-center',
            width: 60,
          }
        ]
      },
      {
        title: '收入(美元)',
        children: [
          {
            title: '订单实收额',
            dataIndex: 'orderActualAmount',
            key: 'orderActualAmount',
            className: 'align-right',
            width: 100,
            render: (text) => {
              return dollar(text);
            }
          },
          {
            title: '小计',
            className: 'align-right',
            width: 100,
            render: (text, record) => {
              return dollar(record.orderActualAmount);
            }
          }
        ]
      },
      {
        title: '支出(人民币)',
        children: [
          {
            title: '商品总成本',
            dataIndex: 'orderCost',
            key: 'orderCost',
            className: 'align-right',
            width: 100,
            render: (text) => {
              return rmb(text);
            }
          },
          {
            title: '实付运费',
            dataIndex: 'internationalLogisticsCost',
            key: 'internationalLogisticsCost',
            className: 'align-right',
            width: 100,
            render: (text) => {
              return rmb(text);
            }
          },
          {
            title: '小计',
            className: 'align-right',
            width: 100,
            render: (text, record) => {
              return rmb(record.orderCost + record.internationalLogisticsCost);
            }
          }
        ]
      },
    ],
  };

  componentDidMount() {
    this.handleSearch()
  }

  componentWillUnmount() {
    const {model} = this.props;
    model.setState({
      hotProductRanking: {
        list: [],
      },
    });
  }

  getPercentRange = (one, two) => {
    if (two === 0 || two === null) {
      return null;
    } else {
      return eval((one / two) * 100).toFixed(2) + '%';
    }
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

  handleSearch = () => {
    const {form, model} = this.props;
    model.setState({
      hotProductRanking: {
        list: [],
      },
    }).then(() => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const values = {
          startDate: fieldsValue.startDate ? fieldsValue.startDate.format('YYYY-MM-DD') : null,
          endDate: fieldsValue.endDate ? fieldsValue.endDate.format('YYYY-MM-DD') : null,
          showCount: fieldsValue.showCount,
          orderColumn: fieldsValue.orderColumn,
          orderType: fieldsValue.orderType,
          conditionColumn: fieldsValue.conditionColumn,
          condition: fieldsValue.condition,
        };
        model.call('fetchHotProductRanking', values);
      });
    });
  }

  exportData = () => {
    const {model} = this.props;
    const {[model.name]: {hotProductRanking: {list}}} = this.props;
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
    const day = moment().clone();
    const startDay = moment(new Date(day.get('year'), day.get('month'), 1));
    return (
      <Form layout="inline" className="report-form">
        <FormItem>
          <InputGroup compact>
            <Select style={{width: 100}} className="bg-select" value="a.create_date">
              <Option value="a.create_date">创建时间</Option>
            </Select>
            {getFieldDecorator('startDate', {
              initialValue: startDay
            })(
              <DatePicker foramt="YYYY-MM-DD" placeholder="请选择开始时间"/>
            )}
            <Input value="至" style={{width: 40}} disabled/>
            {getFieldDecorator('endDate', {
              initialValue: moment()
            })(
              <DatePicker foramt="YYYY-MM-DD" placeholder="请选择结束时间"/>
            )}
          </InputGroup>
        </FormItem>
        <FormItem>
          {getFieldDecorator('showCount', {
            initialValue: 50
          })(
            <Input addonBefore="显示前" style={{width: 160}} addonAfter="个"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('orderColumn', {
            initialValue: "orderNum"
          })(
            <Select style={{width: 120}} className="bg-select">
              <Option value="orderNum">按订单量</Option>
              <Option value="salesNum">按商品数量</Option>
              <Option value="orderActualAmount">按订单金额</Option>
            </Select>
          )}
          {getFieldDecorator('orderType', {
            initialValue: "desc"
          })(
            <Select style={{width: 80}} className="bg-select">
              <Option value="asc">升序</Option>
              <Option value="desc">降序</Option>
            </Select>
          )}
        </FormItem>
        <FormItem>
          <InputGroup compact>
            {getFieldDecorator('conditionColumn', {
              initialValue: "a.pro_id"
            })(
              <Select style={{width: 120}} className="bg-select">
                <Option value="a.pro_id">按商品ID</Option>
                <Option value="platform_ASIN">按平台编号</Option>
              </Select>
            )}
            {getFieldDecorator('condition', {
              initialValue: ""
            })(
              <Input placeholder="请输入关键字" style={{width: 200}}/>
            )}
            <Button type="primary" icon="search" onClick={e => this.handleSearch()}>搜索</Button>
          </InputGroup>
        </FormItem>
      </Form>
    );
  }

  renderTableFooter = (currentPageData) => {
    console.log(currentPageData)
  }

  render() {
    const {model} = this.props;
    const {report: {hotProductRanking: {list}}, loading} = this.props;
    return (
      <PageHeaderLayout >
        <div className="report-table">
          {this.renderForm()}
          <div className="report-title">
            <h3 className="report-title-content" style={{width: 500}}>热销商品排名报表</h3>
            <div className="report-title-toolBar">
              <Button className="btn-success">导出数据</Button>
            </div>
          </div>
          <Table
            bordered
            rowKey="productID"
            size="small"
            columns={this.state.columns}
            loading={loading.effects[`${model.name}/fetchHotProductRanking`]}
            dataSource={list}
            pagination={false}
            scroll={{x: 1500, y: 680}}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}


