import modelExtend from 'dva-model-extend';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import pathToRegExp from 'path-to-regexp';
import BaseModel from './extra/base.model';
import {
  loadList,
  loadDetail,
  confirmPicking,
  confirmOutStock,
  confirmOrderOutStock,
  reject,
} from '../services/stock/stock.outStock.service';
import rs from '../rs/';

export default modelExtend(BaseModel, {
  namespace: 'stock_outStock',
  state: {
    data: {
      list: [],
      count: 0,
    },
    detail: {
      serialNo: '',
      skuList: [],
      applyInfo: {
        apply_serial: '',
        apply_status: 0,
        apply_type: 0,
        apply_date: '',
        apply_user_name: '',
        from_no: '',
        from_item_no: '',
      },
      orderInfo: {
        orderNo: '',
        proId: 0,
        shopName: '',
        skuCode: '',
      },
      planInfo: {},
      processList: [],
    },
    query: {
      status: 0,
    },
    pageIndex: 1,
    updateList: [],
  },

  effects: {
    *loadList({payload}, {call, put}) {
      const data = yield call(loadList, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            data: {
              list: data.applyDataList,
              total: data.total,
            },
          },
        });
      }
    },
    *loadDetail({payload}, {call, put}) {
      const data = yield call(loadDetail, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            detail: {
              serialNo: payload.applySerial,
              applyInfo: data.applyInfo,
              orderInfo: data.orderInfo,
              planInfo: data.planInfo,
              processList: data.processList,
              skuList: data.skuList,
            },
          },
        });
      }
    },
    *showDetail({payload}, {put}) {
      yield put(routerRedux.push(`/stock/outStock/detail/${payload.query.serialNo}`));
    },
    *confirmPicking({payload}, {call, put}) {
      const data = yield call(confirmPicking, payload);
      if (data.success) {
        rs.util.loadingService.done();
        yield put({
          type: 'loadDetail',
          payload: {
            applySerial: payload.applySerial,
          },
        });
        yield put({
          type: 'setStateOk',
          payload: {
            updateList: [],
          },
        });
        message.success(data.msg);
      }
    },
    *confirmOutStock({payload}, {call, put}) {
      const data = yield call(confirmOutStock, payload);
      if (data.success) {
        rs.util.loadingService.done();
        yield put({
          type: 'loadDetail',
          payload: {
            applySerial: payload.applySerial,
          },
        });
        message.success(data.msg);
      }
    },
    *confirmOrderOutStock({payload}, {call, put}) {
      const data = yield call(confirmOrderOutStock, payload);
      if (data.success) {
        rs.util.loadingService.done();
        yield put({
          type: 'loadDetail',
          payload: {
            applySerial: payload.applySerial,
          },
        });
        message.success(data.msg);
      }
    },
    *reject({payload}, {call, put}) {
      const data = yield call(reject, payload);
      if (data.success) {
        message.success(data.msg);
      }
      return Promise.resolve(data.success);
    },
  },
  reducers: {
    setQuery(state, payload) {
      return {
        ...state,
        query: {
          ...payload,
        },
      };
    },
  },

  subscriptions: {
    setup({history, dispatch}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname}) => {
        // const match = pathToRegExp('/stock/outStock/detail/:id').exec(pathname);
        // if (match) {
        //   dispatch({
        //     type: 'setStateOk',
        //     payload: {
        //       data: {
        //         list: [],
        //         count: 0,
        //       },
        //     }
        //   });
        //   dispatch({
        //     type: 'loadDetail',
        //     payload: {
        //       applySerial: match[1],
        //     },
        //   });
        // }
      });
    },

  },
});

