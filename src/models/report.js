import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';
import BaseModel from './extra/base.model';
import {fetchHotProductRanking} from '../services/report/report.service';

export default modelExtend(BaseModel, {
  namespace: 'report',
  state: {
    hotProductRanking: {
      list: [],
    }
  },

  effects: {
    *fetchHotProductRanking({payload}, {call, put}) {
      const data = yield call(fetchHotProductRanking, payload);
      if (data) {
        yield put({
          type: 'setStateOk',
          payload: {
            hotProductRanking: {
              list: data.model.hotProductList
            }
          },
        });
      }
    },
  },

  reducers: {
    clearHotProductRanking(state, {payload}) {
      return {
        ...state,
        hotProductRanking: {
          list: [],
        },
      };
    },
  },

  subscriptions: {
    setup({history}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname}) => {

      });
    },
  },
});


