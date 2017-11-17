import modelExtend from 'dva-model-extend';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import pathToRegExp from 'path-to-regexp';
import BaseModel from './extra/base.model';
import {load, cancel, receive} from '../services/stock/orderReturn.service';
import {getWar, getHj} from '../services/stock/warehouse.service';

export default modelExtend(BaseModel, {
  namespace: 'stock_orderReturn',
  state: {
    data: {
      list: [],
      total: 0,
    },
    pageIndex: 1,
    hjQuery: {
      skuId: 0,
      warId: null,
      hjNo: null,
    },
    hjList: [],
    warList: [],
  },

  effects: {
    *load({payload}, {call, put}) {
      const data = yield call(load, payload);
      if (data.success) {
        yield put({
          type: 'setStateOk',
          payload: {
            data: {
              list: data.list,
              total: data.count,
            },
          },
        });
      }
    },
    *cancel({payload}, {call, put}) {
      const data = yield call(cancel, payload);
      if (data.success) {
        message.success(data.msg)
      }
      return Promise.resolve(data.success);
    },
    *getWar({payload}, {call, put}) {
      const data = yield call(getWar, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            warList: data.warList,
          },
        });
      }
    },
    *getHj({payload}, {call, put}) {
      const data = yield call(getHj, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            hjList: data.hjList,
          },
        });
      }
    },
    *receive({payload}, {call, put}) {
      const data = yield call(receive, payload);
      if (data.success) {
        message.success(data.msg);
      }
      return Promise.resolve(data.success);
    },
  },

  reducers: {},

  subscriptions: {
    setup({history, dispatch}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname}) => {
        const match = pathToRegExp('/stock/orderReturn').exec(pathname);
        if (match) {
          dispatch({
            type: 'load',
            payload: {
              pageIndex: 1,
              pageSize: localStorage.getItem('pageSize') == null ? 10 : parseInt(localStorage.getItem('pageSize')),
            },
          });
        }
      });
    },

  },
});

