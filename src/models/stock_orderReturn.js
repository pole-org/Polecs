import modelExtend from 'dva-model-extend';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import pathToRegExp from 'path-to-regexp';
import BaseModel from './extra/base.model';
import {loadOrderReturn, getWar, getHj, changeHj} from '../services/stock/orderReturn.service';

export default modelExtend(BaseModel, {
  namespace: 'stock_orderReturn',
  state: {
    data: {
      list: [],
      total: 0,
    },
    query: {
      pageIndex: 1,
      pageSize: localStorage.getItem('pageSize') == null ? 10 : parseInt(localStorage.getItem('pageSize')),
    },
    hjQuery: {
      skuId: 0,
      warId: null,
      hjNo: null,
    },
    hjList: [],
    warList: [],
  },

  effects: {
    *loadOrderReturn({payload}, {call, put}) {
      const data = yield call(loadOrderReturn, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            data: {
              list: data.orderReturnSku,
              total: data.total,
            },
          },
        });
      }
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
    *changeHj({payload}, {call, put}) {
      const data = yield call(changeHj, payload);
      if (data.success) {
        yield put({
          type: 'loadOrderReturn',
          payload: {
            pageIndex: 1,
            pageSize: localStorage.getItem('pageSize') == null ? 10 : parseInt(localStorage.getItem('pageSize')),
          },
        });
        message.success(data.msg);
      }
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
            type: 'loadOrderReturn',
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

