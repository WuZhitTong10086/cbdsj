var wxCharts = require('../../utils/wxcharts.js');
var utils = require('../../utils/util.js');
var app = getApp();
var lineChart = null;
var jyzbChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    functionid:'', //菜单id
    _num:1,
    date: '请选择年月',
    code:'01',
    dataList:[],
    blue_active_index:0,
    zhiexianData:[],
    jyzbIndexTableList:[],
    ind_code:'data_01',
    date_part:"02",
    endMonth1:"",
    endMonth2:"",
    bindDateChangeStatus:false,
    org_name:"",
    item_no:"",
    ac_ym:"",
    unit:"万元"
  },
  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
        categories.push('      0' + (i + 1));
        data.push(Math.random()*(20-10)+10);
    }
    // data[4] = null;
    return {
        categories: categories,
        data: data
    }
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
        co_no:options.org_code,
        org_name:options.org_name,
        item_no:options.item_no
    })
    wx.setNavigationBarTitle({
        title: options.title
    })

  },

  bindDateChange1: function(e) {
        
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        date_part:"01",
        ac_ym:e.detail.value
      })

      this.Interface_Assets_IndexDetails()
    },


    Interface_Assets_IndexDetails:function (e) {
        let that = this
        // 获取接口
        let urlStr = app.config.apiUrl +"Interface_Assets_IndexDetails";

        let params  = []
        params = {
          co_no:that.data.co_no,
          ac_ym:that.data.ac_ym,
          index_code:that.data.item_no,
      }

        
        
        params = JSON.stringify(params)
        console.log(params)
        console.log("加载中")
        wx.showLoading('加载中...')
        // 请求数据
        app.server.postSoapRequest(urlStr,params,'Interface_Assets_IndexDetails').then((data) => {
          console.log(data)
            if ( data.code == 100 ) {
                let dataList = data.data
                for (let index = 0; index < dataList.length; index++) {
                  dataList[index].ac_amt = utils.dataEmptyZero(dataList[index].ac_amt) == true?" ":parseFloat(dataList[index].ac_amt).toFixed(0)

                  dataList[index].ac_lamt = utils.dataEmptyZero(dataList[index].ac_lamt) == true?" ":parseFloat(dataList[index].ac_lamt).toFixed(0)

                  dataList[index].ac_pamt = utils.dataEmptyZero(dataList[index].ac_pamt) == true?" ":parseFloat(dataList[index].ac_pamt).toFixed(0)

                  // dataList[index].data_03 = utils.dataEmptyZero(dataList[index].data_03) == true?" ":parseFloat(dataList[index].data_03).toFixed(0)+"%"
                  // dataList[index].data_y2y = utils.dataEmptyZero(dataList[index].data_y2y) == true?" ":parseFloat(dataList[index].data_y2y).toFixed(0)+"%"
                  // dataList[index].data_m2m = utils.dataEmptyZero(dataList[index].data_m2m) == true?" ":parseFloat(dataList[index].data_m2m).toFixed(0)+"%"

                  dataList[index].ac_ym = dataList[index].ac_ym.replace("/", "-")
                  // dataList[index].ac_ym2 = dataList[index].ac_ym2.replace("/", "-")

                }

                // 赋值
                let data_code = ""
                if(dataList[0]!=undefined) data_code= dataList[0].item_name
                if(that.data.date_part == '02' && dataList.length!=0){
                  that.setData({
                    endMonth:dataList[0].ac_ym,
                    ac_ym:dataList[0].ac_ym,
                  })
                }
                that.setData({
                    dataList:dataList,
                    data_code:data_code
                })

                that.Interface_Assets_IndexSummary()
            } else {
                console.log(data)
            }
            wx.showToast({
                title: '数据加载完成',//提示文字
                duration:1000,//显示时长
                mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false  
             })
        }).catch((e) => {
            console.log(e)
            // console.log('获取数据错误 ====' + JSON.stringify(e))
        })
    },

    //获取下半数据
    Interface_Assets_IndexSummary:function (e) {
        let that = this
        // 图片路径赋值为空，用于重新生成图片
        that.setData({
          jyzbChartImagePath: null,
        })
        // 获取接口
        let urlStr = app.config.apiUrl +"Interface_Assets_IndexSummary";

        let params = {
            co_no:that.data.co_no,
            ac_ym:that.data.ac_ym,
            index_code:that.data.item_no,
            item_name:that.data.data_code,
            item_index:that.data.ind_code
        }
        
        params = JSON.stringify(params)

        wx.showLoading('加载中...')
        // 请求数据
        app.server.postSoapRequest(urlStr,params,'Interface_Assets_IndexSummary').then((data) => {
            if ( data.code == 100 ) {
                let list = data.data
                console.log(list)
                let date = new Date();
                var Y =date.getFullYear();
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

                // // 赋值
                for (let index = 0; index < list.length; index++) {
                  
                    list[index].ac_01 = (parseFloat((list[index].ac_01?list[index].ac_01:0)).toFixed(0))!=0?parseFloat((list[index].ac_01)).toFixed(0):0
                    list[index].ac_02 = (parseFloat((list[index].ac_02?list[index].ac_02:0)).toFixed(0))!=0?parseFloat((list[index].ac_02)).toFixed(0):0
                    list[index].ac_03 = (parseFloat((list[index].ac_03?list[index].ac_03:0)).toFixed(0))!=0?parseFloat((list[index].ac_03)).toFixed(0):0
                    list[index].ac_04 = (parseFloat((list[index].ac_04?list[index].ac_04:0)).toFixed(0))!=0?parseFloat((list[index].ac_04)).toFixed(0):0
                    list[index].ac_05 = (parseFloat((list[index].ac_05?list[index].ac_05:0)).toFixed(0))!=0?parseFloat((list[index].ac_05)).toFixed(0):0
                    list[index].ac_06 = (parseFloat((list[index].ac_06?list[index].ac_06:0)).toFixed(0))!=0?parseFloat((list[index].ac_06)).toFixed(0):0
                    list[index].ac_07 = (parseFloat((list[index].ac_07?list[index].ac_07:0)).toFixed(0))!=0?parseFloat((list[index].ac_07)).toFixed(0):0
                    list[index].ac_08 = (parseFloat((list[index].ac_08?list[index].ac_08:0)).toFixed(0))!=0?parseFloat((list[index].ac_08)).toFixed(0):0
                    list[index].ac_09 = (parseFloat((list[index].ac_09?list[index].ac_09:0)).toFixed(0))!=0?parseFloat((list[index].ac_09)).toFixed(0):0
                    list[index].ac_10 = (parseFloat((list[index].ac_10?list[index].ac_10:0)).toFixed(0))!=0?parseFloat((list[index].ac_10)).toFixed(0):0
                    list[index].ac_11 = (parseFloat((list[index].ac_11?list[index].ac_11:0)).toFixed(0))!=0?parseFloat((list[index].ac_11)).toFixed(0):0
                    list[index].ac_12 = (parseFloat((list[index].ac_12?list[index].ac_12:0)).toFixed(0))!=0?parseFloat((list[index].ac_12)).toFixed(0):0
                    
                    list[index].ac_mave =  (parseFloat((list[index].ac_mave?list[index].ac_mave:0)).toFixed(0))!=0?parseFloat((list[index].ac_mave)).toFixed(0):0
                   
                    list[index].ac_total = parseInt(list[index].ac_01) +parseInt(list[index].ac_02) +parseInt(list[index].ac_03) +parseInt(list[index].ac_04) +parseInt(list[index].ac_05) +parseInt(list[index].ac_06) +parseInt(list[index].ac_07) +parseInt(list[index].ac_08) +parseInt(list[index].ac_09) +parseInt(list[index].ac_10) +parseInt(list[index].ac_11) +parseInt(list[index].ac_12) 
                
                    if(list[index].ac_yy == Y ){
                      list[index].ac_01 = (M<=1)?null:list[index].ac_01
                      list[index].ac_02 = (M<=2)?null:list[index].ac_02
                      list[index].ac_03 = (M<=3)?null:list[index].ac_03
                      list[index].ac_04 = (M<=4)?null:list[index].ac_04
                      list[index].ac_05 = (M<=5)?null:list[index].ac_05
                      list[index].ac_06 = (M<=6)?null:list[index].ac_06
                      list[index].ac_07 = (M<=7)?null:list[index].ac_07
                      list[index].ac_08 = (M<=8)?null:list[index].ac_08
                      list[index].ac_09 = (M<=9)?null:list[index].ac_09
                      list[index].ac_10 = (M<=10)?null:list[index].ac_10
                      list[index].ac_11 = (M<=11)?null:list[index].ac_11
                      list[index].ac_12 = (M<=12)?null:list[index].ac_12

                      list[index].ac_01 = (list[index].ac_01 == '0')?null:list[index].ac_01
                      list[index].ac_02 = (list[index].ac_02 == '0')?null:list[index].ac_02
                      list[index].ac_03 = (list[index].ac_03 == '0')?null:list[index].ac_03
                      list[index].ac_04 = (list[index].ac_04 == '0')?null:list[index].ac_04
                      list[index].ac_05 = (list[index].ac_05 == '0')?null:list[index].ac_05
                      list[index].ac_06 = (list[index].ac_06 == '0')?null:list[index].ac_06
                      list[index].ac_07 = (list[index].ac_07 == '0')?null:list[index].ac_07
                      list[index].ac_08 = (list[index].ac_08 == '0')?null:list[index].ac_08
                      list[index].ac_09 = (list[index].ac_09 == '0')?null:list[index].ac_09
                      list[index].ac_10 = (list[index].ac_10 == '0')?null:list[index].ac_10
                      list[index].ac_11 = (list[index].ac_11 == '0')?null:list[index].ac_11
                      list[index].ac_12 = (list[index].ac_12 == '0')?null:list[index].ac_12

                    }  
                }

                let unit = "万元"
                if(list[0].data_name == '毛利率' ||  list[0].data_name == '净利润率'){
                  unit = "百分比"
                }  

                that.setData({
                    jyzbIndexTableList:list
                })

                that.getJyzbOption()

            } else {
                console.log(data)
            }
 
        }).catch((e) => {
            console.log(e)
            // console.log('获取数据错误 ====' + JSON.stringify(e))
        })

        wx.showToast({
            title: '数据加载完成',//提示文字
            duration:1000,//显示时长
            mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false  
         })
    },    

    selectTjIndex(e){
        this.setData({
            blue_active_index:e.currentTarget.dataset.id,
            data_code: this.data.dataList[e.currentTarget.dataset.id].item_name
        })
        
        this.Interface_Assets_IndexSummary()
    },
    changeDataCode(e){
        let ind_code = e.currentTarget.dataset.code
        let unit = "万元"
        if(ind_code == "data_03"){
          unit = "百分比"
        }
        this.setData({
            ind_code:ind_code,
            unit:unit
        })

        this.Interface_Assets_IndexSummary()
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
    this.Interface_Assets_IndexDetails()
    // this.Interface_BI_Balance()
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

  },

