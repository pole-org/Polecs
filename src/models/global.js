import modelExtend from 'dva-model-extend';
import {queryNotices} from '../services/api';
import {loadMyShop} from '../services/option.service';
import BaseModel from './extra/base.model';

export default modelExtend(BaseModel, {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    fetchingNotices: false,
    myShop: [],
  },

  effects: {
    *fetchNotices(_, {call, put}) {
      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      });
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
    },
    *clearNotices({payload}, {put, select}) {
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });

      yield put({
        type: 'saveClearedNotices',
        payload,
      });
    },
    *loadMyShop(_, {put, call}) {
      const data = yield call(loadMyShop);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            myShop: data.shopList,
          },
        });
      }
    },
  },

  reducers: {
    changeLayoutCollapsed(state, {payload}) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, {payload}) {
      return {
        ...state,
        notices: payload,
        fetchingNotices: false,
      };
    },
    saveClearedNotices(state, {payload}) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    changeNoticeLoading(state, {payload}) {
      return {
        ...state,
        fetchingNotices: payload,
      };
    },
  },

  subscriptions: {
    setup({history}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname, search}) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
});
