import {routerRedux} from 'dva/router';
import {fakeMobileLogin} from '../services/api';
import {login, logout} from '../services/user';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *accountSubmit({payload}, {call, put}) {
      const data = yield call(login, payload);
      if (data.success) {
        yield put({
          type: 'user/query',
        });
        const from = window.location.href.split('?');
        let to = '#/home/analysis';
        if (from.length > 1) {
          from.shift();
          to = from.join('?');
          to = to.substring(5, to.length);
        }
        window.location.href = to;
      }
    },
    *emailSubmit(_, {call, put}) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeMobileLogin);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *logout(_, {call, put}) {
      const data = yield call(logout)
      if (data) {
        window.location.href = `#/user/login?from=${window.location.hash}`;
      }
    },
  },

  reducers: {
    changeLoginStatus(state, {payload}) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    changeSubmitting(state, {payload}) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
