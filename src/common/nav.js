import BasicLayout from '../layouts/BasicLayout';
import UserLayout from '../layouts/UserLayout';
import BlankLayout from '../layouts/BlankLayout';

import Analysis from '../routes/Dashboard/Analysis';
import Monitor from '../routes/Dashboard/Monitor';
import Workplace from '../routes/Dashboard/Workplace';

import TableList from '../routes/List/TableList';
import CoverCardList from '../routes/List/CoverCardList';
import CardList from '../routes/List/CardList';
import FilterCardList from '../routes/List/FilterCardList';
import SearchList from '../routes/List/SearchList';
import BasicList from '../routes/List/BasicList';

import BasicProfile from '../routes/Profile/BasicProfile';
import AdvancedProfile from '../routes/Profile/AdvancedProfile';

import BasicForm from '../routes/Forms/BasicForm';
import AdvancedForm from '../routes/Forms/AdvancedForm';
import StepForm from '../routes/Forms/StepForm';
import Step2 from '../routes/Forms/StepForm/Step2';
import Step3 from '../routes/Forms/StepForm/Step3';

import Exception403 from '../routes/Exception/403';
import Exception404 from '../routes/Exception/404';
import Exception500 from '../routes/Exception/500';

import Success from '../routes/Result/Success';
import Error from '../routes/Result/Error';

import Login from '../routes/User/Login';
import Register from '../routes/User/Register';
import RegisterResult from '../routes/User/RegisterResult';


import Stock_OutStock from '../routes/Stock/OutStock/';
import Stock_outStockDetail from '../routes/Stock/OutStock/detail';

