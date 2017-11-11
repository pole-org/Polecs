import modelExtend from 'dva-model-extend';
import {routerRedux} from 'dva/router';
import pathToRegExp from 'path-to-regexp';
import {message} from 'antd';
import BaseModel from './extra/base.model';
import {
  loadBoxSkuInfo,
  returnBoxSku,
  loadDeliverySkuInfo,
  outStock,
} from '../services/logistic/logistic.bulkDelivery.service';

import rs from '../rs/';

const {util: {url}} = rs;

export default modelExtend(BaseModel, {
  namespace: 'logistic_bulkDelivery',
  state: {
    box: {},
    boxSkuList: [],
    boxApplySkuList: [],
    modalList: [],
    updateList: [],
    updateListKeys:[],
  },

  effects: {
    *loadBoxSkuInfo({payload}, {call, put}) {
      const data = yield call(loadBoxSkuInfo, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            box: data.box,
            boxSkuList: data.boxSkuList,
            boxApplySkuList: data.boxApplySkuList,
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
            updateListKeys:[],
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
    *outStock({payload}, {call, put}) {
      const data = yield call(outStock, payload);
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
          if ((x.allCount - x.applyCount - x.boxCount) !== 0) {
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
        const match = pathToRegExp('/logistics/bulkDelivery/box/sku').exec(pathname);
        if (match) {
          dispatch({
            type: 'loadBoxSkuInfo',
            payload: {
              planId: url.query('planId'),
              boxId: url.query('boxId'),
            },
          });
        }
      });
    },

  },
});

