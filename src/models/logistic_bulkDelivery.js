import modelExtend from 'dva-model-extend';
import {routerRedux} from 'dva/router';
import pathToRegExp from 'path-to-regexp';
import {message} from 'antd';
import BaseModel from './extra/base.model';
import {
  loadDeliveryPlan,
  loadDeliveryPlanDetail,
  loadBoxSkuInfo,
  returnBoxSku,
  loadDeliverySkuInfo,
  addBoxSku,
} from '../services/logistic/logistic.bulkDelivery.service';
import rs from '../rs/';

const {util: {url}} = rs;

export default modelExtend(BaseModel, {
  namespace: 'logistic_bulkDelivery',
  state: {
    deliveryPlanData: {
      list: [],
      total: 0,
    },
    deliveryPlanDataDetail: {
      entity: {
        applyUser: '',
        apply_date: null,
        status: '',
      },
      processList:[],
      skuList:[],
      boxList:[],
    },
    pageIndex: 1,
    box: {},
    boxSkuList: [],
    modalList: [],
    updateList: [],
    updateListKeys: [],
  },

  effects: {
    *loadDeliveryPlan({payload}, {call, put}) {
      const data = yield call(loadDeliveryPlan, payload);
      console.log(data)
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            deliveryPlanData: {
              list: data.planDataList,
              total: data.total,
            },
          },
        });
      }
    },
    *showDetail({payload}, {put}) {
      yield put(routerRedux.push(`/logistics/bulkDelivery/detail/${payload.query.serialNo}`));
    },
    *loadDeliveryPlanDetail({payload}, {call, put}) {
      const data = yield call(loadDeliveryPlanDetail, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            deliveryPlanDataDetail: {
              entity: data.planDetail,
              processList:data.planProcessList,
              skuList:data.skuList,
              boxList:data.boxList,
            },
          },
        });
      }
    },
    *loadBoxSkuInfo({payload}, {call, put}) {
      const data = yield call(loadBoxSkuInfo, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            box: data.box,
            boxSkuList: data.boxSkuList,
          },
        });
      }
    },
    *returnBoxSku({payload}, {call, put}) {
      const data = yield call(returnBoxSku, payload);
      if (data.success) {
        rs.util.loadingService.done();
        yield put({
          type: 'setStateOk',
          payload: {
            updateList: [],
            updateListKeys: [],
          },
        });
        yield put({
          type: 'loadBoxSkuInfo',
          payload: {
            planId: url.query('planId'),
            boxId: url.query('boxId'),
          },
        });
        message.success(data.msg);
      }
    },
    *addBoxSku({payload}, {call, put}) {
      const data = yield call(addBoxSku, payload);
      if (data.success) {
        rs.util.loadingService.done();
        yield put({
          type: 'loadBoxSkuInfo',
          payload: {
            planId: url.query('planId'),
            boxId: url.query('boxId'),
          },
        });
        yield put({
          type: 'loadDeliverySkuInfo',
          payload: {
            planId: url.query('planId'),
          },
        });
        message.success(data.msg);
      }
    },
    *loadDeliverySkuInfo({payload}, {call, put}) {
      const data = yield call(loadDeliverySkuInfo, payload);
      if (data) {
        const arr = [];
        data.skuList.map(x => {
          if ((x.allCount - x.boxCount) !== 0) {
            arr.push(x);
          }
        });
        yield put({
          type: 'setStateOk',
          payload: {
            modalList: arr,
          },
        });
      }
    },
  },

  reducers: {},

  subscriptions: {
    setup({history, dispatch}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname}) => {
        const match = pathToRegExp('/logistics/bulkDelivery/detail/:no').exec(pathname);
        if (match) {
          dispatch({
            type: `loadDeliveryPlanDetail`,
            payload: {
              serialNo: match[1],
            },
          });
        }
      });
    },

  },
});

