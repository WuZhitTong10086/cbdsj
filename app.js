// app.js
let config = require('/pages/config/config.js')
let server = require('/pages/config/server.js')
App({
  server: server,  // 服务请求相关类
  config: config,     // 公共配置
  // server: server.init(config),  // 服务请求相关类
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        var that = this;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.hideLoading({
        })
        let urlStr = that.globalData.http+"/weixinApiController.do?financeLogin"
        wx.request({
          url: urlStr,
          data:{
            code:res.code
          },
          method: 'POST',
          header: that.globalData.header,
          success(res1) {
            // 获取权限
            wx.request({
              url: that.globalData.http+"/jyTransferController.do?verify2",
              data:{
                type:"02",
                openid:res1.data.openid,
              },
              method: 'POST',
              header: that.globalData.header,
              success(res2) {
                if (res2.data.response_data) {
                  
                  that.globalData.auth = res2.data.response_data
                  that.globalData.openid = res1.data.openid
                  wx.setStorageSync('openid',res1.data.openid)
                  wx.setStorageSync("auth",res2.data.response_data)

                  if (that.authCallback){
                    that.authCallback(res2.data.response_data);
                  }
                }
              }
            }) 
            
          }
        })
      }
    })
  },
  globalData: {
    openid:wx.getStorageSync('openid'),
    http:"https://htpcb.lidanwang.cn",
    userInfo: wx.getStorageSync('userInfo'),
    token:wx.getStorageSync('token'),
    header:{'content-type': 'application/x-www-form-urlencoded'},
    auth:"",
    serverid:"htCb",
    host: 'https://htpcb.lidanwang.cn/' // 权限验证、助手提案
  }
})

