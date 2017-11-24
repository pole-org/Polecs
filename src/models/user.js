import {routerRedux} from 'dva/router';
import {query as queryUsers, queryCurrent, getLoginUser, getUserMenu, validRole} from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {
      user_name: '',
      head_imgurl: '',
      job:'',
      deptName:'',
      orgName:'',
      ip:'',
      lastLoginDate:null,
    },
    moduleList: [],
    viewList: [],
  },

  effects: {
    *query(_, {put}) {
      yield put({type: 'getUserMenu'});
      yield put({type: 'getLoginUser'});
    },
    *getUserMenu(_, {put, call}) {
      const data = yield call(getUserMenu);
      if (data.success) {
        yield put({
          type: 'saveUserMenu',
          payload: {
            moduleList: data.moduleList,
            viewList: data.viewList,
          },
        });
      }
    },
    *getLoginUser(_, {put, call}) {
      const data = yield call(getLoginUser);
      if (data.success) {
        yield put({
          type: 'saveCurrentUser',
          payload: data.user,
        });
      }
    },
    *validRole({payload}, {put, call}) {
      const data = yield call(validRole, payload);
      if (!data.hasRole) {
        yield put(routerRedux.push('/exception/403'));
      }
    },

    *fetch(_, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchCurrent(_, {call, put}) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveUserMenu(state, action) {
      return {
        ...state,
        moduleList: action.payload.moduleList,
        viewList: action.payload.viewList,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
