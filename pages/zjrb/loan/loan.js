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
    selectDate:["当日","当月"],
    date_num:0,
    _num:0,
    co_no:'',
    date_type:'m',
    data_list:[],
    yuanbiSelectStr:'0',
    od_id:'',
    xingzhiList:[],
    xingzhi_index:0,
    bk_sno:'',
    functionid:'4028808d80a6af9d0180a7332e090039'
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
    let xingzhiList = []
    let index_xingzhi = 1
    xingzhiList[0] = '全部'

    // 获取接口
    let urlStr = app.config.apiUrl +"Interface_Loan_Details";
    let date_part = 'd'
    if(that.data.date_type == 1){
      date_part = 'm'
    }
    let params = {
      co_no:that.data.co_no,
      date_part:date_part,
      bk_sno:that.data.bk_sno,
      // co_no:'A01',
      date_part:'m'
      
    }
    

    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr,params,'Interface_Loan_Details').then((data) => {
        console.log(data)
        if ( data.code == 100 ) {
            // 赋值
            let result = data.data
            let result_t = []
            for (let index = 0; index < result.length; index++) {
              result_t[index] = result[index]

              result_t[index].ac_increase = utils.dataEmptyZero(result_t[index].ac_increase) == true?" ":((result_t[index].ac_increase)/10000).toFixed(0)
              result_t[index].ac_amt = utils.dataEmptyZero(result_t[index].ac_amt) == true?" ":((result_t[index].ac_amt)/10000).toFixed(0)
              result_t[index].ac_lmt = utils.dataEmptyZero(result_t[index].ac_lmt) == true?" ":((result_t[index].ac_lmt)/10000).toFixed(0)

              result_t[index].line_of_credit = utils.dataEmptyZero(result_t[index].line_of_credit) == true?" ":((result_t[index].line_of_credit)/10000).toFixed(0)

              result_t[index].ac_balance = utils.dataEmptyZero(result_t[index].ac_balance) == true?" ":((result_t[index].ac_balance)/10000).toFixed(0)
              
              result_t[index].ac_interest = utils.dataEmptyZero(result_t[index].ac_interest) == true?" ":((result_t[index].ac_interest)/10000).toFixed(1)
              result_t[index].isshow = 1

              // 银行列去除账号
              result_t[index].bk_sno_copy = result_t[index].bk_sno.split("*")[0]

              // 银行账号bank_accounts
              console.log(that.data.bk_sno)
              if(that.data.bk_sno == ''){
                let code = 0;
                for (let index1 = 1; index1 < xingzhiList.length+1; index1++) {
                  if(xingzhiList[index1] == result_t[index].bk_sno ){
                    code =1
                    break;
                  }
                }

                if(code == 0){
                  xingzhiList[index_xingzhi] = result_t[index].bk_sno
                  index_xingzhi++;
                }
              }
            }
            if(xingzhiList.length == 1){
              xingzhiList = that.data.xingzhiList
            }
            console.log(xingzhiList)
            console.log(result_t)
            that.setData({
              data_list:result_t,
              xingzhiList:xingzhiList
            })
        } else {
            console.log(data)
        }
    }).catch((e) => {
        console.log(e)
        // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },

    //切换账号
  xingzhiChange(e){
      let that = this
      let xingzhi_index = e.detail.value
      let xingzhiList = that.data.xingzhiList
      let bk_sno = ''
      if(xingzhi_index != 0){
        bk_sno = xingzhiList[xingzhi_index]
      }
      this.setData({
        xingzhi_index:e.detail.value,
        bk_sno:bk_sno
      })
      this.getCashDetail()
      
    } ,

  

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