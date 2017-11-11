import request from '../utils/request';
import rs from '../rs/';

export async function getLoginUser() {
  return rs.http.post("/Login/GetUser");
}

export async function login(params) {
  return rs.http.post("/Login/Login", params);
}

export async function logout(params) {
  return rs.http.post("/Login/Logout", params);
}

export async function getUserMenu() {
  return rs.http.post("/Role/GetUserMenu");
}

export async function validRole(params) {
  return rs.http.post("/Role/ValidRole", params);
}

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
