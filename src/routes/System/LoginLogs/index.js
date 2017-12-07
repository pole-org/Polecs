import React, {PureComponent, Component} from 'react';
import lodash from 'lodash';
import {connect} from 'dva';
import {
  Card,
  Form,
  Button,
  Table,
  Input,
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
  DatePicker,
} from 'antd';
import CountDown from 'ant-design-pro/lib/CountDown';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ProductInfo from '../../../myComponents/ProductInfo/';
import rs from '../../../rs/';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckGroup = Checkbox.Group;

const modelNameSpace = 'system_loginLogs';

@connect(state => ({
  [modelNameSpace]: state[modelNameSpace],
  loading: state.loading,
  myShop: state.global.myShop,
}))//注入state
@Form.create()
@rs.component.injectRole(modelNameSpace)//注入权限验证
@rs.component.injectModel(modelNameSpace)//注入model
@rs.component.injectPagination({model: modelNameSpace})//注入分页器
export default class  extends PureComponent {
  state = {
    columns: [
      {
        title: '#',
        dataIndex: 'key',
        key: 'key',
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '用户姓名',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '用户账号',
        dataIndex: 'user_account',
        key: 'user_account',
      },
      {
        title: '用户部门',
        dataIndex: 'user_group',
        key: 'user_group',
      },
      {
        title: '登录ip',
        dataIndex: 'ip',
        key: 'ip',
      },
      {
        title: '登录App',
        dataIndex: 'app',
        key: 'app',
      },
      {
        title: '操作系统',
        dataIndex: 'platform',
        key: 'platform',
      },
      {
        title: '浏览器',
        dataIndex: 'browser',
        key: 'browser',
      },
      {
        title: '登录时间',
        dataIndex: 'login_date',
        key: 'login_date',
        render: (text) => {
          return rs.util.date.toString(text)
        }
      }
    ],
  };

  /**
   * 全局的加载方法
   */
  handleSearch = (page) => {
    const {[modelNameSpace]: {pageIndex, pageSize}, model, form} = this.props;
    model.setState({
      data: {
        list: [],
        total: 0,
      },
      pageIndex: rs.util.lib.defaultValue(page, pageIndex)
    }).then(() => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        fieldsValue.startDate = rs.util.string.isNullOrEmpty(fieldsValue.startDate) ? null : fieldsValue.startDate.format('YYYY-MM-DD');
        model.dispatch({
          type: 'load',
          payload: {
            pageIndex,
            pageSize,
            ...fieldsValue,
          },
        });
      });
    });
  }


  renderForm() {
    const {myShop} = this.props;
    const {getFieldDecorator} = this.props.form;
    const platformOption = [
      {label: 'Windows', value: 'Windows'},
      {label: 'Android', value: 'Android'},
      {label: 'Ios', value: 'Ios'},
      {label: 'Mac', value: 'Mac'},
      {label: 'Linux', value: 'Linux'},
    ]
    return (
      <Form layout="inline">
        <FormItem label="开始时间">
          {getFieldDecorator('startDate', {})(
            <DatePicker foramt="YYYY-MM-DD HH:MM:SS" style={{width: 200}} placeholder="请选择开始时间"/>
          )}
        </FormItem>
        <FormItem label="用户名">
          {getFieldDecorator('userName', {
            initialValue: '',
          })(
            <Input placeholder="请输入用户名"/>
          )}
        </FormItem>
        <FormItem label="ip">
          {getFieldDecorator('ip', {
            initialValue: '',
          })(
            <Input placeholder="请输入ip地址"/>
          )}
        </FormItem>
        <FormItem label="操作系统">
          {getFieldDecorator('platformList', {
            initialValue: [],
          })(
            <CheckGroup options={platformOption}/>
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            icon="search"
            onClick={() => this.handleSearch(1)}
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
    const {columns} = this.state;
    return (
      <Table
        rowkey="key"
        columns={columns}
        size="middle"
        loading={loading.effects[`${model.name}/load`]}
        dataSource={list}
        pagination={pagination({pageIndex, pageSize, total}, this.handleSearch)}
      />
    )
  }


  render() {
    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <div className="tool-bar">
            {this.renderForm()}
          </div>
          {this.renderTable()}
        </Card>
      </PageHeaderLayout>
    );
  }
}

