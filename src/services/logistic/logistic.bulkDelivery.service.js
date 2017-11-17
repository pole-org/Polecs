import rs from '../../rs/';

const {http} = rs;

export async function loadDeliveryPlan(params) {
  return http.post('/LogisticsBulkDelivery/Load', params);
}

export async function loadDeliveryPlanDetail(params) {
  return http.post('/LogisticsBulkDelivery/LoadDetail', params);
}

export async function loadBoxSkuInfo(params) {
  return http.post('/LogisticsBulkDelivery/LoadBoxSkuInfo', params);
}

export async function returnBoxSku(params) {
  return http.post('/LogisticsBulkDelivery/ReturnBoxSku', params);
}

export async function outStock(params) {
  return http.post('/StockOutStockApply/AddBoxApply', params);
}

export async function loadDeliverySkuInfo(params) {
  return http.post('/LogisticsBulkDelivery/LoadDeliverySkuInfo', params);
}

