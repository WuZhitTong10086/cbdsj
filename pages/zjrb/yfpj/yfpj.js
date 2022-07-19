// pages/zjrb/cash/cash.js
var utils = require('../../../utils/util.js');
var app = getApp();
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    co_name: '',
    selectOpen: ["本币", "原币"],
    selectDate: ["当月", "当月"],
    date_num: 0,
    _num: 0,
    co_no: '',
    date_type: 'm',
    data_list: [],
    yuanbiSelectStr: '0',
    od_id: '',
    xingzhiList: [],
    xingzhi_index: 0,
    functionid: '4028808d80a6af9d0180a732adb90037',
    windowHeight: '',
    firstData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let that = this
    if (options) {
      that.setData({
        co_no: options.co_no,
        date_type: options.date_type,
        date_num: options.date_type,
        co_name: options.co_name
      })
    }

    that.getCashDetail()
  },
  //获取现金详情

  getCashDetail() {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_NP_Details";
    let date_part = 'd'
    if (that.data.date_type == 1) {
      date_part = 'm'
    }

    let nature = "";
    if (that.data.xingzhi_index != 0) { nature = that.data.xingzhiList[that.data.xingzhi_index] }

    let params = {
      co_no: that.data.co_no,
      date_part: date_part,
      nature: nature
    }

    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_NP_Details').then((data) => {
      console.log("---------------------------------应付票据数据---------------------------------")
      console.log(data.data)
      if (data.code == 100) {
        // 赋值
        let result = data.data
        let result_t = []
        let firstData = []
        let xingzhiList = []
        let index_xingzhi = 1
        xingzhiList[0] = '全部'

        // 捉一级数据 到期时间和金额 firstData
        for (let i = 0; i < result.length; i++) {
          if(!result[i].ap_docu && result[i].ap_exp_date){
            console.log(result[i].ap_exp_date)
            firstData.push(result[i])
          }else if(!result[i].ap_docu && !result[i].ap_exp_date){
            console.log("总计")
            firstData.push(result[i])
          }
        }
        console.log("---------------------一级数据(时间和金额)---------------------")
        console.log(firstData)

        for (let index = 0; index < result.length; index++) {
          result_t[index] = result[index]
          if (result[index].cu_name) {
            if (result[index].cu_name.match(/[\u4E00-\u9FA5]/g).length > 4) {
              result_t[index].cu_name1 = result[index].cu_name.substring(0, 4) + '..'
            } else {
              result_t[index].cu_name1 = result[index].cu_name
            }
          } else {
            result_t[index].cu_name1 = result[index].cu_name
          }
          result_t[index].ap_date = result_t[index].ap_date.split(" ")[0].substring(2, 10)
          result_t[index].ap_exp_date = result_t[index].ap_exp_date.split(" ")[0].substring(2, 10)
          result_t[index].ap_amt = utils.dataEmptyZero(result_t[index].ap_amt) == true ? " " : ((result_t[index].ap_amt) / 10000).toFixed(1)
          result_t[index].ap_amt1 = utils.dataEmptyZero(result_t[index].ap_amt1) == true ? " " : ((result_t[index].ap_amt1) / 10000).toFixed(1)

          if (result[index].ap_date == "小计" || result[index].ap_date == "合计") {
            result_t[index].ap_amt = utils.dataToFixed(result[index].ap_amt, 0)
          }

          result_t[index].isshow = 1
          let code = 0;
          for (let index1 = 1; index1 < xingzhiList.length + 1; index1++) {
            if (xingzhiList[index1] == result_t[index].ap_nature) {
              code = 1
              break;
            }
          }

          if (code == 0) {
            xingzhiList[index_xingzhi] = result_t[index].ap_nature
            index_xingzhi++;
          }

        }

        if (that.data.xingzhi_index != 0) {
          xingzhiList = that.data.xingzhiList
        }

        that.setData({
          firstData: firstData,
          data_list: result_t,
          xingzhiList: xingzhiList
        })
      } else {
        console.log(data)
      }
    }).catch((e) => {
      console.log(e)
      // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },
  switchChange(_ref) {
    var currentTarget = _ref.currentTarget;
    var tab = currentTarget.dataset.index;
    if (tab == "0") {
      this.setData({
        _num: 0,
        od_id: ''
      })
    } else {
      this.setData({
        _num: 1,
        od_id: '0',
        yuanbiSelectStr: '0'
      })
    }
    this.getCashDetail()
  },

  // 原币选择
  yuanbiSelect(e) {
    this.setData({
      yuanbiSelectStr: e.currentTarget.dataset.bz,
      od_id: e.currentTarget.dataset.bz
    })
    this.getCashDetail()
  },
  changeCuName(e) {
    console.log(e.currentTarget.dataset.cu_name)
    let cu_name = e.currentTarget.dataset.cu_name
    wx.showModal({
      title: '收票公司',
      content: cu_name,
      showCancel: false,
      confirmText: '返回',
      success: function (res) {
        if (res.confirm) {
          console.log('返回')
        }
      }
    })
  },
  //切换性质
  //切换账号
  xingzhiChange(e) {
    let that = this
    // let data = that.data.data_list
    // let xingzhi_index = e.detail.value
    // let xingzhiList = that.data.xingzhiList
    that.setData({
      xingzhi_index: e.detail.value
    })

    that.getCashDetail()
    // for (let index = 0; index < data.length; index++) {
    //   if(xingzhi_index != 0){
    //     if(data[index].ap_nature == xingzhiList[xingzhi_index]){
    //       data[index].isshow = 1
    //     }else{
    //       data[index].isshow = 0
    //     }
    //   }else{
    //     data[index].isshow = 1
    //   }


    // }
    // this.setData({
    //   data_list:data,
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight - 80 / 750 * res.windowWidth;
        var windowHeight = wx.getSystemInfoSync().windowHeight - 90;
        that.setData({
          tbodyHeight: height.toFixed(0),
          windowHeight: windowHeight.toFixed(0)
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