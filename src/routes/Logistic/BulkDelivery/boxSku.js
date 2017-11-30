import React, {PureComponent} from 'react';
import {Card, Table, Button, Badge, Modal, Form, Row, Col, Spin, InputNumber, message, Alert} from 'antd';
import {connect} from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import ProductInfo from '../../../myComponents/ProductInfo/';
import styles from '../../../theme/common.less';

import rs from '../../../rs/';

const {util: {url: {query}}} = rs;

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const {Column, ColumnGroup} = Table;
const {Description} = DescriptionList;

@connect(state => ({
    bulkDelivery: state.logistic_bulkDelivery,
    loading: state.loading,
  })
)
@Form.create()
@rs.component.injectModel('logistic_bulkDelivery')
export default class BoxSku extends PureComponent {
  state = {
    applyColumns: [
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
        title: '商品SKU',
        dataIndex: 'sku_code',
        key: 'sku_code',
      },
      {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: () => {
          return (<Badge status="processing" text="申请中"/>);
        },
      },
    ],
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
        title: '商品SKU',
        dataIndex: 'sku_code',
        key: 'sku_code',
      },
      {
        title: 'ASIN',
        dataIndex: 'ASIN',
        key: 'ASIN',
      },
      {
        title: 'FNSKU',
        dataIndex: 'FNSKU',
        key: 'FNSKU',
      },
      {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: () => {
          return (<Badge status="success" text="已装箱"/>);
        },
      },
    ],
    visible: false,
  }

  componentDidMount() {
    const {model} = this.props;
    model.dispatch({
      type: 'loadBoxSkuInfo',
      payload: {
        planId: query('planId'),
        boxId: query('boxId'),
      },
    })
  }

  getStatus = (status) => {
    let text = '';
    switch (status) {
      case 'packing':
        text = "正在打包";
        break;
      case 'send_logistics':
        text = "已经交运";
        break;
      case 'delivery':
        text = "已经发货";
        break;
      case 'instock':
        text = "已经入库";
        break;
    }
    return text;
  }

  setValue = (value, index) => {
    const {dispatch, bulkDelivery: {modalList}} = this.props;
    const arr = modalList.concat([]);
    arr[index].canApplyCount = value;
    dispatch({
      type: 'logistic_bulkDelivery/setState',
      payload: {
        modalList: arr,
      },
    });
  }

  refresh = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'logistic_bulkDelivery/loadBoxSkuInfo',
      payload: {
        planId: query('planId'),
        boxId: query('boxId'),
      },
    });
  }

  openModal = () => {
    const {model: {dispatch}} = this.props;
    this.setState({
      visible: true,
    });
    dispatch({
      type: 'loadDeliverySkuInfo',
      payload: {
        planId: query('planId'),
      },
    }).then(() => {
    });
  }
  closeModal = () => {
    this.setState({
      visible: false,
    });
  }

  returnBoxSku = () => {
    const {model: {dispatch}, bulkDelivery: {updateList}} = this.props;
    Modal.confirm({
      title: '撤回库存',
      content: '确定要撤回库存吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        rs.util.loadingService.startSubmit();
        dispatch({
          type: 'returnBoxSku',
          payload: {
            boxId: query('boxId'),
            skuModelList: updateList,
          },
        });
      },
    });
  }

  addAll = () => {
    const {dispatch, bulkDelivery: {modalList}} = this.props;
    const arr = modalList.concat([]);
    arr.map(x => {
      x.canApplyCount = x.allCount - x.applyCount - x.boxCount;
    });
    dispatch({
      type: 'logistic_bulkDelivery/setState',
      payload: {
        modalList: arr,
      },
    });
  }

  addBoxSku = () => {
    const {model: {dispatch}, bulkDelivery: {modalList}} = this.props;
    Modal.confirm({
      title: '装箱',
      content: '确定要装箱吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const arr = [];
        let obj = {};
        modalList.map(data => {
          if (data.canApplyCount > 0) {
            obj = {
              proId: data.pro_id,
              skuCode: data.sku_code,
              ASIN: data.ASIN,
              count: data.canApplyCount,
            }
            arr.push(obj);
          }
        });
        if (arr.length === 0) {
          message.warning("请添加至少一个sku");
        } else {
          rs.util.loadingService.startSubmit();
          dispatch({
            type: 'addBoxSku',
            payload: {
              boxId: query('boxId'),
              skuModel: arr,
            },
          });
        }
      },
    });
  }

  renderForm() {
    return (
      <Form layout="inline">
        <FormItem>
          <Button type="primary" onClick={() => this.addBoxSku()}>装箱</Button>
        </FormItem>
        <FormItem>
          <Button onClick={() => this.addAll()}>添加全部</Button>
        </FormItem>
      </Form>
    );
  }

  renderModalTable() {
    const {bulkDelivery: {modalList}, loading, model} = this.props;
    return (
      <Table
        dataSource={modalList}
        pagination={false}
        size="middle"
        style={{marginBottom: 24}}
        bordered
        loading={loading.effects[`${model.name}/loadDeliverySkuInfo`]}
      >
        <Column
          title="图片"
          dataIndex="pro-img"
          key="pro-img"
          render={(text, record) => (
            <ProductInfo proId={record.pro_id}/>
          )}
        />
        <Column title="商品编号" dataIndex="pro_id" key="pro_id"/>
        <Column title="商品SKU" dataIndex="sku_code" key="sku_code"/>
        <Column title="ASIN" dataIndex="ASIN" key="ASIN"/>
        <Column title="FNSKU" dataIndex="FNSKU" key="FNSKU"/>
        <ColumnGroup title="商品数量">
          <Column title="可用数量" dataIndex="allCount" key="allCount"/>
          <Column title="已装箱" dataIndex="boxCount" key="boxCount"/>
          <Column
            title="可装箱"
            dataIndex="canApplyCount"
            key="canApplyCount"
            render={(text, record) => {
              return record.allCount - record.boxCount;
            }}
          />
        </ColumnGroup>
        <Column
          title="填写装箱数量"
          key="action"
          render={(text, record, index) => (
            <div>
              <InputNumber
                min={0}
                max={record.allCount - record.boxCount}
                value={record.canApplyCount}
                onChange={value => this.setValue(value, index)}
              />
              <Button
                type="primary"
                size="small"
                style={{marginLeft: 10}}
                onClick={() => this.setValue(
                  (record.allCount - record.boxCount), index)}
              >
                全部
              </Button>
            </div>
          )}
        />
      </Table>
    );
  }


  render() {
    const {
      loading, bulkDelivery: {box, boxSkuList, updateList, updateListKeys},
      model,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: updateListKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        model.setState({
          updateListKeys: selectedRowKeys,
          updateList: selectedRows,
        });
      },
    };
    const action = (
      <div>
        <ButtonGroup>
          <a
            href={`${rs.config.getConfig('api')}/logistics/bulk_delivery#/logistics/bulk_delivery/box?planId=${rs.util.url.query('planId')}`}
          >
            <Button>返回箱子列表</Button>
          </a>
        </ButtonGroup>
        <Button type="primary" onClick={() => this.refresh()}>刷新</Button>
      </div>
    );
    const extra = (
      <Row>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{this.getStatus(box.box_status)}</div>
        </Col>
      </Row>
    );
    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="计划编号"><a>{box.plan_id}</a></Description>
        <Description term="计划名称">{box.plan_number}</Description>
        <Description term="箱子编号"><a>{box.box_id}</a></Description>
        <Description term="箱子名称">{box.box_name}</Description>
        <Description
          term="发货备注"
        >
          {rs.util.string.isNullOrEmpty(box.delivery_content) ? '暂无备注信息' : box.delivery_content}
        </Description>
      </DescriptionList>
    );
    return (
      <PageHeaderLayout
        content={description}
        action={action}
        extraContent={extra}
      >
        <Spin
          tip="正在从服务器加载数据...."
          spinning={loading.effects[`${model.name}/loadBoxSkuInfo`]}
        >
          <Card
            bordered={false}
            title="已添加SKU列表"
          >
            {box.box_status === 'packing' ?
              <div className="tool-bar">
                <Form layout="inline">
                  <FormItem>
                    <Button type="primary" onClick={() => this.openModal()}>装箱</Button>
                  </FormItem>
                  <FormItem>
                    {updateList.length > 0 ?
                      <Button type="danger" onClick={() => this.returnBoxSku()}>撤回库存</Button> : null}
                  </FormItem>
                </Form></div> : null
            }
            <Table
              columns={this.state.columns}
              dataSource={boxSkuList}
              pagination={false}
              rowSelection={box.box_status === 'packing' ? rowSelection : null}
              rowKey={(record) => record.pro_id + record.sku_code}
            />
          </Card>
        </Spin>
        {
          this.state.visible ?
            <Modal
              title="装箱"
              footer={null}
              visible={this.state.visible}
              width={1100}
              onCancel={() => this.closeModal()}
            >
              <div className="tool-bar">
                {this.renderForm()}
              </div>
              {/*<Alert*/}
              {/*message="注意"*/}
              {/*description="如果申请数量小于本地仓库库存总和，系统只会匹配现有库存数量，而不是您申请的数量"*/}
              {/*type="warning"*/}
              {/*showIcon*/}
              {/*/>*/}
              {this.renderModalTable()}
            </Modal> : null
        }
      </PageHeaderLayout>
    );
  }
}