//   获取折线图
getJyzbOption:function () {
    let that = this
    let jyzbIndexTableList = that.data.jyzbIndexTableList
    let dataList = []
    let date = new Date();
      var Y =date.getFullYear();
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    if(jyzbIndexTableList.length <1)return
    for (let index = 0; index < jyzbIndexTableList.length; index++) {
        dataList[index] = {
            name: jyzbIndexTableList[index].ac_yy,
            type: 'line',
            smooth: true,
            data: [jyzbIndexTableList[index].ac_01, jyzbIndexTableList[index].ac_02, jyzbIndexTableList[index].ac_03, jyzbIndexTableList[index].ac_04, jyzbIndexTableList[index].ac_05, jyzbIndexTableList[index].ac_06, jyzbIndexTableList[index].ac_07,jyzbIndexTableList[index].ac_08,jyzbIndexTableList[index].ac_09,jyzbIndexTableList[index].ac_10,jyzbIndexTableList[index].ac_11,jyzbIndexTableList[index].ac_12]
        }

        if(jyzbIndexTableList[index].ac_yy == Y ){
          dataList[index].data[0] = (M<=1)?null:dataList[index].data[0]
          dataList[index].data[1] = (M<=2)?null:dataList[index].data[1]
          dataList[index].data[2] = (M<=3)?null:dataList[index].data[2]
          dataList[index].data[3] = (M<=4)?null:dataList[index].data[3]
          dataList[index].data[4] = (M<=5)?null:dataList[index].data[4]
          dataList[index].data[5] = (M<=6)?null:dataList[index].data[5]
          dataList[index].data[6] = (M<=7)?null:dataList[index].data[6]
          dataList[index].data[7] = (M<=8)?null:dataList[index].data[7]
          dataList[index].data[8] = (M<=9)?null:dataList[index].data[8]
          dataList[index].data[9] = (M<=10)?null:dataList[index].data[9]
          dataList[index].data[10] = (M<=11)?null:dataList[index].data[10]
          dataList[index].data[11] = (M<=12)?null:dataList[index].data[11]

          
      }

      dataList[index].data[0] = (dataList[index].data[0] == "")?null:dataList[index].data[0]
      dataList[index].data[1] = (dataList[index].data[1] == "")?null:dataList[index].data[1]
      dataList[index].data[2] = (dataList[index].data[2] == "")?null:dataList[index].data[2]
      dataList[index].data[3] = (dataList[index].data[3] == "")?null:dataList[index].data[3]
      dataList[index].data[4] = (dataList[index].data[4] == "")?null:dataList[index].data[4]
      dataList[index].data[5] = (dataList[index].data[5] == "")?null:dataList[index].data[5]
      dataList[index].data[6] = (dataList[index].data[6] == "")?null:dataList[index].data[6]
      dataList[index].data[7] = (dataList[index].data[7] == "")?null:dataList[index].data[7]
      dataList[index].data[8] = (dataList[index].data[8] == "")?null:dataList[index].data[8]
      dataList[index].data[9] = (dataList[index].data[9] == "")?null:dataList[index].data[9]
      dataList[index].data[10] = (dataList[index].data[10] == "")?null:dataList[index].data[10]
      dataList[index].data[11] = (dataList[index].data[11] == "")?null:dataList[index].data[11]

    }


    var windowWidth = 320;
    try {
        var res = wx.getSystemInfoSync();
        windowWidth = res.windowWidth;
    } catch (e) {
        console.error('getSystemInfoSync failed!');
    }

    
    jyzbChart = new wxCharts({
        canvasId: 'jyzbChart',
        type: 'line',
        categories: ['01','02','03','04','05','06','07','08','09','10','11','12'],
        animation: true,
        legend:false,
        // background: '#f5f5f5',
        series: dataList,
        // [
            
        //     {
        //         name: '2',
        //         data: [2, 0, 0, 3, 5, 4, 0, 0, 2, 0],
        //         format: function (val, name) {
        //             return val.toFixed(2) + '万';
        //         }
        //     }
    
        // ],
        xAxis: {
          fontColor:'#000000',
          disableGrid: true
        },
        yAxis: {
            // title: '成交金额 (万元)',
            // format: function (val) {
            //     return val.toFixed(2);
            // },
            fontColor:'#000000',
            min: 0
        },
        width: windowWidth,
        height: 165,
        dataLabel: false,
        dataPointShape: true,
        extra: {
            // lineStyle: 'curve'
        }
    });

    setTimeout(function() {
      wx.canvasToTempFilePath({
        x:0,y:0,
        canvasId: 'jyzbChart',
        success: function(res) {
            var tempFilePath = res.tempFilePath;
            that.setData({
                jyzbChartImagePath: tempFilePath,
            });
        },
        fail: function(res) {
            console.log(res);
        }
      })
    }, 1000);
    
 }
})