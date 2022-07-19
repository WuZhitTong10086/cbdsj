var wxCharts = require('../../../utils/wxcharts.js');
var utils = require('../../../utils/util.js');
var app = getApp();
var lineChart = null;
var jyzbChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type_name:'',
    colorIndex:0,
    select_index:0,
    functionid:'',
    selectOpen:["上月","当年"],
    _num:1,
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
    ind_code:'data_01',
    date_part:"02",
    ac_ym1:"",
    ac_ym2:"",
    endMonth1:"",
    endMonth2:"",
    bindDateChangeStatus:false,
    org_name:"",
    unit:"",
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
        org_name:options.org_name,
        functionid:options.functionid
    })
    wx.setNavigationBarTitle({
        title: this.data.titleList[options.code].title
    })

  },

//   switchChange(_ref) {
//     var currentTarget = _ref.currentTarget;
//     var tab = currentTarget.dataset.index;
//     this.setData({require_type:1})
//     if (tab == "0") {
//         this.setData({
//             _num:0,
//             date:this.data.dataList[this.data.dataList.length-1].ac_ym,
//             bindDateChangeStatus:false,
//         })  
//     } else {
//         this.setData({
//             _num:1,
//             date:"请选择年月",
//             bindDateChangeStatus:false
//         })
//     }

//     this.interface_BI_Details()
// },
  bindDateChange1: function(e) {
          
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date_part:"01",
      ac_ym1:e.detail.value
    })

    this.interface_BI_Details()
  },
  bindDateChange2: function(e) {
      
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date_part:"01",
      ac_ym2:e.detail.value
    })

    this.interface_BI_Details()
  },

    interface_BI_Details:function (e) {
        let that = this
        // 获取接口
        let urlStr = app.config.apiUrl +"Interface_BI_Details";

        let params = {}
        if(that.data.date_part == "01"){
            params = {
              company_no:that.data.co_no,
              date_part:that.data.date_part,
              data_code:that.data.code,
              ac_ym1:that.data.ac_ym1,
              ac_ym2:that.data.ac_ym2
            }
        }else{
              params = {
                company_no:that.data.co_no,
                date_part:that.data.date_part,
                data_code:that.data.code,
            }
        }
        
        
        params = JSON.stringify(params)
        console.log(params)
        console.log("加载中")
        wx.showLoading('加载中...')
        // 请求数据
        app.server.postSoapRequest(urlStr,params,'Interface_BI_Details').then((data) => {
          console.log(data)
            if ( data.code == 100 ) {
                let dataList = data.data
                for (let index = 0; index < dataList.length; index++) {
                    if(dataList[index].item_own == ""){
                        dataList[index]["have_a_lower"] = false
                        for (let i = 0; i < dataList.length; i++) { 
                            if(dataList[index].type_no === dataList[i].item_own){
                                dataList[index]["have_a_lower"] = true
                            }
                        }  
                    }
                  dataList[index].data_02 = utils.dataEmptyZero(dataList[index].data_02) == true?" ":parseFloat(dataList[index].data_02).toFixed(2)

                  dataList[index].data_03 = utils.dataEmptyZero(dataList[index].data_03) == true?" ":parseFloat(dataList[index].data_03).toFixed(0)+"%"
                  dataList[index].data_y2y = utils.dataEmptyZero(dataList[index].data_y2y) == true?" ":parseFloat(dataList[index].data_y2y).toFixed(0)+"%"
                  dataList[index].data_m2m = utils.dataEmptyZero(dataList[index].data_m2m) == true?" ":parseFloat(dataList[index].data_m2m).toFixed(0)+"%"
                  dataList[index].ac_ym1 = dataList[index].ac_ym1.replace("/", "-")
                  dataList[index].ac_ym2 = dataList[index].ac_ym2.replace("/", "-")

                  if(dataList[index].type_name =="毛利率" || dataList[index].type_name =="净利润率"){
                    dataList[index].data_01 = (dataList[index].data_01 * 100).toFixed(0)+"%"
                  }else{
                    dataList[index].data_01 = utils.dataEmptyZero(dataList[index].data_01) == true?" ":parseFloat(dataList[index].data_01).toFixed(0)
                  }

                }

                // 赋值
                let data_code = ""
                let type_name = ""
                if(dataList[0]!=undefined) data_code= dataList[0].type_no,type_name = dataList[0].type_name

                if(that.data.date_part == '02' && dataList.length!=0){
                  that.setData({
                    endMonth1:dataList[0].ac_ym1,
                    endMonth2:dataList[0].ac_ym2,
                    ac_ym1:dataList[0].ac_ym1,
                    ac_ym2:dataList[0].ac_ym2
                  })
                }

                that.setData({
                    dataList:dataList,
                    data_code:data_code,
                    type_name:type_name
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
        // 图片路径赋值为空，用于重新生成图片
        that.setData({
          jyzbChartImagePath: null,
        })
        // 获取接口
        let urlStr = app.config.apiUrl +"Interface_BI_Balance";

        let date = new Date();
        var Y =date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

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
                    jyzbIndexTableList:list,
                    unit:unit
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
            data_code: this.data.dataList[e.currentTarget.dataset.id].type_no,
            type_name: this.data.dataList[e.currentTarget.dataset.id].type_name
        })
        var item_own = this.data.dataList[e.currentTarget.dataset.id].item_own
        if (item_own === ''){
            this.ChangeState(e)
        }
        this.ChangeColor(e)
        this.Interface_BI_Balance()
    },
    ChangeColor(e){
        let idx = e.currentTarget.dataset.id
         this.setData({
            colorIndex:idx
        })
        console.log(this.data.colorIndex)
    },
    ChangeState(e){
        let idx = e.currentTarget.dataset.id
        let that = this.data
        if(idx == that.select_index){
            idx = 9999
        }
        this.setData({
            select_index:idx
        })
        console.log(that.select_index)
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