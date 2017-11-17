import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Form, Button, Table, DatePicker, Checkbox, Tag, Badge, Select, Row, Col} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import rs from '../../../rs/';
import styles from '../../../theme/BasicList.less';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const {Column, ColumnGroup} = Table;
const Option = Select.Option;

@connect(state => ({
    bulkDelivery: state.logistic_bulkDelivery,
    loading: state.loading,
    myShop: state.global.myShop,
  })
)
@Form.create()
@rs.component.injectRole('logistics_bulk_delivery')
@rs.component.injectModel('logistic_bulkDelivery')
@rs.component.injectPagination({model: 'logistic_bulkDelivery'})
@rs.component.injectOption('loadMyShop')
export default class BulkDelivery extends PureComponent {
  state = {
    typeOptions: [
      {label: '等待出库', value: 'wait_outstock', status: 'default'},
      {label: '正在打包', value: 'packing', status: 'processing'},
      {label: '已经交运', value: 'send_logistics', status: 'warning'},
      {label: '正在发货', value: 'deriving', status: 'warning'},
      {label: '已经发货', value: 'delivery', status: 'error'},
      {label: '已经入库', value: 'instock', status: 'success'},
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
    const {bulkDelivery: {pageIndex, pageSize}, form, model, myShop} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        startDate: rs.util.string.isNullOrEmpty(fieldsValue.startDate) ? null
          : fieldsValue.startDate.format('YYYY-MM-DD'),
        shopId: rs.util.string.isNullOrEmpty(fieldsValue.shopName) ?
          null : myShop.filter(x => x.shopName === fieldsValue.shopName)[0].shopId,
        statusList: fieldsValue.status === undefined ? [] : fieldsValue.status,
      };
      model.dispatch({
        type: 'loadDeliveryPlan',
        payload: {
          pageIndex,
          pageSize,
          ...values,
        },
      });
    });
  }

  renderTable() {
    const {
      bulkDelivery: {deliveryPlanData: {list, total}, pageIndex},
      loading, pagination, model,
    } = this.props;
    return (
      <Table
        size="middle"
        loading={loading.effects[`${model.name}/loadDeliveryPlan`]}
        dataSource={list}
        pagination={pagination({pageIndex, total}, this.handleSearch)}
      >
        <Column title="流水号" dataIndex="serialNo" key="serialNo"/>
        <Column title="计划ID" dataIndex="planId" key="planId"/>
        <Column title="计划编号" dataIndex="planNo" key="planNo"/>
        {/*<ColumnGroup title="计划信息">*/}
        {/*<Column title="计划ID" dataIndex="planId" key="planId"/>*/}
        {/*<Column title="计划编号" dataIndex="planNo" key="planNo"/>*/}
        {/*<Column title="货件编号" dataIndex="goodsNo" key="goodsNo"/>*/}
        {/*<Column title="货件名称" dataIndex="goodsName" key="goodsName"/>*/}
        {/*</ColumnGroup>*/}
        <Column title="来源店铺" dataIndex="shopName" key="shopName"/>
        <Column title="发往仓库" dataIndex="warName" key="warName"/>
        <Column
          title="状态"
          dataIndex="status"
          key="status"
          render={(text) => {
            const prop = this.state.typeOptions.filter(x => x.value === text)[0];
            return (<Badge
              status={prop.status}
              text={prop.label}
            />);
          }}
        />
        <Column
          title="申请时间"
          dataIndex="applyDate"
          key="applyDate"
          render={(text) => rs.util.date.toString(text)}
        />
        <Column
          title="申请人"
          dataIndex="applyUser"
          key="applyUser"
        />
        {/*<ColumnGroup title="所有箱子重量（克）">*/}
        {/*<Column title="计划" dataIndex="planWeight" key="planWeight"/>*/}
        {/*<Column title="实际" dataIndex="actualWeight" key="actualWeight"/>*/}
        {/*</ColumnGroup>*/}
        {/*<ColumnGroup title="商品">*/}
        {/*<Column title="商品总数" dataIndex="proCount" key="proCount"/>*/}
        {/*<Column title="SKU总数" dataIndex="skuCount" key="skuCount"/>*/}
        {/*</ColumnGroup>*/}
        {/*<Column*/}
        {/*title="最晚到货期"*/}
        {/*dataIndex="lastDate"*/}
        {/*key="lastDate"*/}
        {/*render={(text) => rs.util.date.toString(text)}*/}
        {/*/>*/}
        {/*<Column title="发货备注" dataIndex="remark" key="remark"/>*/}
        <Column
          title="操作"
          dataIndex="op"
          key="op"
          render={(text, record) => {
            return (
              <div>
                <a onClick={() => this.showDetail(record.serialNo)}>查看详情</a>
                <span className="ant-divider"/>
                <a href={rs.config.getConfig('imgUrl') + record.fileUrl} target="_blank" download="">下载标签</a>
              </div>);
          }}
        />
      </Table>
    );
  }

  renderForm() {
    const {myShop} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline">
        <FormItem label="申请时间">
          {getFieldDecorator('startDate', {})(
            <DatePicker foramt="YYYY-MM-DD HH:MM:SS" style={{width: 200}} placeholder="请选择开始时间"/>
          )}
        </FormItem>
        <FormItem label="请选择店铺">
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
        <FormItem label="状态">
          {getFieldDecorator('status')(
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
    return (
      <PageHeaderLayout >
        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className="tool-bar">
              {this.renderForm()}
            </div>
            {this.renderTable()}
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}

