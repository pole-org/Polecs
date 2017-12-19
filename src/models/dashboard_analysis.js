import modelExtend from 'dva-model-extend';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import pathToRegExp from 'path-to-regexp';
import BaseModel from './extra/base.model';
import {fetchSales, fetchOrder,} from '../services/dashboard/analysis.service';

export default modelExtend(BaseModel, {
  namespace: 'dashboard_analysis',
  state: {
    salesTrendData: [],
    orderTrendData: [],
    shopSalesRankingData: [],
    shopOrderRankingData: [],
    currentYear: 2017
  },

  effects: {
    *fetchSales({payload}, {call, put}) {
      const data = yield call(fetchSales, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            salesTrendData: data.model.salesTrendData,
            shopSalesRankingData: data.model.shopSalesRankingData,
            currentYear: payload.year
          },
        });
      }
    },
    *fetchOrder({payload}, {call, put}) {
      const data = yield call(fetchOrder, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            orderTrendData: data.model.orderTrendData,
            shopOrderRankingData: data.model.shopOrderRankingData,
            currentYear: payload.year
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

      });
    },
  },
});


