import axios from 'axios';
import {message} from 'antd';
import config from './config';
import loadingService from '../rs/util/loadingService';

const ajax = axios.create({
  baseURL: config.getConfig('dataApi'),
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


ajax.interceptors.response.use((res) => {
  if (res.status === 207) {
    setTimeout(() => {
      loadingService.done();
      window.location.href = `#/user/login?from=#/home/analysis`;
    }, 0);
    return false;
  } else {
    if (!res.data.success) {
      if (res.data.msg !== '') {
        message.error(res.data.msg);
      }
      loadingService.done();
      return Promise.resolve(res.data);
    } else {
      return Promise.resolve(res.data);
    }
  }
}, (err) => {
  setTimeout(() => {
    loadingService.done();
    window.location.hash = `#/exception/500`;
  }, 0);
})

const http = {
  post(url, params) {
    return ajax.post(url, params);
  },
  get(url, params) {
    return ajax.get(url, params);
  },
}

export default http;
