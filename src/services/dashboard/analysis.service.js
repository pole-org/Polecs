import http from '../../utils/http';
import config from '../../utils/config';

const fxService = config.getConfig('fxService');

export async function fetchSales(params) {
  return http.get(`${fxService}/dashboard/analysis/FetchSales`, params);
}

export async function fetchOrder(params) {
  return http.get(`${fxService}/dashboard/analysis/FetchOrder`, params);
}

