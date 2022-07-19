// pages/jyzb/jyzb.js
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
var jyzbChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    functionid:'',
    selectOpen:["上月","当年"],
    _num:0,
    date: '请选择年月',
    titleList:{
        '01':{
            'title':'PCB收入',
        },
        '02':{
            'title':'客户收入',
        },
        '03':{
            'title':'板材收入',
        },
        '04':{
            'title':'其它收入',
        },
        '05':{
            'title':'板材成本',
        },
        '06':{
            'title':'加工成本',
        },
        '07':{
            'title':'物料成本',
        },
        '08':{
            'title':'生产成本',
        },
        '09':{
            'title':'业务费用',
        },
        '10':{
            'title':'管理费用',
        },
        '11':{
            'title':'财务费用',
        },
        '12':{
            'title':'其它费用',
        },
        '13':{
            'title':'公司盈利',
        },
    },
    code:'01',
    dataList:[],
    blue_active_index:0,
    zhiexianData:[],
    jyzbIndexTableList:[],
    ind_code:'data01',
    require_type:1,
    bindDateChangeStatus:false,
        
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
        code:options.code,
        co_no:options.co_no,
        functionid:options.functionid
    })
    wx.setNavigationBarTitle({
        title: this.data.titleList[options.code].title
    })

  },

    switchChange(_ref) {
        var currentTarget = _ref.currentTarget;
        var tab = currentTarget.dataset.index;
        this.setData({require_type:1})
        if (tab == "0") {
            this.setData({
                _num:0,
                bindDateChangeStatus:false,
            })  
        } else {
            this.setData({
                _num:1,
                bindDateChangeStatus:false
            })
        }

        this.interface_BI_Details()
    },
    bindDateChange: function(e) {
        
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        date: e.detail.value,
        require_type:2,
        blue_active_index:0,
        _num:2,
        bindDateChangeStatus:true
      })

      this.interface_BI_Details(e.detail.value)
    },

    interface_BI_Details:function (e) {
        let that = this
        // 获取接口
        let urlStr = app.config.apiUrl +"Interface_BI_Details";

        let date_part = '01'
        if(that.data._num == 1){
            date_part = '02'
        }

        let ac_ym = '';
        if(that.data.date != '请选择年月'){
            ac_ym = that.data.date
        }
        let params  = []
        if(that.data.require_type == 1){
             params = {
                co_no:that.data.co_no,
                date_part:date_part,
                code:that.data.code,
                ac_ym:''
            }
        }else{
             params = {
                co_no:that.data.co_no,
                date_part:'',
                code:that.data.code,
                ac_ym:ac_ym
            }
        }
        
        
        params = JSON.stringify(params)

        wx.showLoading('加载中...')
        // 请求数据
        app.server.postSoapRequest(urlStr,params,'Interface_BI_Details').then((data) => {
            console.log(data)
            console.log("Interface_BI_Details")
            if ( data.code == 100 ) {
                let dataList = data.data
                for (let index = 0; index < dataList.length; index++) {
                    dataList[index].data01 =  (parseFloat((dataList[index].data01)).toFixed(0))!=0?parseFloat((dataList[index].data01)).toFixed(0):'0'
                    if(that.data.code != '01'){
                        dataList[index].data02 = (parseFloat((dataList[index].data02)).toFixed(0))!=0?parseFloat((dataList[index].data02)).toFixed(0):'0'
                    }
                    dataList[index].data03 = (parseFloat((dataList[index].data03)).toFixed(0))!=0?parseFloat((dataList[index].data03)).toFixed(0):'0'
                }

                // 赋值
                let data_code = ""
                if(dataList[0]!=undefined) data_code= dataList[0].data_code
                that.setData({
                    dataList:dataList,
                    data_code:data_code
                })

                that.Interface_BI_Balance()
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
    Interface_BI_Balance:function (e) {
        let that = this
        // 获取接口
        let urlStr = app.config.apiUrl +"Interface_BI_Balance";

        // console.log('1111111111111')
        // console.log(that.data.dataList)
        let params = {
            co_no:that.data.co_no,
            code:that.data.code,
            data_code:that.data.data_code,
            ind_code:that.data.ind_code,
        }
        
        params = JSON.stringify(params)

        wx.showLoading('加载中...')
        // 请求数据
        app.server.postSoapRequest(urlStr,params,'Interface_BI_Balance').then((data) => {
            if ( data.code == 100 ) {
                let list = data.data
                console.log(list)
                // // 赋值
                for (let index = 0; index < list.length; index++) {
                    list[index].ac_01 = (parseFloat((list[index].ac_01)).toFixed(0))!=0?parseFloat((list[index].ac_01)).toFixed(0):'0'
                    list[index].ac_02 = (parseFloat((list[index].ac_02)).toFixed(0))!=0?parseFloat((list[index].ac_02)).toFixed(0):'0'
                    list[index].ac_03 = (parseFloat((list[index].ac_03)).toFixed(0))!=0?parseFloat((list[index].ac_03)).toFixed(0):'0'
                    list[index].ac_04 = (parseFloat((list[index].ac_04)).toFixed(0))!=0?parseFloat((list[index].ac_04)).toFixed(0):'0'
                    list[index].ac_05 = (parseFloat((list[index].ac_05)).toFixed(0))!=0?parseFloat((list[index].ac_05)).toFixed(0):'0'
                    list[index].ac_06 = (parseFloat((list[index].ac_06)).toFixed(0))!=0?parseFloat((list[index].ac_06)).toFixed(0):'0'
                    list[index].ac_07 = (parseFloat((list[index].ac_07)).toFixed(0))!=0?parseFloat((list[index].ac_07)).toFixed(0):'0'
                    list[index].ac_08 = (parseFloat((list[index].ac_08)).toFixed(0))!=0?parseFloat((list[index].ac_08)).toFixed(0):'0'
                    list[index].ac_09 = (parseFloat((list[index].ac_09)).toFixed(0))!=0?parseFloat((list[index].ac_09)).toFixed(0):'0'
                    list[index].ac_10 = (parseFloat((list[index].ac_10)).toFixed(0))!=0?parseFloat((list[index].ac_10)).toFixed(0):'0'
                    list[index].ac_11 = (parseFloat((list[index].ac_11)).toFixed(0))!=0?parseFloat((list[index].ac_11)).toFixed(0):'0'
                    list[index].ac_12 = (parseFloat((list[index].ac_12)).toFixed(0))!=0?parseFloat((list[index].ac_12)).toFixed(0):'0'
                    list[index].ac_total = parseInt(list[index].ac_01) +parseInt(list[index].ac_02) +parseInt(list[index].ac_03) +parseInt(list[index].ac_04) +parseInt(list[index].ac_05) +parseInt(list[index].ac_06) +parseInt(list[index].ac_07) +parseInt(list[index].ac_08) +parseInt(list[index].ac_09) +parseInt(list[index].ac_10) +parseInt(list[index].ac_11) +parseInt(list[index].ac_12) 
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
            data_code: this.data.dataList[e.currentTarget.dataset.id].data_code
        })
        
        this.Interface_BI_Balance()
    },
    changeDataCode(e){
        let ind_code = e.currentTarget.dataset.code
        this.setData({
            ind_code:ind_code
        })

        this.Interface_BI_Balance()
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
    this.interface_BI_Details()
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
    if(jyzbIndexTableList.length <1)return
    for (let index = 0; index < jyzbIndexTableList.length; index++) {
        dataList[index] = {
            name: jyzbIndexTableList[index].ac_yy,
            type: 'line',
            smooth: true,
            data: [jyzbIndexTableList[index].ac_01, jyzbIndexTableList[index].ac_02, jyzbIndexTableList[index].ac_03, jyzbIndexTableList[index].ac_04, jyzbIndexTableList[index].ac_05, jyzbIndexTableList[index].ac_06, jyzbIndexTableList[index].ac_07,jyzbIndexTableList[index].ac_08,jyzbIndexTableList[index].ac_09,jyzbIndexTableList[index].ac_10,jyzbIndexTableList[index].ac_11,jyzbIndexTableList[index].ac_12]
        }

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
            disableGrid: true
        },
        yAxis: {
            // title: '成交金额 (万元)',
            // format: function (val) {
            //     return val.toFixed(2);
            // },
            min: 0
        },
        width: windowWidth,
        height: 200,
        dataLabel: false,
        dataPointShape: true,
        extra: {
            // lineStyle: 'curve'
        }
    });
    
 }
})