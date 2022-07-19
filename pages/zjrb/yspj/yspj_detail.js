// pages/zjrb/yspj/yspj_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

     
    that.setData({
      ar_docu : options.ar_docu,
      ar_nature : options.ar_nature,
      od_id : options.od_id,
      ac_damt : options.ac_damt,
      ar_damt : options.ar_damt,
      ar_camt : options.ar_camt,
      ar_jamt : options.ar_jamt,
      ar_cph : options.ar_cph,
      ar_exp_date : options.ar_exp_date,
      ar_income_obj : options.ar_income_obj.replace(/(^\s*)|(\s*$)/g, ""),
      pay_date : options.pay_date,
      ar_pay_obj : options.ar_pay_obj,
      ar_rec_date:options.ar_rec_date,
      co_name:options.co_name,
      ar_drawer:options.ar_drawer,
      ar_iss_date:options.ar_iss_date,
      od_id:options.od_id,
      ar_taker:options.ar_taker,
      bk_name:options.bk_name,
    })
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
  onShareAppMessage: function () {

  }
})