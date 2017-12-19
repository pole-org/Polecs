import http from '../../utils/http';
import config from '../../utils/config';

const fxApi = config.getConfig('fxApi');

export async function fetchHotProductRanking(params) {
  return http.get(`${fxApi}/Report/ReportCenter/FetchHotProductRanking`, params);
}


