var app = getApp();
let that
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    co_name:'',
    selectOpen:["本币","原币"],
    selectDate:["昨日","当月"],
    date_num:0,
    _num:0,
    co_no:'',
    date_type:'m',
    data_list:[],
    yuanbiSelectStr:'RMB',
    od_id:'',
    functionid:'4028808d80a6af9d0180a7316a5e0035'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let that = this
    if(options){
      that.setData({
        co_no:options.co_no,
        date_type:options.date_type,
        date_num:options.date_type,
        co_name:options.co_name
      })
    }

    that.getCashDetail()
  },
  //获取现金详情

  getCashDetail(){
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl +"Interface_Fund_Details";
    let date_part = 'd'
    if(that.data.date_type == 1){
      date_part = 'm'
    }
    let params = {
      co_no:that.data.co_no,
      date_part:date_part,
      // od_id:that.data.od_id,
      // co_no:'A01',
      // date_part:'m'
    }
    if(that.data.od_id !='0'){
      params.od_id = that.data.od_id
    }

    params = JSON.stringify(params)

    wx.showLoading('加载中...')
    // 请求数据
    app.server.postSoapRequest(urlStr,params,'Interface_Fund_Details').then((data) => {
        console.log(data)
        if ( data.code == 100 ) {
            // 赋值
            let result = data.data
            let result_t = []
            for (let index = 0; index < result.length; index++) {
              result_t[index] = result[index]
              // result_t[index].ac_date = result_t[index].ac_date.substring(0, (result_t[index].ac_date.indexOf(" ")));
              result_t[index].ac_camt = utils.dataEmptyZero(result_t[index].ac_camt) == true?" ":((result_t[index].ac_camt)/10000).toFixed(0)
              result_t[index].ac_damt = utils.dataEmptyZero(result_t[index].ac_damt) == true?" ":((result_t[index].ac_damt)/10000).toFixed(0)
              result_t[index].ac_balance = utils.dataEmptyZero(result_t[index].ac_balance) == true?" ":((result_t[index].ac_balance)/10000).toFixed(0)
              result_t[index].ac_lamt = utils.dataEmptyZero(result_t[index].ac_lamt) == true?" ":((result_t[index].ac_lamt)/10000).toFixed(0)
              
              // result_t[index].ac_camt1 = ((result_t[index].ac_camt1)/10000).toFixed(0)
              // result_t[index].ac_damt1 = ((result_t[index].ac_damt1)/10000).toFixed(0)
              // result_t[index].ac_balance1 = ((result_t[index].ac_balance1)/10000).toFixed(0)
            }
            console.log(result_t)
            that.setData({
              data_list:result_t
            })
        } else {
            console.log(data)
        }
        wx.showToast({
          title: '数据加载完成',//提示文字
          duration:2000,//显示时长
          mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false  
          // icon:'success', //图标，支持"success"、"loading"  
       })
    }).catch((e) => {
        console.log(e)
        // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
    wx.hideLoading()
  },
  switchChange(_ref) {
    var currentTarget = _ref.currentTarget;
    var tab = currentTarget.dataset.index;
    if (tab == "0") {
        this.setData({
            _num:0,
            od_id:''
        })  
    } else {
        this.setData({
            _num:1,
            od_id:'0',
            yuanbiSelectStr:'RMB'
        })
    }
    this.getCashDetail()
  },

    // 原币选择
    yuanbiSelect(e){
      this.setData({
        yuanbiSelectStr:e.currentTarget.dataset.bz,
        od_id:e.currentTarget.dataset.bz
      })
      this.getCashDetail()
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight - 80 / 750 * res.windowWidth;
        that.setData({
          tbodyHeight: height.toFixed(0)
        })
      }
    })
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
  onShareAppMessage: function () {

  }
})