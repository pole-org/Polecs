export default {
  namespace: 'BaseModel',
  state: {
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
      console.log(payload)
      yield put({
        type: 'setStateOk',
        payload,
      });
    },
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
