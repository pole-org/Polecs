import rs from '../../rs/';

const erpApi = rs.config.getConfig('dataApi');

export async function loadList(params) {
  return rs.http.post(erpApi + '/StockOutStockApply/LoadApply', params);
}

export async function loadDetail(params) {
  return rs.http.post(erpApi + '/StockOutStockApply/LoadApplyByNo', params);
}

export async function confirmPicking(params) {
  return rs.http.post(erpApi + '/StockOutStockApply/UpdateSkuStatus', params);
}

export async function confirmOutStock(params) {
  return rs.http.post(erpApi + '/StockOutStockApply/OutStock', params);
}

export async function confirmOrderOutStock(params) {
  return rs.http.post(erpApi + '/StockOutStockApply/OrderOutStock', params);
}

export async function reject(params) {
  return rs.http.post(erpApi + '/StockOutStockApply/Reject', params);
}
