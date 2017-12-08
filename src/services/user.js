import request from '../utils/request';
import rs from '../rs/';

const erpApi = rs.config.getConfig('dataApi');

export async function getLoginUser() {
  return rs.http.post(erpApi + "/Login/GetUser");
}

export async function login(params) {
  return rs.http.post(erpApi + "/Login/Login", params);
}

export async function logout(params) {
  return rs.http.post(erpApi + "/Login/Logout", params);
}

export async function getUserMenu() {
  return rs.http.post(erpApi + "/Role/GetUserMenu");
}

export async function validRole(params) {
  return rs.http.post(erpApi + "/Role/ValidRole", params);
}

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
