var app = getApp();
let that
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ar_income_obj1:[],
    co_name: '',
    selectOpen: ["本币", "原币"],
    selectDate: ["昨日", "当月"],
    date_num: 0,
    _num: 0,
    co_no: '',
    date_type: 'm',
    data_list: [],
    yuanbiSelectStr: '0',
    od_id: '0',
    companyListTol: [],
    xingzhiList: [],
    xingzhi_index: 0,
    xingzhi_index_tips: 0,
    data_list_initial: [],
    functionid: '4028808d80a6af9d0180a730de6e0033',
    tbodyHeight:''
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
    let urlStr = app.config.apiUrl + "Interface_NR_Details";
    let date_part = 'd'
    if (that.data.date_type == 1) {
      date_part = 'm'
    }
    let params = {}
    let nature = "";
    if (that.data.xingzhi_index != 0) { nature = that.data.xingzhiList[that.data.xingzhi_index] }
    if (that.data.od_id != '0') {
      params = {
        co_no: that.data.co_no,
        date_part: date_part,
        od_id: that.data.od_id,
        nature: nature
        // co_no:'A01',
        // date_part:'m'
      }
    } else {
      params = {
        co_no: that.data.co_no,
        date_part: date_part,
        nature: nature
        // co_no:'A01',
        // date_part:'m'
      }
    }

    params = JSON.stringify(params)

    wx.showLoading('加载中...')
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_NR_Details').then((data) => {
      console.log("---------------------应收票据数据---------------------")
      console.log(data.data)
      if (data.code == 100) {
        // 赋值
        let result = data.data
        that.setData({
          data_list_initial: result,
        })
        let result_t = []
        let xingzhiList = []
        let index_xingzhi = 1
        xingzhiList[0] = '全部'
        let ar_income_obj1 = []
        let ar_rec_date = ''
        let ar_exp_date = ''
        let Year = '' 
        let month = '' 
        let day = ''
        for (let index = 0; index < result.length; index++) {
          result_t[index] = result[index]
          // 收票日和到期日时间格式修改
          ar_rec_date = result_t[index].ar_rec_date.split(" ")[0].substring(2, 10)
          ar_exp_date = result_t[index].ar_exp_date.split(" ")[0].substring(2, 10)
          if (ar_rec_date){
            Year = parseInt(ar_rec_date.split("/")[0]) < 10 ? '0' + ar_rec_date.split("/")[0] : ar_rec_date.split("/")[0]
            month = parseInt(ar_rec_date.split("/")[1]) < 10 ? '0' + ar_rec_date.split("/")[1] : ar_rec_date.split("/")[1]
            day = parseInt(ar_rec_date.split("/")[2]) < 10 ? '0' + ar_rec_date.split("/")[2] : ar_rec_date.split("/")[2]
            result_t[index].ar_rec_date = Year + '-' + month + '-' + day
          }else{
            result_t[index].ar_rec_date = result_t[index].ar_rec_date.split(" ")[0].substring(2, 10)
          }
          if (ar_exp_date){
            Year = parseInt(ar_exp_date.split("/")[0]) < 10 ? '0' + ar_exp_date.split("/")[0] : ar_exp_date.split("/")[0]
            month = parseInt(ar_exp_date.split("/")[1]) < 10 ? '0' + ar_exp_date.split("/")[1] : ar_exp_date.split("/")[1]
            day = parseInt(ar_exp_date.split("/")[2]) < 10 ? '0' + ar_exp_date.split("/")[2] : ar_exp_date.split("/")[2]
            result_t[index].ar_exp_date = Year + '-' + month + '-' + day
          }else{
            result_t[index].ar_exp_date = result_t[index].ar_exp_date.split(" ")[0].substring(2, 10)
          }

          if(result[index].ar_income_obj){
            if (result[index].ar_income_obj.match(/[\u4E00-\u9FA5]/g).length > 4) {
              ar_income_obj1.push(result[index].ar_income_obj.substring(0, 4) + '...') 
            } else {
              ar_income_obj1.push(result[index].ar_income_obj)
            }
          }

          result_t[index].ar_docu = result_t[index].ar_docu.substring(-10, 10);
          result_t[index].ar_camt = utils.dataEmptyZero(result_t[index].ar_camt) == true ? " " : ((result_t[index].ar_camt) / 10000).toFixed(0)
          result_t[index].ar_damt = utils.dataEmptyZero(result_t[index].ar_damt) == true ? " " : ((result_t[index].ar_damt) / 10000).toFixed(0)
          result_t[index].ar_jamt = utils.dataEmptyZero(result_t[index].ar_jamt) == true ? " " : ((result_t[index].ar_jamt) / 10000).toFixed(0)
          result_t[index].isshow = 1
          // 银行账号bank_accounts
          let code = 0;
          for (let index1 = 1; index1 < xingzhiList.length + 1; index1++) {
            if (xingzhiList[index1] == result_t[index].ar_nature) {
              code = 1
              break;
            }
          }
          if (code == 0) {
            xingzhiList[index_xingzhi] = result_t[index].ar_nature
            index_xingzhi++;
          }

        }

        if (that.data.xingzhi_index != 0) {
          xingzhiList = that.data.xingzhiList
        }

        that.setData({
          ar_income_obj1:ar_income_obj1,
          data_list: result_t,
          xingzhiList: xingzhiList
        })
      } else {
        console.log(data)
      }

      wx.showToast({
        title: '数据加载完成',//提示文字
        duration: 2000,//显示时长
        mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false  
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
    console.log(e)
    let id = e.currentTarget.id
    let cu_name = e.currentTarget.dataset.cu_name
    wx.showModal({
      title: id,
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
    // for (let index = 0; index < data.length; index++) {
    //   if(xingzhi_index != 0){
    //     if(data[index].ar_nature == xingzhiList[xingzhi_index]){
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
    this.getCashDetail()
  },

  yspjDetail: function (e) {
    let that = this
    let index = e.currentTarget.dataset.id
    console.log(JSON.stringify(that.data.data_list[index]))
    let data = that.data.data_list[index]
    let inital_data = that.data.data_list_initial[index]
    console.log(inital_data)
    console.log('初始数据')


    let ar_docu = data.ar_docu
    let ar_nature = data.ar_nature
    let od_id = data.od_id
    let ar_damt = inital_data.ar_damt1.substring(0, (inital_data.ar_damt1.indexOf(".") + 3))
    let ar_camt = inital_data.ar_camt1.substring(0, (inital_data.ar_camt1.indexOf(".") + 3))
    let ar_jamt = inital_data.ar_jamt1.substring(0, (inital_data.ar_jamt1.indexOf(".") + 3))

    let ar_cph = data.ar_cph
    let ar_exp_date = data.ar_exp_date.split(' ')[0]
    let ar_income_obj = inital_data.ar_income_obj
    let pay_date = data.pay_date
    let ar_pay_obj = data.ar_pay_obj
    let ar_rec_date = data.ar_rec_date.split(' ')[0]
    let ar_iss_date = data.ar_iss_date.split(' ')[0]
    wx.navigateTo({
      url: './yspj_detail?ar_docu=' + ar_docu + '&ar_nature=' + ar_nature + '&od_id=' + od_id +
        '&ar_damt=' + ar_damt + '&ar_camt=' + ar_camt + '&ar_jamt=' + ar_jamt + '&ar_cph=' + ar_cph + '&ar_exp_date='
        + ar_exp_date + '&ar_income_obj=' + ar_income_obj + '&pay_date=' + pay_date + '&ar_pay_obj=' + ar_pay_obj
        + '&ar_rec_date=' + ar_rec_date + "&co_name=" + that.data.co_name + "&ar_drawer=" + inital_data.ar_drawer +
        '&ar_iss_date=' + ar_iss_date + "&ar_taker=" + data.ar_taker + "&bk_name=" + data.bk_name
    })

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