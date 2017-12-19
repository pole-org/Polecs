import http from '../../utils/http';
import config from '../../utils/config';

const fxApi = config.getConfig('fxApi');

export async function fetchSales(params) {
  return http.get(`${fxApi}/dashboard/analysis/FetchSales`, params);
}

export async function fetchOrder(params) {
  return http.get(`${fxApi}/dashboard/analysis/FetchOrder`, params);
}

