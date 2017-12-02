import {routerRedux} from 'dva/router';

export default {
  namespace: 'BaseModel',
  state: {
    pageIndex: 1,
    pageSize: localStorage.getItem('pageSize') === null ? 10
      : parseInt(localStorage.getItem('pageSize')),
  },
  subscriptions: {
    setup({history, dispatch}) {
      return history.listen(({pathname}) => {
      });
    },
  },

  effects: {
    *setState({payload}, {put}) {
      yield put({
        type: 'setStateOk',
        payload,
      });
    },
    *changeRoute({payload}, {put}) {
      yield put(routerRedux.push(payload.path));
    }
  },
  reducers: {
    setStateOk(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