const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [
    {
      name: 'Dashboard',
      icon: 'dashboard',
      path: 'home',
      code: 'home',
      show:true,
      fullPath:'/home',
      redirect: '/home/desktop',
      children: [
        {
          name: '工作台',
          path: 'desktop',
          show: true,
          code: 'home_desktop',
          component: require('../routes/Home/Desktop/'),
        },
      ],
    },
    {
      name: '物流管理',
      icon: 'car',
      path: 'logistics',
      fullPath:'/logistics',
      code: 'logistics',
      show:true,
      redirect: '/logistics/bulkDelivery',
      children: [
        {
          name: '大货发货申请',
          path: 'bulkDelivery',
          code: 'logistics_bulk_delivery',
          show: true,
          component: require('../routes/Logistic/BulkDelivery/index'),
        },
        {
          name: '详情',
          path: 'bulkDelivery/detail/:no',
          code: 'logistics_bulk_delivery',
          show: false,
          component: require('../routes/Logistic/BulkDelivery/detail'),
        },
        {
          name: '大货箱子SKU',
          path: 'bulkDelivery/Box/Sku',
          code: 'logistics_bulkDeliveryBoxSKu',
          show: false,
          component: require('../routes/Logistic/BulkDelivery/boxSku'),
        },
      ],
    },
    {
      name: '仓储管理',
      icon: 'appstore-o',
      path: 'stock',
      fullPath:'/stock',
      code: 'stock',
      show:true,
      redirect: '/stock/outStock',
      children: [
        {
          name: '仓库管理',
          path: 'warehouse',
          code: 'stock_warehouse',
          show: false,
          component: Stock_OutStock,
        },
        {
          name: '出库申请',
          path: 'outStock',
          code: 'stock_outStock',
          show: true,
          component: Stock_OutStock,
        },
        {
          name: '详情',
          path: 'outStock/detail/:id',
          code: 'stock_outStock',
          component: Stock_outStockDetail,
        },
        {
          name: '库存管理',
          path: 'sku',
          code: 'stock_product_sku',
          show: true,
          component: require('../routes/Stock/Sku/'),
        },
        {
          name: '退货申请',
          path: 'orderReturn',
          code: 'stock_orderReturn',
          show: true,
          component: require('../routes/Stock/OrderReturn/'),
        },
      ],
    },
    {
      name: '财务管理',
      icon: 'pay-circle-o',
      path: 'finance',
      fullPath:'/finance',
      code: 'finance',
      show:true,
      redirect: '/finance/shopTradeAnalysis',
      children: [
        {
          name: '店铺交易分析报表',
          path: 'shopTradeAnalysis',
          show: true,
          code: 'finance_shopTradeAnalysis',
          component: require('../routes/Finance/ShopTradeAnalysis/'),
        },
        {
          name: '订单退货成本',
          path: 'orderCancelCost',
          show: true,
          code: 'finance_orderCancelCost',
          component: require('../routes/Finance/OrderCancelCost/'),
        },
      ],
    },
    // {
    //   name: 'Dashboard',
    //   icon: 'dashboard',
    //   path: 'dashboard',
    //   children: [{
    //     name: '分析页',
    //     path: 'analysis',
    //     component: Analysis,
    //   }, {
    //     name: '监控页',
    //     path: 'monitor',
    //     component: Monitor,
    //   }, {
    //     name: '工作台',
    //     path: 'workplace',
    //     component: Workplace,
    //   }],
    // },
    {
      name: '表单页',
      path: 'form',
      icon: 'form',
      children: [{
        name: '基础表单',
        path: 'basic-form',
        component: BasicForm,
      }, {
        name: '分步表单',
        path: 'step-form',
        component: StepForm,
        children: [{
          path: 'confirm',
          component: Step2,
        }, {
          path: 'result',
          component: Step3,
        }],
      }, {
        name: '高级表单',
        path: 'advanced-form',
        component: AdvancedForm,
      }],
    },
    {
      name: '列表页',
      path: 'list',
      icon: 'table',
      children: [{
        name: '查询表格',
        path: 'table-list',
        component: TableList,
      }, {
        name: '标准列表',
        path: 'basic-list',
        component: BasicList,
      }, {
        name: '卡片列表',
        path: 'card-list',
        component: CardList,
      }, {
        name: '搜索列表（项目）',
        path: 'cover-card-list',
        component: CoverCardList,
      }, {
        name: '搜索列表（应用）',
        path: 'filter-card-list',
        component: FilterCardList,
      }, {
        name: '搜索列表（文章）',
        path: 'search',
        component: SearchList,
      }],
    },
    {
      name: '详情页',
      path: 'profile',
      icon: 'profile',
      children: [{
        name: '基础详情页',
        path: 'basic',
        component: BasicProfile,
      }, {
        name: '高级详情页',
        path: 'advanced',
        component: AdvancedProfile,
      }],
    },
    {
      name: '结果',
      path: 'result',
      icon: 'check-circle-o',
      children: [{
        name: '成功',
        path: 'success',
        component: Success,
      }, {
        name: '失败',
        path: 'fail',
        component: Error,
      }],
    },
    {
      name: '异常',
      path: 'exception',
      icon: 'warning',
      children: [{
        name: '403',
        path: '403',
        component: Exception403,
      }, {
        name: '404',
        path: '404',
        component: Exception404,
      }, {
        name: '500',
        path: '500',
        component: Exception500,
      }],
    }],
}, {
  component: UserLayout,
  layout: 'UserLayout',
  children: [{
    name: '帐户',
    icon: 'user',
    path: 'user',
    children: [{
      name: '登录',
      path: 'login',
      component: Login,
    }, {
      name: '注册',
      path: 'register',
      component: Register,
    }, {
      name: '注册结果',
      path: 'register-result',
      component: RegisterResult,
    }],
  }],
},
//   {
//   component: BlankLayout,
//   layout: 'BlankLayout',
//   children: {
//     name: '使用文档',
//     path: 'http://pro.ant.design/docs/getting-started',
//     target: '_blank',
//     icon: 'book',
//   },
// }
];

export function getNavData() {
  return data;
}

export default data;
