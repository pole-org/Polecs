import modelExtend from 'dva-model-extend';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import pathToRegExp from 'path-to-regexp';
import BaseModel from './extra/base.model';
import {loadSku, getWar, getHj, changeHj} from '../services/stock/productSku.service';

export default modelExtend(BaseModel, {
  namespace: 'stock_productSku',
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
    *loadSku({payload}, {call, put}) {
      const data = yield call(loadSku, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            data: {
              list: data.skuList,
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
          type: 'loadSku',
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
        const match = pathToRegExp('/stock/sku').exec(pathname);
        if (match) {
          dispatch({
            type: 'loadSku',
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

