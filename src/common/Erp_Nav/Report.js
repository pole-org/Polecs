module.exports={
  name: '报表中心',
  icon: 'area-chart',
  path: 'report',
  fullPath: '/report',
  code: 'report',
  show: true,
  redirect: '/report/hotProductRanking',
  children: [
    {
      name: '热销商品排名报表',
      path: 'hotProductRanking',
      show: true,
      code: 'report_hotProductRanking',
      component: require('../../routes/Report/HotProductRanking/'),
    },
  ]
}
