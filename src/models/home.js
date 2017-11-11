import pathToRegexp from 'path-to-regexp';
import {loadList} from '../services/home.service';

export default {
  namespace: 'home',
  state: {
    data: {
      list: [],
    },
    loading: false,
  },

  effects: {
    *fetchList({payload}, {call, put}) {
      const data = yield call(loadList, payload);
      yield put({
        type: 'saveTableData',
        payload: data.monthModel,
      });
    },
  },

  reducers: {
    saveTableData(state, {payload}) {
      return {
        ...state,
        data: {
          list: payload,
        },
      };
    },
  },

  subscriptions: {
    setup({history}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname}) => {
        const match = pathToRegexp('/home/analysis').exec(pathname)
        if (match) {

        }
      });
    },
  },
};

