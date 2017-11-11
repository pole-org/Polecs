import http from '../utils/http';

export async function loadList(params) {
  return http.post('/Analysis/GetMonthReport', params);
}
