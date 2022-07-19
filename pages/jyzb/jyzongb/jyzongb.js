// pages/jyzb/jyzongb/jyzongb.js
var app = getApp();
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    functionid: '4028808d80acc9c70180ad206ad9001a',
    select_index :0,
    co_no:'',
    c_name:'',
    ac_ym_s:'',
    ac_ym_e:'',
    date:'',
    date1:'',
    tbodyHeight:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this 
    that.setData({
      co_no:options.co_no,
      c_name:options.c_name,
      // ac_ym:options.date.replace("-", "/")
      ac_ym_s:options.date.replace("-", "/"),
      ac_ym_e:options.date1.replace("-", "/"),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight - 80 / 750 * res.windowWidth - 70;
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
    let that = this 
    that.getDataList()
  },

  getDataList:function () {
    let that = this
        // 获取接口
        let urlStr = app.config.apiUrl +"Interface_BusinessReport_Details";
        var timestamp = Date.parse(new Date());

        var date = new Date(timestamp);
        //获取年份  
        var Y =date.getFullYear();
        //获取月份  
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

        
        let params = {
            co_no:that.data.co_no,
            // ac_ym:that.data.ac_ym,
            // ac_ym_s:
            // ac_ym_e:
            ac_ym_s:that.data.ac_ym_s,
            ac_ym_e:that.data.ac_ym_e
        }
        params = JSON.stringify(params)
        // 请求数据
        app.server.postSoapRequest(urlStr,params,'Interface_BusinessReport_Details').then((data) => {
            console.log(data.data)
            if ( data.code == 100 ) {
                let list = data.data 
                let dataList = []
                let num = 0
                
                for (let index = 0; index < list.length; index++) {

                  if(list[index].item_name == "净利率" || list[index].item_name =="毛利率"){
                    list[index].ac_amt = parseFloat(list[index].ac_amt*100).toFixed(0);
                    list[index].ac_lamt = parseFloat(list[index].ac_lamt*100).toFixed(0);
                    list[index].ac_pamt = parseFloat(list[index].ac_pamt*100).toFixed(0);
                    
                  }else{
                    list[index].ac_amt = utils.dataEmptyZero(list[index].ac_camt) == true?" ":parseFloat(list[index].ac_amt).toFixed(0);
                    list[index].ac_lamt = utils.dataEmptyZero(list[index].ac_lamt) == true?" ":parseFloat(list[index].ac_lamt).toFixed(0);
                    list[index].ac_pamt = utils.dataEmptyZero(list[index].ac_pamt) == true?" ":parseFloat(list[index].ac_pamt).toFixed(0);
                  }
                  list[index].y_rr = parseFloat(list[index].y_rr).toFixed(0);
                  list[index].ac_rr = parseFloat(list[index].ac_rr).toFixed(0);
                  list[index].ac_lratio = parseFloat(list[index].ac_lratio).toFixed(0);
                  list[index].ac_pratio = parseFloat(list[index].ac_pratio).toFixed(0);

                  list[index].item_name1 = list[index].item_name.substring(0,4)
                  list[index].showMore = false

                  if(list[index].item_own == ''){
                    dataList[num] = list[index]
                    num++
                  }
                }

                for (let index1 = 0; index1 < dataList.length; index1++) {
                  let num_sub = 0
                  dataList[index1].subordinate = []
                  for (let index2 = 0; index2 < list.length; index2++) {
                    if(dataList[index1].item_no == list[index2].item_own){
                      dataList[index1].subordinate[num_sub] = list[index2]
                      num_sub++
                    }
                    
                  }
                  
                }

                // 赋值
                that.setData({
                    dataList:dataList,
                    // date:that.data.ac_ym.replace("/", "年")+'月'
                })
            } else {
                console.log(data)
            }


        }).catch((e) => {
            console.log(e)
            // console.log('获取数据错误 ====' + JSON.stringify(e))
        })
  },
  showMore(idx){
    let index = idx.currentTarget.dataset.idx
    let dataList = this.data.dataList
    // dataList[index].showMore = true
    wx.showModal({
      title: '项目',
      content: dataList[index].item_name,
      showCancel: false,
      confirmText: '返回',
      success: function (res) {
          if (res.confirm) {
              console.log('返回')
          }
        }
      })
    this.setData({
      dataList:dataList
    })
  },
  showMore2(e){
    let index = e.currentTarget.dataset.index
    let index2 = e.currentTarget.dataset.index2
    let dataList = this.data.dataList
    // dataList[index].subordinate[index2].showMore = true
    console.log(dataList[index].subordinate[index2].item_name)
    wx.showModal({
      title: '项目',
      content: dataList[index].subordinate[index2].item_name,
      showCancel: false,
      confirmText: '返回',
      success: function (res) {
          if (res.confirm) {
              console.log('返回')
          }
        }
      })
    this.setData({
      dataList:dataList
    })
  },
  selectClilck:function(e) {
    let that = this
    let idx = e.currentTarget.dataset.idx
    if(idx == that.data.select_index){
      idx = 9999
    }
    that.setData({
      select_index:idx
    })
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