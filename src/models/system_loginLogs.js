import modelExtend from 'dva-model-extend';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import pathToRegExp from 'path-to-regexp';
import BaseModel from './extra/base.model';
import {load} from '../services/system/loginLogs';
import  rs from '../rs/';

export default modelExtend(BaseModel, {
  namespace: 'system_loginLogs',
  state: {
    data: {
      list: [],
      total: 0,
    },
  },

  effects: {
    *load({payload}, {call, put}) {
      const data = yield call(load, payload);
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
    }
  },

  reducers: {},

  subscriptions: {
    setup({history, dispatch}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname}) => {
        const match = pathToRegExp('/system/loginLogs').exec(pathname);
        if (match) {
          dispatch({
            type: 'load',
            payload: {
              pageIndex: 1,
              pageSize: parseInt(rs.util.lib.defaultValue(localStorage.getItem('pageSize'), 10)),
            },
          });
        }
      });
    },

  },
});

