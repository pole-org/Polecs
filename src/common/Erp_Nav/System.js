module.exports={
  name: '系统管理',
  icon: 'windows',
  path: 'system',
  fullPath: '/system',
  code: 'system',
  show: true,
  redirect: '/system/loginLogs',
  children: [
    {
      name: '用户登录日志',
      path: 'loginLogs',
      show: true,
      code: 'system_loginLogs',
      component: require('../../routes/System/LoginLogs/'),
    },
  ]
}
