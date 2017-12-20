import http from '../../utils/http';
import config from '../../utils/config';

const fxService = config.getConfig('fxService');

export async function fetchHotProductRanking(params) {
  return http.get(`${fxService}/Report/ReportCenter/FetchHotProductRanking`, params);
}


