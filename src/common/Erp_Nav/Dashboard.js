module.exports = {
  name: 'Dashboard',
  icon: 'dashboard',
  path: 'home',
  code: 'home',
  show: true,
  fullPath: '/home',
  redirect: '/home/desktop',
  children: [
    {
      name: '工作台',
      path: 'desktop',
      show: true,
      code: 'home_desktop',
      component: require('../../routes/Home/Desktop/'),
    },
    {
      name: '分析页',
      path: 'analysis',
      show: true,
      code: 'home_analysis',
      component: require('../../routes/Home/Analysis/'),
    },
  ],
};


