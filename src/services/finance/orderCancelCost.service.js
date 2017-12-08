import http from '../../utils/http';
import config from '../../utils/config';

const erpApi = config.getConfig('dataApi');

export async function loadList(params) {
  return http.post(erpApi + '/FinanceOrderCancelCost/Load', params);
}
