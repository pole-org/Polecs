import http from '../../utils/http';
import config from '../../utils/config';

const erpApi = config.getConfig('dataApi')

export async function load(params) {
  return http.post(erpApi + '/SystemLoginLogs/Load', params)
}
