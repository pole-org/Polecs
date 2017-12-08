import http from '../utils/http';
import config from '../utils/config';

const erpApi = config.getConfig('dataApi');

export async function loadMyShop() {
  return http.post(erpApi + '/Option/LoadMySHop');
}

