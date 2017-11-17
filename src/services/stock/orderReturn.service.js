import rs from '../../rs/';

/**
 * 加载婚纱城已取消商品
 * @param params
 * @returns {Promise.<*|AxiosPromise<T>>}
 */
export async function load(params) {
  return rs.http.post('/StockOrderReturn/Load', params);
}
