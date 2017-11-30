import rs from '../../rs/';

export async function loadList(params) {
  return rs.http.post('/StockOutStockApply/LoadApply', params);
}

export async function loadDetail(params) {
  return rs.http.post('/StockOutStockApply/LoadApplyByNo', params);
}

export async function confirmPicking(params) {
  return rs.http.post('/StockOutStockApply/UpdateSkuStatus', params);
}

export async function confirmOutStock(params) {
  return rs.http.post('/StockOutStockApply/OutStock', params);
}

export async function confirmOrderOutStock(params) {
  return rs.http.post('/StockOutStockApply/OrderOutStock', params);
}

export async function reject(params) {
  return rs.http.post('/StockOutStockApply/Reject', params);
}
