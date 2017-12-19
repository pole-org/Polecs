module.exports={
  name: '物流管理',
  icon: 'car',
  path: 'logistics',
  fullPath: '/logistics',
  code: 'logistics',
  show: true,
  redirect: '/logistics/bulkDelivery',
  children: [
    {
      name: '大货发货申请',
      path: 'bulkDelivery',
      code: 'logistics_bulk_delivery',
      show: false,
      component: require('../../routes/Logistic/BulkDelivery/index'),
    },
    {
      name: '详情',
      path: 'bulkDelivery/detail/:no',
      code: 'logistics_bulk_delivery',
      show: false,
      component: require('../../routes/Logistic/BulkDelivery/detail'),
    },
    {
      name: '大货箱子SKU',
      path: 'bulkDelivery/Box/Sku',
      code: 'logistics_bulkDeliveryBoxSKu',
      show: false,
      component: require('../../routes/Logistic/BulkDelivery/boxSku'),
    },
  ],
};
