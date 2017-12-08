import rs from '../../rs/';

const erpApi = rs.config.getConfig('dataApi');

export async function loadList(params) {
  return rs.http.post(erpApi + '/StockOrderOutStockApply/LoadApply', params);
}

export async function loadDetail(params) {
  return rs.http.post(erpApi + '/StockOrderOutStockApply/LoadApplyByNo', params);
}

export async function confirmPicking(params) {
  return rs.http.post(erpApi + '/StockOrderOutStockApply/UpdateSkuStatus', params);
}

export async function confirmOutStock(params) {
  return rs.http.post(erpApi + '/StockOrderOutStockApply/OutStock', params);
}

export async function confirmOrderOutStock(params) {
  return rs.http.post(erpApi + '/StockOrderOutStockApply/OrderOutStock', params);
}

export async function reject(params) {
  return rs.http.post(erpApi + '/StockOrderOutStockApply/Reject', params);
}
