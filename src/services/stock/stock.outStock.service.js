import rs from '../../rs/';

export async function loadList(params) {
  return rs.http.post('/StockOutStockApply/LoadProcessingApply', params);
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
