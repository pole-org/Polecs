import rs from '../../rs/';

/**
 * 加载婚纱城已取消商品
 * @param params
 * @returns {Promise.<*|AxiosPromise<T>>}
 */
export async function loadOrderReturn(params) {
  return rs.http.post('/StockProductSku/LoadOrderReturnSku', params);
}

/**
 * 获取所有本地仓库
 * @param params
 * @returns {Promise.<*|AxiosPromise<T>>}
 */
export async function getWar(params) {
  return rs.http.post('/StockProductWarehouse/GetLocalWarehouse', params);
}

/**
 * 获取仓库下所有货架
 * @param params
 * @returns {Promise.<*|AxiosPromise<T>>}
 */
export async function getHj(params) {
  return rs.http.post('/StockProductWarehouse/GetHj', params);
}

/**
 * 更改货架
 * @param params
 * @returns {Promise.<*|AxiosPromise<T>>}
 */
export async function changeHj(params) {
  return rs.http.post('/StockProductWarehouse/ChangeHj', params);
}
