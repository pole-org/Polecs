import http from '../utils/http';

export async function loadMyShop() {
  return http.post('/Option/LoadMySHop');
}

