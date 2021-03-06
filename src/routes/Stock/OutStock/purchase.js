import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Button,
  Table,
  DatePicker,
  Checkbox,
  Radio,
  Tag,
  Badge,
  Input,
  Menu,
  Dropdown,
  Popconfirm,
  Icon,
  Tabs,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import rs from '../../../rs/';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const TabPane = Tabs.TabPane;


const modelNamespace = 'stock_purchaseOutStock'

@connect(state => ({
    outStock: state[modelNamespace],
    loading: state.loading,
  })
)
@Form.create()
@rs.component.injectRole(modelNamespace)
@rs.component.injectModel(modelNamespace)
@rs.component.injectPagination({model: modelNamespace})
export default class extends PureComponent {
  state = {
    statusOptions: [
      {label: '未处理', value: 0},
      {label: '已处理', value: 1},
    ],
    columns: [
      {
        title: '流水号',
        dataIndex: 'apply_serial',
        key: 'apply_serial',
      },
      {
        title: '来源信息',
        dataIndex: 'from_no',
        key: 'from_no',
        render: (text, record) => {
          return (
            <div>
              <p>
                <span>交易编号：{record.from_no}</span>
              </p>
              <p>
                <span>订单编号：{record.from_item_no}</span>
              </p>
            </div>
          );
        },
      },
      {
        title: '来源店铺',
        dataIndex: 'shop_name',
        key: 'shop_name',
      },
      {
        title: '申请人员',
        dataIndex: 'apply_user_name',
        key: 'apply_user_name',
      },
      {
        title: '申请时间',
        dataIndex: 'apply_date',
        key: 'apply_date',
        render: (text) => {
          return (<div>{rs.util.date.toString(text)}</div>);
        },
      },
      {
        title: '操作人员',
        dataIndex: 'op_user_name',
        key: 'op_user_name',
      },
      {
        title: '操作时间',
        dataIndex: 'op_date',
        key: 'op_date',
        render: (text) => {
          return (<div>{rs.util.date.toString(text)}</div>);
        },
      },
      {
        title: '状态',
        dataIndex: 'apply_status',
        key: 'apply_status',
        render: (text) => {
          const res = {}
          switch (text) {
            case 0:
              res.text = '新的申请';
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
      // {
      //   title: '备注',
      //   dataIndex: 'remark',
      //   key: 'remark',
      // },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
        render: (text, record) => {
          const menu = (
            <Menu>
              {/*<Menu.Item>*/}
              {/*<a onClick={() => this.openRemarkModel(record)}>备注</a>*/}
              {/*</Menu.Item>*/}
              <Menu.Item>
                <Popconfirm
                  placement="left"
                  title={'确定要驳回吗，驳回后将无法撤回。'}
                  onConfirm={() => this.reject(record.apply_serial)}>
                  <a>驳回</a>
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
              <a onClick={() => this.showDetail(record.apply_serial)}>查看详情</a>
              {
                record.apply_type === 1 && record.apply_status === 0 ?
                  [
                    <span className="ant-divider"/>,
                    <MoreBtn/>,
                  ]
                  : null
              }
            </div>
          );
        },
      },
    ],
  };

  // componentDidMount() {
  //   this.handleSearch();
  // }

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

  handleSearch = (page) => {
    const {outStock: {query, pageIndex, pageSize}, form, model} = this.props;
    model.setState({
      data: {
        list: [],
        total: 0,
      },
      pageIndex: rs.util.lib.defaultValue(page, pageIndex),
    }).then(() => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const values = {
          startDate: rs.util.string.isNullOrEmpty(fieldsValue.startDate) ? null
            : fieldsValue.startDate.format('YYYY-MM-DD'),
          applyTypeList: [1],
          status: parseInt(rs.util.url.query('status', 0)),
          applySerial: fieldsValue.applySerial,
          orderId: 0,
        };
        model.call('loadList', {
          ...query,
          pageIndex,
          pageSize,
          ...values,
        });
      });
    })
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

  reject = (serialNo) => {
    const {model} = this.props;
    rs.util.loadingService.startSubmit();
    model.dispatch({
      type: 'reject',
      payload: {
        applySerial: serialNo,
      },
    }).then(res => {
      rs.util.loadingService.done();
      if (res) {
        this.handleSearch();
      }
    });
  }

  changeStatus = (status) => {
    const {model} = this.props;
    model.setState({
      data: {
        list: [],
        total: 0,
      },
    }).then(() => {
      model.changeRoute(`/stock/purchaseOutStock?status=${status}`);
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
        <FormItem label="流水号">
          {getFieldDecorator('applySerial', {
            initialValue: '',
          })(
            <Input style={{width: 200}} placeholder="请输入流水号"/>
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

  renderTab() {
    return (
      <Tabs activeKey={rs.util.url.query('status', "0") }
            style={{marginBottom: 8}}
            onChange={key => this.changeStatus(key)}>
        <TabPane tab="可操作申请" key="0"/>
        <TabPane tab="不可操作申请（等待关联子订单采购完成）" key="1"/>
      </Tabs>
    )
  }

  render() {
    const {
      outStock: {
        data: {list, total}, pageIndex,
        pageSize,
      }, loading, pagination, model,
    } = this.props;
    const {columns} = this.state;
    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          {this.renderTab()}
          <div className="tool-bar">
            {this.renderForm()}
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



