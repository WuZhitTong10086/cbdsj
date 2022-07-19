// pages/login/login.js
const app=getApp()
// const http2=require('../../utils/http2')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVerify:false
  },

  getUserProfile(e) {
    let that = this
    wx.showLoading({
      title: '正在授权登录...',
      mask: true
    })

    wx.getUserProfile({
      desc: '授权登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        // console.log(res)
        that.loadOpenId(res, true)
        // that.register(res,app.globalData.openid)
      }
    })
   
  },
  loadOpenId(userData, isWxAuth = false) {
    let that = this
    var userData = userData
    // 微信登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.hideLoading({
        })
        let urlStr = "https://htpcb.lidanwang.cn/weixinApiController.do?financeLogin"
        
        wx.request({
          url: urlStr,
          data:{
            code:res.code
          },
          method: 'POST',
          header: app.globalData.header,
          success(res1) {
              //注册
              that.register(userData,res1.data.openid)
          }
        })
      }
    })
  },
  // 检查权限
 checkPermissions(openid) {
  wx.request({
    url: app.globalData.http+"/jyTransferController.do?verify2",
    data:{
      type:"02",
      openid:openid,
    },
    method: 'POST',
    header: app.globalData.header,
    success(res) {
      // console.log(res.data.response_data)
      app.globalData.auth = res.data.response_data
      if (res.data.response_data) {
        // wx.setStorageSync('openid',app.globalData.openid)
        wx.setStorageSync("auth",res.data.response_data)
        wx.navigateBack({
          delta: 1,
        })
      }else{
        wx.navigateBack({
          delta: 1,
        })
        
      }
      
    }
  })  
},
//注册账号
register(userData,openid){
  var that = this
  var openid = openid
  var userData = userData
  // console.log(userData.iv)
  wx.request({
    url: app.globalData.http+"/jyTransferController.do?auth_info2",
    data:{
      type:"02",
      openid:openid,
      nickname:userData.userInfo.nickName,
      headimgurl:userData.userInfo.avatarUrl,
      gender:userData.userInfo.gender,
      country:userData.userInfo.country,
      province:userData.userInfo.province,
      city:userData.userInfo.city
      
    },
    method: 'POST',
    header: app.globalData.header,
    success(res2) {
      console.log(res2)
      that.checkPermissions(openid)
      
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})








var Base64 = {

  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

  // public method for encoding
  , encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      }
      else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    } // Whend 

    return output;
  } // End Function encode 


  // public method for decoding
  , decode: function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }

      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

    } // Whend 

    output = Base64._utf8_decode(output);

    return output;
  } // End Function decode 


  // private method for UTF-8 encoding
  , _utf8_encode: function (string) {
    var utftext = "";
    string = string.replace(/\r\n/g, "\n");

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    } // Next n 

    return utftext;
  } // End Function _utf8_encode 

  // private method for UTF-8 decoding
  , _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c, c1, c2, c3;
    c = c1 = c2 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }

    } // Whend 

    return string;
  } // End Function _utf8_decode 

}