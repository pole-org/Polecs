import http from '../../utils/http';


export async function load(params) {
  return http.post('/SystemLoginLogs/Load', params)
}
