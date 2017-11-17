import rs from '../../rs/';

/**
 * 加载
 * @param params
 * @returns {Promise.<*|AxiosPromise<T>>}
 */
export async function load(params) {
  return rs.http.post('/StockOrderReturn/Load', params);
}

export async function cancel(params) {
  return rs.http.post('/StockOrderReturn/Cancel', params);
}
