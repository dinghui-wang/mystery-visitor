export default defineAppConfig({
  pages: ['pages/index/index'],
  // 位置打卡所需：声明定位用途与隐私接口
  permission: {
    'scope.userLocation': {
      desc: '用于到店打卡时核验您的位置',
    },
  },
  requiredPrivateInfos: ['getLocation'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#9C8AA5',
    navigationBarTitleText: '神秘顾客',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FBF8F5',
  },
})
