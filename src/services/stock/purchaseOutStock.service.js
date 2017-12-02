import rs from '../../rs/';

export async function loadList(params) {
  return rs.http.post('/StockOrderOutStockApply/LoadApply', params);
}

export async function loadDetail(params) {
  return rs.http.post('/StockOrderOutStockApply/LoadApplyByNo', params);
}

export async function confirmPicking(params) {
  return rs.http.post('/StockOrderOutStockApply/UpdateSkuStatus', params);
}

export async function confirmOutStock(params) {
  return rs.http.post('/StockOrderOutStockApply/OutStock', params);
}

export async function confirmOrderOutStock(params) {
  return rs.http.post('/StockOrderOutStockApply/OrderOutStock', params);
}

export async function reject(params) {
  return rs.http.post('/StockOrderOutStockApply/Reject', params);
}
