import axios from 'axios';
import {message} from 'antd';
import cookie from 'js-cookie'
import loadingService from '../rs/util/loadingService';
import config from '../utils/config';


const ajax = axios.create({
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


ajax.interceptors.response.use((res) => {
  if (res.status === 202) {
    setTimeout(() => {
      loadingService.done();
      window.location.href = `${config.getConfig('loginServer')}?app=Erp&from=${config.getConfig('url')}#/home/desktop`;
    }, 0);
    return false;
  } else {
    if (!res.data.success) {
      if (res.data.msg !== '') {
        message.error(res.data.msg);
      }
      loadingService.done();
    }
    return Promise.resolve(res.data);
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
    return ajax.get(url, {params});
  },
}

export default http;
