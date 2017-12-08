const config = {
  title: '破浪管理系统',
  logo: '',
  defaultAvator: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg',
  serialLogo:'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
  dev: {
    api: 'http://api.lpole.com',
    url: 'http://polecs.lpole.com:8080',
    dataApi: 'http://api.lpole.com/Api/V1',
    fxApi:'http://fxServer.lpole.com/api',
    imgUrl: 'http://erpimg1.polelong.com',
  },
  prod: {
    api: 'http://erp.polelong.com',
    url: 'http://polecs.polelong.com',
    dataApi: 'http://erp.polelong.com/Api/V1',
    fxApi:'http://fxServer.polelong.com/api',
    imgUrl: 'http://erpimg1.polelong.com',
  },
  getConfig(key) {
    if (process.env.NODE_ENV === 'production') {
      return this.prod[key];
    } else {
      return this.dev[key];
    }
  },
}
export default config;
