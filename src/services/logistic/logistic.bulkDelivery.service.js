import rs from '../../rs/';

const {http, config} = rs;
const erpApi = config.getConfig('dataApi');
export async function loadDeliveryPlan(params) {
  return http.post(erpApi + '/LogisticsBulkDelivery/Load', params);
}

export async function loadDeliveryPlanDetail(params) {
  return http.post(erpApi + '/LogisticsBulkDelivery/LoadDetail', params);
}

export async function loadBoxSkuInfo(params) {
  return http.post(erpApi + '/LogisticsBulkDelivery/LoadBoxSkuInfo', params);
}

/**
 * 装箱
 * @param params
 * @returns {Promise.<*>}
 */
export async function addBoxSku(params) {
  return http.post(erpApi + '/LogisticsBulkDelivery/AddBoxSku', params);
}

export async function returnBoxSku(params) {
  return http.post(erpApi + '/LogisticsBulkDelivery/ReturnBoxSku', params);
}

export async function outStock(params) {
  return http.post(erpApi + '/StockOutStockApply/AddBoxApply', params);
}

export async function loadDeliverySkuInfo(params) {
  return http.post(erpApi + '/LogisticsBulkDelivery/LoadDeliverySkuInfo', params);
}

