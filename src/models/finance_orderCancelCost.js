import modelExtend from 'dva-model-extend';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import pathToRegExp from 'path-to-regexp';
import BaseModel from './extra/base.model';
import {loadList} from '../services/finance/orderCancelCost.service';

export default modelExtend(BaseModel, {
  namespace: 'finance_orderCancelCost',
  state: {
    data: {
      list: [],
      total: 0,
    },
  },

  effects: {
    *load({payload}, {call, put}) {
      const data = yield call(loadList, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            data: {
              list: data.list,
              total: data.total,
            },
          },
        });
      }
    },
  },

  reducers: {
  },

  subscriptions: {
    setup({history, dispatch}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname}) => {
        const match = pathToRegExp('/finance/orderCancelCost').exec(pathname)
        if (match) {
          dispatch({
            type:'load',
            payload: {
              pageIndex: 1,
              pageSize: localStorage.getItem('pageSize') == null ? 10 : parseInt(localStorage.getItem('pageSize')),
            },
          })
        }
      });
    },
  },
});

