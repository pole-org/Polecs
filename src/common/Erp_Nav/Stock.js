module.exports={
  name: '仓储管理',
  icon: 'appstore-o',
  path: 'stock',
  fullPath: '/stock',
  code: 'stock',
  show: true,
  redirect: '/stock/outStock',
  children: [
    {
      name: '仓库管理',
      path: 'warehouse',
      code: 'stock_warehouse',
      show: false,
      component: require('../../routes/Stock/WareHouse/'),
    },
    {
      name: '大货出库',
      path: 'outStock',
      code: 'stock_outStock',
      show: true,
      component: require('../../routes/Stock/OutStock/'),
    },
    {
      name: '散单出库',
      path: 'purchaseOutStock',
      code: 'stock_purchaseOutStock',
      show: true,
      component: require('../../routes/Stock/OutStock/purchase'),
    },
    {
      name: '详情',
      path: 'outStock/detail/:id',
      code: 'stock_outStock',
      component: require('../../routes/Stock/OutStock/detail'),
    },
    {
      name: '库存管理',
      path: 'sku',
      code: 'stock_product_sku',
      show: true,
      component: require('../../routes/Stock/Sku/'),
    },
    {
      name: '退货申请',
      path: 'orderReturn',
      code: 'stock_orderReturn',
      show: true,
      component: require('../../routes/Stock/OrderReturn/'),
    },
    // {
    //   name:'出入库记录',
    //   path:'warehouseDiscuss',
    //   code:'stock_warehouseDiscuss',
    //   show:true,
    //   component:require('../../routes/stock/WarehouseDiscuss/'),
    // }
  ],
};
