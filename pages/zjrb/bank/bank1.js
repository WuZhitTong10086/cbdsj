
var utils = require('../../../utils/util.js');
var app = getApp();
let that
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
    yuanbiSelectStr:'0',
    od_id:'',
    accountList: ['请选择账号'],
    companyListTol:[],
    account_index: 0,
    bank_accounts:[""],
    account_index_tops:0,
    tbodyHeight: 0, //tbody滚动高度,
    tbodyWidth: 0   //左右滚动宽度
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
    that.getBankInfo()
    that.getCashDetail()
  },

  getBankInfo(){
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl +"Interface_Bank_Info";
    let params = {
      co_no:that.data.co_no,
    }
    let bank_accounts = [
      "全部"
    ]
    params = JSON.stringify(params)
    wx.showLoading('加载中...')
    // 请求数据
    app.server.postSoapRequest(urlStr,params,'Interface_Bank_Info').then((data) => {
        if ( data.code == 100 ) {
          let result = data.data

          for (let index = 1; index < result.length+1; index++) {
            bank_accounts[index] = result[index-1]['bk_no']
          }    

          console.log(bank_accounts)
          that.setData({
            bank_accounts:bank_accounts
          })
        } else {
            console.log(data)
        }

    }).catch((e) => {
        console.log(e)
        // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },

  //获取现金详情

  getCashDetail(){
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl +"Interface_Bank_Details";
    let date_part = 'd'
    if(that.data.date_type == 1){
      date_part = 'm'
    }
    let bk_no = ""
    if(that.data.bank_accounts[that.data.account_index] !='全部'){
      bk_no = that.data.bank_accounts[that.data.account_index]
    }
    

    let params = {
      co_no:that.data.co_no,
      date_part:date_part,
      bk_no:bk_no,
      currency_type:that.data._num
    }
    if(that.data.od_id !='0'){
      params.od_id = that.data.od_id
    }

    params = JSON.stringify(params)
    wx.showLoading('加载中...')

    // 请求数据
    app.server.postSoapRequest(urlStr,params,'Interface_Bank_Details').then((data) => {
        console.log(data)
        if ( data.code == 100 ) {
            // 赋值
            let result = data.data
            let result_t = []
            // let bank_accounts = []
            // let index_account = 1
            // bank_accounts[0] = '选择账号'
            for (let index = 0; index < result.length; index++) {
              result_t[index] = result[index]
              result_t[index].ac_date = result_t[index].ac_date.substring(0, 10);
              result_t[index].ac_camt = utils.dataEmptyZero(result_t[index].ac_camt) == true?" ":((result_t[index].ac_camt)/10000).toFixed(1)
              result_t[index].ac_damt = utils.dataEmptyZero(result_t[index].ac_damt) == true?" ":((result_t[index].ac_damt)/10000).toFixed(1)
              result_t[index].ac_balance = utils.dataEmptyZero(result_t[index].ac_balance) == true?" ":((result_t[index].ac_balance)/10000).toFixed(0)

              result_t[index].ac_camt1 = utils.dataEmptyZero(result_t[index].ac_camt1) == true?" ":((result_t[index].ac_camt1)/10000).toFixed(1)
              result_t[index].ac_damt1 = utils.dataEmptyZero(result_t[index].ac_damt1) == true?" ":((result_t[index].ac_damt1)/10000).toFixed(1)
              result_t[index].ac_balance1 = utils.dataEmptyZero(result_t[index].ac_balance1) == true?" ":((result_t[index].ac_balance1)/10000).toFixed(0)
              result_t[index].ac_remk1 = result_t[index].ac_remk.substring(0,10)
              result_t[index].showMore = false

              //选择账号是否显示
              result_t[index].isshow = 1
              
              // 银行账号bank_accounts
              // let code = 0;
              // for (let index1 = 1; index1 < bank_accounts.length+1; index1++) {
              //   if(bank_accounts[index1] == result_t[index].bk_no ){
              //     code ==1
              //     break;
              //   }
              // }
              // if(code == 0){
              //   bank_accounts[index_account] = result_t[index].ac_name
              //   index_account++;
              // }


            }

            that.setData({
              data_list:result_t,
              // bank_accounts:Array.from(new Set(bank_accounts))
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
  },
  showMore(idx){
    console.log(idx)
    let index = idx.currentTarget.dataset.idx
    let data_list = this.data.data_list
    data_list[index].showMore = true
    this.setData({
      data_list:data_list
    })
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
            yuanbiSelectStr:'0'
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
  //切换账号
  accountChange(e){
    console.log(e)
    let that = this
    let account_index = e.detail.value
    that.setData({
      account_index:account_index
    })
    // for (let index = 0; index < data.length; index++) {
    //   if(account_index != 0){
    //     if(data[index].ac_name == bank_accounts[account_index]){
    //       data[index].isshow = 1
    //     }else{
    //       data[index].isshow = 0
    //     }
    //   }else{
    //     data[index].isshow = 1
    //   }
      
    // }

    that.getCashDetail()
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