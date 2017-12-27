import modelExtend from 'dva-model-extend';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import pathToRegExp from 'path-to-regexp';
import BaseModel from './extra/base.model';
import {doSqlSelect} from '../services/system/sqlAdapter';
import  rs from '../rs/';

export default modelExtend(BaseModel, {
  namespace: 'system_sqlAdapter',
  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *doSqlSelect({payload}, {call, put}) {
      const data = yield call(doSqlSelect, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            data: {
              list: data.list,
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


