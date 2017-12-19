module.exports={
  name: '财务管理',
  icon: 'pay-circle-o',
  path: 'finance',
  fullPath: '/finance',
  code: 'finance',
  show: true,
  redirect: '/finance/shopTradeAnalysis',
  children: [
    {
      name: '店铺交易分析报表',
      path: 'shopTradeAnalysis',
      show: true,
      code: 'finance_shopTradeAnalysis',
      component: require('../../routes/Finance/ShopTradeAnalysis/'),
    },
    {
      name: '订单退货成本',
      path: 'orderCancelCost',
      show: true,
      code: 'finance_orderCancelCost',
      component: require('../../routes/Finance/OrderCancelCost/'),
    },
  ],
};
