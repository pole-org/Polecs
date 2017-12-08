import rs from '../../rs/';


const erpApi = rs.config.getConfig('dataApi');
/**
 * 加载
 * @param params
 * @returns {Promise.<*|AxiosPromise<T>>}
 */
export async function load(params) {
  return rs.http.post(erpApi + '/StockOrderReturn/Load', params);
}

/**
 * 作废
 * @param params
 * @returns {Promise.<void>}
 */
export async function cancel(params) {
  return rs.http.post(erpApi + '/StockOrderReturn/Cancel', params);
}

/**
 * 收货
 * @param params
 * @returns {Promise.<void>}
 */
export async function receive(params) {
  return rs.http.post(erpApi + '/StockOrderReturn/Receive', params);
}

/**
 * 结算
 * @param params
 * @returns {Promise.<void>}
 */
export async function changeCost(params) {
  return rs.http.post(erpApi + '/StockOrderReturn/ChangeCost', params);
}

/**
 * 添加操作备注
 * @param params
 * @returns {Promise.<void>}
 */
export async function addRemark(params) {
  return rs.http.post(erpApi + '/StockOrderReturn/AddRemark', params);
}

