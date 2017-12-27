import http from '../../utils/http';
import config from '../../utils/config';

const fxService = config.getConfig('fxService');

export async function doSqlSelect(params) {
  return http.post(fxService + '/System/SqlAdapter/DoSqlSelect', params);
}
