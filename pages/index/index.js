var wxCharts = require('../../utils/wxcharts.js');
import * as echarts from '../../ec-canvas/echarts';
var utils = require('../../utils/util.js');
var app = getApp();
var lineChart = null;
var jyzbChart = null;
var columnChart = null;
var zczbChart = null;
let that
let chart = null;
Page({
  data: {
    ec: {
      lazyLoad: true // 延迟加载
    },
    barChart: true,
    seriesDataList: '',
    functionid: '',
    bfb: "",
    browseData: [],
    jyzbChartImagePath: '',
    browseShow: false,
    browseShowId: 0,
    fxbgTipshow: false,
    tipsSelectName: "",
    top_menu: 1,

    date_part: 'd',
    sjsm_status: false,
    jyzbType: false,
    zczbTypeShow: false,
    zczbType: false,
    selectOpen: ["昨日", "当月"],
    _num: 0,
    companyList: [],
    companyListTol: [],
    jyzbLbSelectId: 0,
    zjrb_index: 0,
    jyzb_index: 0,
    cwzb_index: 0,
    cIndex: 0, // 当前公司数组下标
    company: ['合通机构', '总部', '互单互联', '国盈工厂', '合伙人', '国盈合并表'], // 公司
    NrJcData: {
      ar_jamt: 0,
      ar_damt: 0,
      ar_camt: 0
    },
    NpJcData: {
      ar_jamt: 0,
      ar_damt: 0,
      ar_camt: 0
    },
    loanJcData: [],
    bankjcData: {
      ac_camt1: 0,
      ac_damt1: 0,
      ac_balance1: 0
    },
    cashjcData: {
      ac_camt1: 0,
      ac_damt1: 0,
      ac_balance1: 0
    },
    FundBalanceData: {
      Cash: {
        ac_camt1: 0,
        ac_damt1: 0,
        ac_balance1: 0
      },
      Bank: {
        ac_camt1: 0,
        ac_damt1: 0,
        ac_balance1: 0
      },
      AR: {
        ac_camt1: 0,
        ac_damt1: 0,
        ac_balance1: 0
      },
      Fund: {
        ac_camt1: 0,
        ac_damt1: 0,
        ac_balance1: 0
      }
    },
    //   折线图
    //   经营总报
    jyzbCompanyListTol: [],
    jyzbCompanyList: [],
    jyzbLbData: [],
    jyzbLbSelectIdx: '',
    jyzbLbSelectName: '',
    jyzbIndexList: [],
    jyzbIndexTableList: [],
    jyzbCompanySelectCoNo: '',

    jyzbSelectDl2List: [],// 经营总报筛选分类数据
    jyzbSortList: [],
    jyzbSortList1: ["总收入", "总支出", "毛利额", "净利润额"],

    zczb_select_l_active: 0,
    jyzbDate: '',
    jyzbDate1: '',
    jyzbDateStr: "开始日期",
    jyzbDateStr1: "结束日期",
    jyzbDateEnd: "",
    jyzbDateEnd1: "",

    //资产总报
    zczbDate: '',
    zczbDateEnd: '',
    zczbDateStr: '',
    zczbIndexList: [],
    zczbLbData: [],
    zczbLbSelectId: '',
    zczbLbSelectIdx: '',
    zczbLbSelectName: '',
    zczbCompanySelectCoNo: '',
    zIndex: 0,
    zczbCompanyListTol: [],
    zczbCompanyList: [],
    zczbIndexTableList: [],

    zczbSelectDl2List: [],// 经营总报筛选分类数据
    zczbSortList: [],
    zczbSortList1: ["货币资金", "固定资金", "短期借款", "长期借款", "股本"],

    zczbSortListType: ['流动资产', '非流动资产', '流动负债', '非流动负债', '所有者权益'],
    jyzbSortListType: ["收入", "支出", "毛利", "利润"],

    // 财务指标
    companyCwzbList: [],
    companyCwzbListTol: [],


    // 分析报告
    fxbgLbData: [],
    fxbg_menu: 0,
    fxbg_item_no: "",
    fxbgYearData: {},
    xjllSelectMonthIndex: 11,
    xjllpjDate: "",
    fxbgDate1: "",
    fxbgDate2: "",
    xjllpjData: "",
    zjllCategories: "",
    xjllData: [],
    xjllLeftpjData: "",
    xjllpjData: [],
    xjllpjDate1: [],
    checkIndex : 11,//点击柱子的index 有初始默认值
    // 提示窗口数据
    tipsData: [
      { 'name': "存货周转率", tips: "存货1年周转次数，周转次数越高，存货销售周期越短。" },
      { 'name': "应收账款周转率", tips: "即应收账款1年周转的次数，周转次数越高，应收回款周期越短，企业的标准值一般设置为3。" },
      { 'name': "总资产周转率", tips: "即总资产1年周转的次数，反映1天销售收入需要多少资产。" },
      { 'name': "流动比率", tips: "反映公司流动资产偿还流动负债的能力，一般来说流动比率应在2:1以上，流动资产比流动负债越高，公司偿债压力越小。" },
      { 'name': "速动比率", tips: "速动资产是剔除难以变现的存货、预付款等,将可偿债资产减去流动负债，传统经验认为，速动比率维持在1:1较为正常，这个指标体现公司的偿债能力更可靠。" },
      { 'name': "资产负债率", tips: "反映总资产中有多少比例是通过负债取得的，资产负债率越低，债权人越有保障。这一比率越低(50%以下)，表明企业的偿债能力越强。" },
      { 'name': "产权比率", tips: "反映1元负债对应的所有者权益，比率越低，表明企业长期偿债能力越强，债权人权益保障程度越高，承担的风险越小，一般认为这一比率为1：1。" },
      { 'name': "利息保障系数", tips: "表明1元利息费用有多少倍的利润作保障，反映偿还利息及本金的能力。" },
      { 'name': "销售净利率", tips: "净利润占销售收入的比率，该比率越大，盈利越强。" },
      { 'name': "净资产收益率", tips: "反映股东投入的利润率，概括了企业的全部经营业绩和财务业绩。" },
      { 'name': "总资产净利率", tips: "反映1元总资产创造的净利润，包含债权人和股东的收益。" },
      { 'name': "经营活动产生的现金流量净额", tips: "经营净收益 + 非付现费用 - 经营资产净增加 - 无息负债净减少" },
      { 'name': "筹资活动产生的现金流量净额", tips: "吸收投资所收到的现金 + 借款收到的现金 + 收到其他与筹资活动有关的现金 - 偿还债务所支付的现金 - 分配股利、利润或偿付利息所支付的现金 - 支付的其他与筹资活动有关的现金。" },
      { 'name': "投资活动产生的现金流量净额", tips: "收回投资所收到的现金 + 取得投资收益所收到的现金 + 处置固定资产、无形资产和其他长期资产所收回的现金净额 + 收到的其他与投资活动有关的现金 - 购建固定资产、无形资产和其他长期资产所支付的现金。" },
      { 'name': "现金及现金等价物净增加额", tips: "现金的期末余额-现金的期初余额。" },
    ],
    //评分标准
    scoreList: [
      { 'name': "存货周转率", level: [">9", "6-9", "5-6", "4-5", "<4"] },
      { 'name': "应收账款周转率", level: [">4.5", "3.5-4.5", "3.0-3.5", "2.5-3.0", "<2.5"] },
      { 'name': "总资产周转率", level: [">1.0", "0.9-1.0", "0.8-0.9", "0.7-0.8", "<0.7"] },
      { 'name': "流动比率", level: [">2.2", "1.7-2.2", "1.4-1.7", "1.1-1.4", "<1.1"] },
      { 'name': "速动比率", level: [">1.7", "1.4-1.7", "1.1-1.4", "0.8-1.1", "<0.8"] },
      { 'name': "资产负债率", level: ["<35%", "35%-42%", "42%-50%", "50%-60%", ">60%"] },
      { 'name': "产权比率", level: ["<55%", "55%-80%", "80%-105%", "105%-130%", ">130%"] },
      { 'name': "利息保障系数", level: [">25", "15-25", "5-15", "1-5", "<1"] },
      { 'name': "销售净利率", level: [">13%", "9%-13%", "6%-9%", "3%-6%", "<3%"] },
      { 'name': "净资产收益率", level: [">20%", "15%-20%", "10%-20%", "5%-10%", "<5%"] },
      { 'name': "总资产净利率", level: [">12%", "8%-12%", "5%-8%", "3%-5%", "<3%"] },
    ],
    scoreSelectData: [],
    auth: false,//权限控制
    isShow: false,
  },
  onLoad: function (e) {
    this.getDev()
    let that = this
    if (app.globalData.auth && app.globalData.auth != '') {
      if (app.globalData.auth == true) {
        that.getIndexData()
      }
      that.setData({ auth: app.globalData.auth })
    } else {
      app.authCallback = auth => {
        if (auth != '' && auth == true) {
          that.getIndexData()
        }
        that.setData({ auth: auth })
      }
    }

  },
  // onshow
  onShow: function () {
    this.echartsComponent = this.selectComponent('#mychart');
    this.getDev()
    if (app.globalData.auth && app.globalData.auth != '') {
      this.setData({
        auth: app.globalData.auth,
        barChart: true
      })
      if (app.globalData.auth == true) {
        this.getIndexData()
      }
    }
  },
  //资金日报 - 现金 银行存款  应收票据  结存总额
  getFundBalance: function () {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Fund_Balance";
    let co_no = that.data.companyListTol[that.data.zjrb_index]
    let params = {
      co_no: co_no.org_code,
      date_part: that.data.date_part
    }
    params = JSON.stringify(params)
    //请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Fund_Balance').then((data) => {
      console.log('资金日报 - 现金 银行存款  应收票据  结存总额')
      if (data.code == 100) {
        let FundBalanceData = data.data
        let FundBalanceData_t = {
          Cash: {
            ac_camt1: 0,
            ac_damt1: 0,
            ac_balance1: 0
          },
          Bank: {
            ac_camt1: 0,
            ac_damt1: 0,
            ac_balance1: 0
          },
          AR: {
            ac_camt1: 0,
            ac_damt1: 0,
            ac_balance1: 0
          },
          Fund: {
            ac_camt1: 0,
            ac_damt1: 0,
            ac_balance1: 0
          }
        }
        for (let index = 0; index < FundBalanceData.length; index++) {
          let code = FundBalanceData[index].code
          if (code == "Cash") {
            FundBalanceData_t.Cash.ac_camt1 = parseFloat(((FundBalanceData[index].ac_camt1) / 10000).toFixed(0))
            FundBalanceData_t.Cash.ac_damt1 = parseFloat(((FundBalanceData[index].ac_damt1) / 10000).toFixed(0))
            FundBalanceData_t.Cash.ac_balance1 = parseFloat(((FundBalanceData[index].ac_balance1) / 10000).toFixed(0))
          } else if (code == "Bank") {
            FundBalanceData_t.Bank.ac_camt1 = parseFloat(((FundBalanceData[index].ac_camt1) / 10000).toFixed(0))
            FundBalanceData_t.Bank.ac_damt1 = parseFloat(((FundBalanceData[index].ac_damt1) / 10000).toFixed(0))
            FundBalanceData_t.Bank.ac_balance1 = parseFloat(((FundBalanceData[index].ac_balance1) / 10000).toFixed(0))
          } else if (code == "AR") {
            FundBalanceData_t.AR.ac_camt1 = parseFloat(((FundBalanceData[index].ac_camt1) / 10000).toFixed(0))
            FundBalanceData_t.AR.ac_damt1 = parseFloat(((FundBalanceData[index].ac_damt1) / 10000).toFixed(0))
            FundBalanceData_t.AR.ac_balance1 = parseFloat(((FundBalanceData[index].ac_balance1) / 10000).toFixed(0))
          } else if (code == "Fund") {
            FundBalanceData_t.Fund.ac_camt1 = parseFloat(((FundBalanceData[index].ac_camt1) / 10000).toFixed(0))
            FundBalanceData_t.Fund.ac_damt1 = parseFloat(((FundBalanceData[index].ac_damt1) / 10000).toFixed(0))
            FundBalanceData_t.Fund.ac_balance1 = parseFloat(((FundBalanceData[index].ac_balance1) / 10000).toFixed(0))
          }
        }
        // 赋值
        that.setData({
          FundBalanceData: FundBalanceData_t
        })
      } else {
        console.log(data)
      }
    }).catch((e) => {
      console.log(e)
      // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },
  // 生产权限
  getDev() {
    let that = this
    wx.request({
      url: "https://htpcb.lidanwang.cn/cacheController.do?getCache&typegroupcode=cb_environment",
      data: {},
      method: 'GET',
      header: app.globalData.header,
      success(res) {
        that.setData({
          isShow: true
        })
        if (res.data.response_data[0].typecode == "pro") {
          that.getIndexData()
          that.setData({
            isShow: false
          })
        } else {
          that.setData({
            isShow: true
          })
        }
      }
    })
  },
  // 获取首页数据
  getIndexData() {
    this.getCompannyLists()
    this.getJyzbCompannyLists()
    // 今日浏览数据
    this.getBrowseData()

    // 资产总报
    this.getZczbCompannyLists()
    // 财务指标
    this.getAssetsIndicators()
    //分析报告
    this.getfxbgSxlb()
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
    return;
  },
  // 获取浏览数据
  getBrowseData() {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Login";
    let params = {
      openid: wx.getStorageSync('openid'),
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Login').then((data) => {
      data.data[0].beforDay = utils.showdate(-1) + "  23:59"
      if (data.code == 100) {
        that.setData({
          browseData: data.data[0]
        })
      }
    }).catch((e) => {
      console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },
  browseClick(e) {
    this.setData({
      browseShow: !this.data.browseShow,
      browseShowId: e.target.dataset.id
    })
  },
  tipsShow(e) {
    console.log(e.target.dataset.name)
    this.setData({
      fxbgTipshow: !this.data.fxbgTipshow,
      tipsSelectName: e.target.dataset.name
    })
  },
  fxbgTipClick() {
    this.setData({
      fxbgTipshow: !this.data.fxbgTipshow,
      tipsSelectName: ""
    })
  },
  switchChange(_ref) {
    let that = this
    var currentTarget = _ref.currentTarget;
    var tab = currentTarget.dataset.index;
    if (tab == "0") {
      this.setData({
        _num: 0,
        date_part: 'd'
      })
    } else {
      this.setData({
        _num: 1,
        date_part: 'm'
      })
    }
    that.getFundBalance()
    that.getCashjc()
    that.getBankjc()
    that.getNrjc()
    that.getNpjc()
    that.getLoanjc()
  },

  zjrbBindPickerChange: function (e) {
    let that = this
    this.setData({
      zjrb_index: e.detail.value
    })
    that.getFundBalance()
    that.getCashjc()
    that.getBankjc()
    that.getNrjc()
    that.getNpjc()
    that.getLoanjc()
  },
  jyzbBindPickerChange: function (e) {
    this.setData({
      jyzb_index: e.detail.value
    })
  },
  cwzbBindPickerChange: function (e) {
    this.setData({
      cwzb_index: e.detail.value
    })
  },
  bindPickerChange1: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value
    this.setData({
      cIndex: index,
      jyzbCompanySelectCoNo: that.data.jyzbCompanyListTol[index].org_code
    })

    that.jyzbTableYearData()
  },
  bindPickerChangez: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value
    this.setData({
      zIndex: index,
      zczbCompanySelectCoNo: that.data.zczbCompanyListTol[index].org_code
    })

    that.zczbTableYearData()
  },
  analysis: function () {
    this.setData({
      top_menu: 5
    })
  },
  menuActive: function (e) {
    let id = e.target.dataset.id
    if (id == 1) {
      wx.pageScrollTo({
        selector: '#zijin',
      })
    } else if (id == 2) {
      wx.pageScrollTo({
        selector: '#jyzb',
      })
    } else if (id == 3) {
      wx.pageScrollTo({
        selector: '#zczb',
      })
    } else if (id == 4) {
      wx.pageScrollTo({
        selector: '#jinyzb',
      })
    } else if (id == 5) {
      wx.pageScrollTo({
        selector: '#fxbg',
      })
    } else if (id == 6) {
      wx.pageScrollTo({
        selector: '#mubiao',
      })
    }

    this.setData({
      top_menu: e.target.dataset.id
    })
  },

  //资金日报
  zjrbClick: function (e) {

    let that = this
    let id = e.target.dataset.id
    let co_no = that.data.companyListTol[that.data.zjrb_index]
    // console.log(that.data.companyListTol)
    // return

    if (id == 3) {
      wx.navigateTo({
        url: '../zjrb/yspj/yspj?co_no=' + co_no.org_code + '&date_type=' + that.data._num + '&co_name=' + that.data.companyList[that.data.zjrb_index],
      })
    } else if (id == 1) {
      wx.navigateTo({
        url: '../zjrb/cash/cash?co_no=' + co_no.org_code + '&date_type=' + that.data._num + '&co_name=' + that.data.companyList[that.data.zjrb_index],
      })
    } else if (id == 2) {
      wx.navigateTo({
        url: '../zjrb/bank/bank?co_no=' + co_no.org_code + '&date_type=' + that.data._num + '&co_name=' + that.data.companyList[that.data.zjrb_index],
      })
    } else if (id == 4) {
      wx.navigateTo({
        url: '../zjrb/jcze/jcze?co_no=' + co_no.org_code + '&date_type=' + that.data._num + '&co_name=' + that.data.companyList[that.data.zjrb_index],
      })
    } else if (id == 5) {
      wx.navigateTo({
        url: '../zjrb/yfpj/yfpj?co_no=' + co_no.org_code + '&date_type=' + that.data._num + '&co_name=' + that.data.companyList[that.data.zjrb_index],
      })
    } else if (id == 6) {
      wx.navigateTo({
        url: '../zjrb/loan/loan?co_no=' + co_no.org_code + '&date_type=' + that.data._num + '&co_name=' + that.data.companyList[that.data.zjrb_index],
      })
    }

  },
  // 资金日报>现金结存
  getCashjc: function () {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Cash_Balance";

    let co_no = that.data.companyListTol[that.data.zjrb_index]
    let params = {
      co_no: co_no.org_code,
      date_part: that.data.date_part ?? 'd'
    }

    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Cash_Balance').then((data) => {
      console.log('资金日报>现金结存')
      if (data.code == 100) {
        let cashjcData = data.data
        cashjcData.ac_camt1 = parseFloat(((cashjcData.ac_camt1) / 10000).toFixed(2))
        cashjcData.ac_damt1 = parseFloat(((cashjcData.ac_damt1) / 10000).toFixed(2))
        cashjcData.ac_balance1 = parseFloat(((cashjcData.ac_balance1) / 10000).toFixed(2))
        // 赋值
        that.setData({
          cashjcData: cashjcData
        })

      } else {
        console.log(data)
      }
    }).catch((e) => {
      console.log(e)
      // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },
  // 资金日报>银行存款结存
  getBankjc: function () {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Bank_Balance";
    let co_no = that.data.companyListTol[that.data.zjrb_index]
    let params = {
      co_no: co_no.org_code,
      date_part: that.data.date_part
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Bank_Balance').then((data) => {
      console.log('资金日报>银行存款结存')
      if (data.code == 100) {
        let bankjcData = data.data
        bankjcData.ac_camt1 = parseFloat(((bankjcData.ac_camt1) / 10000).toFixed(2))
        bankjcData.ac_damt1 = parseFloat(((bankjcData.ac_damt1) / 10000).toFixed(2))
        bankjcData.ac_balance1 = parseFloat(((bankjcData.ac_balance1) / 10000).toFixed(2))
        // 赋值
        that.setData({
          bankjcData: bankjcData
        })
      } else {
        console.log(data)
      }
    }).catch((e) => {
      console.log(e)
      // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },
  // 资金日报>应收票据
  getNrjc: function () {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_NR_Balance";
    let co_no = that.data.companyListTol[that.data.zjrb_index]
    let params = {
      co_no: co_no.org_code,
      date_part: that.data.date_part
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_NR_Balance').then((data) => {
      console.log('资金日报>应收票据')
      if (data.code == 100) {
        let nrData = data.data
        console.log(nrData.ar_camt)
        nrData.ar_camt = parseFloat(((nrData.ar_camt) / 10000).toFixed(2))
        nrData.ar_damt = parseFloat(((nrData.ar_damt) / 10000).toFixed(2))
        nrData.ar_jamt = parseFloat(((nrData.ar_jamt) / 10000).toFixed(2))
        // 赋值
        that.setData({
          NrJcData: nrData
        })
      } else {
        console.log(data)
      }

    }).catch((e) => {
      console.log(e)
      // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },
  // 资金日报>结存总额

  // 资金日报>应付票据结存
  getNpjc: function () {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_NP_Balance";

    let co_no = that.data.companyListTol[that.data.zjrb_index]
    let params = {
      co_no: co_no.org_code,
      date_part: that.data.date_part
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_NP_Balance').then((data) => {
      console.log('资金日报>应付票据结存')
      if (data.code == 100) {
        let npData = data.data
        npData[0].ap_amt = ((npData[0].ap_amt) / 10000).toFixed(0)
        npData[0].ap_amt1 = ((npData[0].ap_amt1) / 10000).toFixed(0)
        // 赋值
        that.setData({
          NpJcData: npData
        })
      } else {
        console.log(data)
      }

    }).catch((e) => {
      console.log(e)
      // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },
  // 资金日报>贷款结存
  getLoanjc: function () {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Loan_Balance";

    let co_no = that.data.companyListTol[that.data.zjrb_index]
    let params = {
      co_no: co_no.org_code,
      date_part: that.data.date_part
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Loan_Balance').then((data) => {
      if (data.code == 100) {
        let loanData = data.data
        loanData.loan_amt = ((loanData.loan_amt) / 10000).toFixed(0)
        loanData.ac_amt = ((loanData.ac_amt) / 10000).toFixed(0)
        loanData.ac_balance = ((loanData.ac_balance) / 10000).toFixed(0)
        loanData.ac_increase = ((loanData.ac_increase) / 10000).toFixed(0)
        loanData.ac_repay = ((loanData.ac_repay) / 10000).toFixed(0)
        // 赋值
        that.setData({
          loanJcData: loanData
        })
      }

    }).catch((e) => {
      console.log(e)
      // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },

  //经营指标
  jyzbDetail: function (e) {
    let id = e.currentTarget.dataset.id
    let urlCode = ""
    let functionid = ''
    switch (id) {
      case "01":
        functionid = '4028808d80a7eeb90180a8977d71002c'
        urlCode = "../jyzb/pcb/pcb"
        break;
      case "02":
        functionid = '4028808d80a7eeb90180a897c8ef002e'
        urlCode = "../jyzb/pcb/pcb"
        break;
      case "03":
        functionid = '4028808d80a7eeb90180a8980a520030'
        urlCode = "../jyzb/pcb/pcb"
        break;
      case "04":
        functionid = '4028808d80a7eeb90180a89858e20032'
        urlCode = "../jyzb/other/other"
        break;
      case "05":
        functionid = '4028808d80a7eeb90180a898b1020034'
        urlCode = "../jyzb/ywfy/ywfy"
        break;
      case "06":
        functionid = '4028808d80a7eeb90180a89910200036'
        urlCode = "../jyzb/ywfy/ywfy"
        break;
      case "07":
        functionid = '4028808d80a7eeb90180a8a4cc790038'
        urlCode = "../jyzb/ywfy/ywfy"
        break;
      case "08":
        functionid = '4028808d80a7eeb90180a8a55c7d003a'
        urlCode = "../jyzb/ywfy/ywfy"
        break;
      case "09":
        functionid = '4028808d80a7eeb90180a8a5f9d6003c'
        urlCode = "../jyzb/ywfy/ywfy"
        break;
      case "10":
        functionid = '4028808d80a7eeb90180a8a67077003e'
        urlCode = "../jyzb/ywfy/ywfy"
        break;
      case "11":
        functionid = '4028808d80a7eeb90180a8a710ca0040'
        urlCode = "../jyzb/ywfy/ywfy"
        break;
      case "12":
        functionid = '4028808d80a7eeb90180a8a7af920042'
        urlCode = "../jyzb/ywfy/ywfy"
        break;
      case "13":
        functionid = '4028808d80a7eeb90180a8a81d770044'
        urlCode = "../jyzb/other/other"
        break;
      default:
        break;
    }
    wx.navigateTo({
      url: urlCode + '?code=' + id + '&co_no=' + this.data.jyzbCompanyListTol[this.data.jyzb_index].org_code + "&org_name=" + this.data.jyzbCompanyListTol[this.data.jyzb_index].org_name + '&functionid=' + functionid,
    })
  },

  //   说明弹窗关闭
  sjsmClose: function () {
    this.setData({
      sjsm_status: false,
    })
  },
  sjsmOpen: function () {
    this.setData({
      sjsm_status: true,
    })
  },

  jyzbTypeSub: function (e) {
    let that = this
    // 获取弹窗数据
    this.setData({
      jyzbType: e.target.dataset.id,
    })
    if (e.target.dataset.id == 0) {
      that.jyzbTableYearData()
    }

  },
  getJyzbSxlb: function () {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_BusinessReport_Items";
    let params = {
      'co_no': '02',
      'item_type': '0'
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_BusinessReport_Items').then((data) => {
      console.log(data)
      console.log("经营总报类别")
      // return
      if (data.code == 100) {
        let list = data.data
        let jyzbLbData = []
        let num = 0
        for (let index = 0; index < list.length; index++) {
          if (list[index].item_own == '') {
            jyzbLbData[num] = list[index]
            num++
          }
        }

        for (let index1 = 0; index1 < jyzbLbData.length; index1++) {
          let num_sub = 0
          jyzbLbData[index1].subordinate = []
          for (let index2 = 0; index2 < list.length; index2++) {
            if (jyzbLbData[index1].item_no == list[index2].item_own) {
              jyzbLbData[index1].subordinate[num_sub] = list[index2]
              num_sub++
            }

          }

        }

        let jyzbSelectDl2List = new Array()
        let jyzbSortList = new Array()
        console.log(jyzbLbData)
        //经营总报筛选2
        for (let index3 = 0; index3 < jyzbLbData.length; index3++) {
          let list2 = new Array()
          for (let index4 = 0; index4 < jyzbLbData[index3].subordinate.length; index4++) {
            list2[index4] = jyzbLbData[index3].subordinate[index4].item_name
            console.log()
          }
          jyzbSelectDl2List[index3] = list2
          jyzbSortList[index3] = jyzbSelectDl2List[index3][0]
        }
        console.log(jyzbSortList)
        console.log(jyzbSelectDl2List)
        // 赋值
        that.setData({
          jyzbSortList: jyzbSortList,
          jyzbSelectDl2List: jyzbSelectDl2List,
          jyzbLbData: jyzbLbData,
          jyzbLbSelectIdx: jyzbLbData[0]['subordinate'][0].item_no,
          jyzbLbSelectName: jyzbLbData[0]['subordinate'][0].item_name,
        })

        that.jyzbTableYearData()
      } else {
      }

    }).catch((e) => {
      console.log(e)
    })
  },
  getZczbSxlb: function () {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Assets_Items";
    let params = {
      'co_no': '02',
      'item_type': '0'
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Assets_Items').then((data) => {
      console.log(data)
      console.log("资产总报类别")
      // return
      if (data.code == 100) {
        let list = data.data
        let zczbLbData = []
        let num = 0
        for (let index = 0; index < list.length; index++) {
          if (list[index].owner_no == '01.01' && list[index].owner_name == '流动资产') {
            zczbLbData[0] = { item_no: '01.01', item_name: '流动资产', subordinate: [] }
          } else if (list[index].owner_no == '01.02' && list[index].owner_name == '非流动资产') {
            zczbLbData[1] = { item_no: '01.02', item_name: '非流动资产', subordinate: [] }
          } else if (list[index].owner_no == '02.01' && list[index].owner_name == '流动负债') {
            zczbLbData[2] = { item_no: '02.01', item_name: '流动负债', subordinate: [] }
          } else if (list[index].owner_no == '02.02' && list[index].owner_name == '非流动负债') {
            zczbLbData[3] = { item_no: '02.02', item_name: '非流动负债', subordinate: [] }
          } else if (list[index].owner_no == '03' && list[index].owner_name == '所有者权益') {
            zczbLbData[4] = { item_no: '03', item_name: '所有者权益', subordinate: [] }
          }
        }
        console.log(zczbLbData)
        // for (let index = 0; index < list.length; index++) {
        //   if (list[index].owner_no == '') {
        //     zczbLbData[num] = list[index]
        //     num++
        //   }
        // }
        for (let index1 = 0; index1 < zczbLbData.length; index1++) {
          let num_sub = 0
          zczbLbData[index1].subordinate = []
          for (let index2 = 0; index2 < list.length; index2++) {
            if (zczbLbData[index1].item_no == list[index2].owner_no) {
              zczbLbData[index1].subordinate[num_sub] = list[index2]
              num_sub++
            }
          }
        }
        console.log(zczbLbData)
        let zczbSelectDl2List = new Array()
        let zczbSortList = new Array()
        console.log(zczbLbData)
        //经营总报筛选2
        for (let index3 = 0; index3 < zczbLbData.length; index3++) {
          let list2 = new Array()
          for (let index4 = 0; index4 < zczbLbData[index3].subordinate.length; index4++) {
            list2[index4] = zczbLbData[index3].subordinate[index4].item_name
            console.log()
          }
          zczbSelectDl2List[index3] = list2
          zczbSortList[index3] = zczbSelectDl2List[index3][0]
        }
        console.log(zczbSortList)//合计。。。 资产总报下拉首个显示的值
        console.log(zczbSelectDl2List)//下拉的列表

        // 赋值
        that.setData({
          zczbSortList: zczbSortList,
          zczbSelectDl2List: zczbSelectDl2List,
          zczbLbData: zczbLbData,
          zczbLbSelectIdx: zczbLbData[0]['subordinate'][0].item_no,
          zczbLbSelectName: zczbLbData[0]['subordinate'][0].item_name,
        })

        that.zczbTableYearData()
      } else {
      }

    }).catch((e) => {
      console.log(e)
    })
  },


  zczbTypeSub: function (e) {
    let that = this
    // 获取弹窗数据
    this.setData({
      zczbType: e.target.dataset.id,
      zczbTypeShow: e.target.dataset.id,
    })
    if (e.target.dataset.id == 0) {
      that.zczbTableYearData()
    }

  },
  yfpjClick: function () {
    wx.navigateTo({
      url: '../zjrb/yfpj/yfpj',
    })
  },
  loanClick: function () {
    wx.navigateTo({
      url: '../zjrb/loan/loan',
    })
  },
  jyzongb: function (e) {
    wx.navigateTo({
      url: '../jyzb/jyzongb/jyzongb?co_no=' + e.currentTarget.dataset.co + '&c_name=' + e.currentTarget.dataset.cname + "&date=" + this.data.jyzbDateStr + "&date1=" + this.data.jyzbDateStr1,
    })
  },
  zczbDetail: function (e) {

    wx.navigateTo({
      url: '../zczb/zczb?co_no=' + e.currentTarget.dataset.co + '&c_name=' + e.currentTarget.dataset.cname + "&date=" + this.data.zczbDateStr,
    })
  },

  // 获取公司列表
  getCompannyLists: function () {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Company_Lists";
    let params = {
      struct_type: 'A',
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Company_Lists').then((data) => {

      // console.log(data)
      if (data.code == 100) {
        let list = data.data
        let companyList = []
        for (let index = 0; index < list.length; index++) {
          companyList[index] = list[index].org_name;

        }
        // 赋值
        that.setData({
          companyList: companyList,
          companyListTol: list
        })
      } else {
        console.log(data)
      }

      that.getFundBalance()
      that.getCashjc()
      that.getBankjc()
      that.getNrjc()
      that.getNpjc()
      that.getLoanjc()

    }).catch((e) => {
      console.log(e)
      // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },

  // 经营总报获取公司列表
  getJyzbCompannyLists: function () {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Company_Lists";
    let params = {
      struct_type: 'B',
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Company_Lists').then((data) => {

      if (data.code == 100) {
        let list = data.data
        let jyzbCompanyList = []
        for (let index = 0; index < list.length; index++) {
          jyzbCompanyList[index] = list[index].org_name;

        }
        // 赋值
        that.setData({
          jyzbCompanyList: jyzbCompanyList,
          jyzbCompanyListTol: list,
          jyzbCompanySelectCoNo: list[0].org_code
        })
      } else {
      }
      that.jyzbListData()



    }).catch((e) => {
      console.log(e)
      // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },
  // 资产总报获取公司列表
  getZczbCompannyLists: function () {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Company_Lists";
    let params = {
      struct_type: 'C',
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Company_Lists').then((data) => {
      console.log(data.data)
      if (data.code == 100) {
        let list = data.data
        let zczbCompanyList = []
        for (let index = 0; index < list.length; index++) {
          zczbCompanyList[index] = list[index].org_name;

        }
        // 赋值
        that.setData({
          zczbCompanyList: zczbCompanyList,
          zczbCompanyListTol: list,
          zczbCompanySelectCoNo: list[0].org_code
        })
      } else {
      }
      that.zczbListData()



    }).catch((e) => {
      console.log(e)
      // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },
  bindDateChange(e) {
    let jyzbDate = e.detail.value
    this.setData({
      jyzbDate: jyzbDate,
      jyzbDateStr: jyzbDate
    })
    this.jyzbListData()
  },
  bindZczbDateChange(e) {
    let zczbDate = e.detail.value
    this.setData({
      zczbDate: zczbDate,
      zczbDateStr: zczbDate
    })
    this.zczbListData()
  },
  bindDateChange1(e) {
    let jyzbDate1 = e.detail.value
    this.setData({
      jyzbDate1: jyzbDate1,
      jyzbDateStr1: jyzbDate1
    })
    this.jyzbListData()
  },

  // 首页经营总报公司列表数据
  jyzbListData: function () {
    let that = this

    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);


    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_BusinessReport_Summay";
    let params = {
      ac_ym_s: that.data.jyzbDate,
      ac_ym_e: that.data.jyzbDate1
      // ac_ym:that.data.jyzbDate
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_BusinessReport_Summay').then((data) => {

      console.log("经营总报。。。。")
      if (data.code == 100) {
        let list = data.data
        let jyzbIndexList = []
        for (let index = 0; index < list.length; index++) {
          jyzbIndexList[index] = list[index]
          console.log(jyzbIndexList[index].ac_04)
          jyzbIndexList[index].ac_01 = utils.dataEmptyZero(jyzbIndexList[index].ac_01) == true ? " " : parseFloat((list[index].ac_01)).toFixed(0)
          jyzbIndexList[index].ac_02 = utils.dataEmptyZero(jyzbIndexList[index].ac_02) == true ? " " : parseFloat((list[index].ac_02)).toFixed(0)
          jyzbIndexList[index].ac_03 = utils.dataEmptyZero(jyzbIndexList[index].ac_03) == true ? " " : parseFloat((list[index].ac_03)).toFixed(0)
          jyzbIndexList[index].ac_04 = utils.dataEmptyZero(jyzbIndexList[index].ac_04) == true ? " " : parseFloat((list[index].ac_04)).toFixed(0)
          // jyzbIndexList[index].ac_01 = parseFloat((list[index].ac_01)).toFixed(0)
          // jyzbIndexList[index].ac_02 = parseFloat((list[index].ac_02)).toFixed(0)
          // jyzbIndexList[index].ac_03 = parseFloat((list[index].ac_03)).toFixed(0)
          // jyzbIndexList[index].ac_04 = parseFloat((list[index].ac_04)).toFixed(0)
        }
        // 赋值
        that.setData({
          jyzbIndexList: jyzbIndexList,
          jyzbDate: jyzbIndexList[0].s_ym.replace("/", "-"),
          jyzbDateStr: jyzbIndexList[0].s_ym.replace("/", "-"),
          jyzbDate1: jyzbIndexList[0].e_ym.replace("/", "-"),
          jyzbDateStr1: jyzbIndexList[0].e_ym.replace("/", "-"),
        })
        if (that.data.jyzbDateEnd == '') {
          that.setData({
            jyzbDateEnd: jyzbIndexList[0].s_ym.replace("/", "-"),
            jyzbDateEnd1: jyzbIndexList[0].e_ym.replace("/", "-"),
          })

        }
      } else {
      }

      that.getJyzbSxlb()


    }).catch((e) => {
      console.log(e)
      // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },

  // 首页经营总报公司列表数据
  zczbListData: function () {
    let that = this


    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Assets_Summary";
    let params = {
      ac_ym: that.data.zczbDate
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Assets_Summary').then((data) => {

      console.log("资产总报。。。。")
      console.log(data)
      if (data.code == 100) {
        let list = data.data
        let zczbIndexList = []
        for (let index = 0; index < list.length; index++) {
          zczbIndexList[index] = list[index]

          zczbIndexList[index].ac_01 = utils.dataEmptyZero(zczbIndexList[index].ac_01) == true ? " " : parseFloat((list[index].ac_01)).toFixed(0)
          zczbIndexList[index].ac_02 = utils.dataEmptyZero(zczbIndexList[index].ac_02) == true ? " " : parseFloat((list[index].ac_02)).toFixed(0)
          zczbIndexList[index].ac_03 = utils.dataEmptyZero(zczbIndexList[index].ac_03) == true ? " " : parseFloat((list[index].ac_03)).toFixed(0)
          zczbIndexList[index].ac_04 = utils.dataEmptyZero(zczbIndexList[index].ac_04) == true ? " " : parseFloat((list[index].ac_04)).toFixed(0)
          zczbIndexList[index].ac_05 = utils.dataEmptyZero(zczbIndexList[index].ac_05) == true ? " " : parseFloat((list[index].ac_05)).toFixed(0)

        }
        // 赋值
        that.setData({
          zczbIndexList: zczbIndexList,
          zczbDate: zczbIndexList[0].ac_ym.replace("/", "-"),
          zczbDateStr: zczbIndexList[0].ac_ym.replace("/", "-"),
        })

        if (that.data.zczbDateEnd == '') {
          that.setData({
            zczbDateEnd: zczbIndexList[0].ac_ym.replace("/", "-"),
          })

        }

      } else {
      }

      that.getZczbSxlb()


    }).catch((e) => {
      console.log(e)
      // console.log('获取数据错误 ====' + JSON.stringify(e))
    })
  },

  // 经营总报筛选
  jyzbLbSelectDl(e) {

    let id = e.currentTarget.dataset.id;

    this.setData({
      jyzbLbSelectId: id,
      jyzbType: true
    })


  },
  // 资产总报筛选
  zczbLbSelectDl(e) {

    let id = e.currentTarget.dataset.id;

    this.setData({
      zczbLbSelectId: id,
      zczbType: true,
      zczbTypeShow: true
    })


  },
  // // 资产总报类别筛选
  // zczbLbSelect(e){
  //     let id = e.currentTarget.dataset.id;
  //     this.setData({
  //         zczbTypeShow:e.target.dataset.id,

  //     })
  //     this.setData({
  //         zczbLbSelectId:id
  //     })
  // },

  jyzbLbSelect2: function (e) {
    let that = this
    let index = e.detail.value
    let jyzbLbSelectId = this.data.jyzbLbSelectId
    console.log(jyzbLbSelectId)
    // let item_no = e.currentTarget.dataset.no
    // let item_name = e.currentTarget.dataset.name
    let jyzbLbData = this.data.jyzbLbData[jyzbLbSelectId].subordinate[index]
    let item_no = jyzbLbData.item_no
    let item_name = jyzbLbData.item_name
    console.log(this.data.jyzbSortList)
    let jyzbSortList = this.data.jyzbSortList1
    jyzbSortList[jyzbLbSelectId] = item_name
    that.setData({
      jyzbSortList: jyzbSortList,
      jyzbLbSelectIdx: item_no,
      jyzbLbSelectName: item_name,
    })
    that.jyzbTableYearData()
  },
  zczbLbSelect2: function (e) {
    let that = this
    let index = e.detail.value
    let zczbLbSelectId = this.data.zczbLbSelectId
    console.log(zczbLbSelectId)
    // let item_no = e.currentTarget.dataset.no
    // let item_name = e.currentTarget.dataset.name
    let zczbLbData = this.data.zczbLbData[zczbLbSelectId].subordinate[index]
    let item_no = zczbLbData.item_no
    let item_name = zczbLbData.item_name
    let zczbSortList = this.data.zczbSortList
    zczbSortList[zczbLbSelectId] = item_name
    that.setData({
      zczbSortList: zczbSortList,
      zczbLbSelectIdx: item_no,
      zczbLbSelectName: item_name,
    })
    that.zczbTableYearData()
  },


  // 经营总报筛选2
  jyzbLbSelectDl2(e) {
    let id = e.currentTarget.dataset.id;
    console.log(id)
    this.setData({
      jyzbLbSelectId: id,
      jyzbType: false
    })
  },
  // 资产总报筛选2
  zczbLbSelectDl2(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      zczbLbSelectId: id,
      zczbType: false
    })
  },

  // 获取 经营总报  公司12个月数据
  jyzbTableYearData: function (e) {

    let that = this

    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);


    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_BusinessReport_SummayDetails";
    let params = {
      co_no: that.data.jyzbCompanySelectCoNo,
      ac_ym: Y + '-' + M,
      item_no: that.data.jyzbLbSelectIdx
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_BusinessReport_SummayDetails').then((data) => {
      console.log(data.data)
      if (data.code == 100) {
        let list = data.data
        console.log('经营总报  公司12个月数据')
        for (let index = 0; index < list.length; index++) {
          if (that.data.jyzbLbSelectName == "毛利率" || that.data.jyzbLbSelectName == "主营毛利率" || that.data.jyzbLbSelectName == "毛利率" || that.data.jyzbLbSelectName == "净利润率") {
            list[index].ac_01 = utils.dataToFixed(list[index].ac_01 * 100, 0)
            list[index].ac_02 = utils.dataToFixed(list[index].ac_02 * 100, 0)
            list[index].ac_03 = utils.dataToFixed(list[index].ac_03 * 100, 0)
            list[index].ac_04 = utils.dataToFixed(list[index].ac_04 * 100, 0)
            list[index].ac_05 = utils.dataToFixed(list[index].ac_05 * 100, 0)
            list[index].ac_06 = utils.dataToFixed(list[index].ac_06 * 100, 0)
            list[index].ac_07 = utils.dataToFixed(list[index].ac_07 * 100, 0)
            list[index].ac_08 = utils.dataToFixed(list[index].ac_08 * 100, 0)
            list[index].ac_09 = utils.dataToFixed(list[index].ac_09 * 100, 0)
            list[index].ac_10 = utils.dataToFixed(list[index].ac_10 * 100, 0)
            list[index].ac_11 = utils.dataToFixed(list[index].ac_11 * 100, 0)
            list[index].ac_12 = utils.dataToFixed(list[index].ac_12 * 100, 0)
            list[index].ac_mave = utils.dataToFixed(list[index].ac_mave * 100, 0)
            list[index].ac_total = utils.dataToFixed(list[index].ac_total * 100, 0)
            // list[index].ac_total = parseInt(list[index].ac_01) + parseInt(list[index].ac_02) + parseInt(list[index].ac_03) + parseInt(list[index].ac_04) + parseInt(list[index].ac_05) + parseInt(list[index].ac_06) + parseInt(list[index].ac_07) + parseInt(list[index].ac_08) + parseInt(list[index].ac_09) + parseInt(list[index].ac_10) + parseInt(list[index].ac_11) + parseInt(list[index].ac_12)
            list[index].ac_mave = utils.dataToFixed(list[index].ac_mave, 0)
            list[index].ac_total = utils.dataToFixed(list[index].ac_total, 0)

            list[index].ac_01 = list[index].ac_01 == '0' ? "" : list[index].ac_01
            list[index].ac_02 = list[index].ac_02 == '0' ? "" : list[index].ac_02
            list[index].ac_03 = list[index].ac_03 == '0' ? "" : list[index].ac_03
            list[index].ac_04 = list[index].ac_04 == '0' ? "" : list[index].ac_04
            list[index].ac_05 = list[index].ac_05 == '0' ? "" : list[index].ac_05
            list[index].ac_06 = list[index].ac_06 == '0' ? "" : list[index].ac_06
            list[index].ac_07 = list[index].ac_07 == '0' ? "" : list[index].ac_07
            list[index].ac_08 = list[index].ac_08 == '0' ? "" : list[index].ac_08
            list[index].ac_09 = list[index].ac_09 == '0' ? "" : list[index].ac_09
            list[index].ac_10 = list[index].ac_10 == '0' ? "" : list[index].ac_10
            list[index].ac_11 = list[index].ac_11 == '0' ? "" : list[index].ac_11
            list[index].ac_12 = list[index].ac_12 == '0' ? "" : list[index].ac_12
            list[index].ac_mave = list[index].ac_mave == '0' ? "" : list[index].ac_mave
            list[index].ac_total = list[index].ac_total == '0' ? "" : list[index].ac_total
          } else {
            list[index].ac_01 = utils.dataToFixed(list[index].ac_01, 0)
            list[index].ac_02 = utils.dataToFixed(list[index].ac_02, 0)
            list[index].ac_03 = utils.dataToFixed(list[index].ac_03, 0)
            list[index].ac_04 = utils.dataToFixed(list[index].ac_04, 0)
            list[index].ac_05 = utils.dataToFixed(list[index].ac_05, 0)
            list[index].ac_06 = utils.dataToFixed(list[index].ac_06, 0)
            list[index].ac_07 = utils.dataToFixed(list[index].ac_07, 0)
            list[index].ac_08 = utils.dataToFixed(list[index].ac_08, 0)
            list[index].ac_09 = utils.dataToFixed(list[index].ac_09, 0)
            list[index].ac_10 = utils.dataToFixed(list[index].ac_10, 0)
            list[index].ac_11 = utils.dataToFixed(list[index].ac_11, 0)
            list[index].ac_12 = utils.dataToFixed(list[index].ac_12, 0)
            list[index].ac_mave = utils.dataToFixed(list[index].ac_mave, 0)
            list[index].ac_total = utils.dataToFixed(list[index].ac_total, 0)
            // list[index].ac_total = parseInt(list[index].ac_01) + parseInt(list[index].ac_02) + parseInt(list[index].ac_03) + parseInt(list[index].ac_04) + parseInt(list[index].ac_05) + parseInt(list[index].ac_06) + parseInt(list[index].ac_07) + parseInt(list[index].ac_08) + parseInt(list[index].ac_09) + parseInt(list[index].ac_10) + parseInt(list[index].ac_11) + parseInt(list[index].ac_12)

            list[index].ac_total = utils.dataToFixed(list[index].ac_total, 0)
            list[index].ac_01 = list[index].ac_01 == '0' ? "" : list[index].ac_01
            list[index].ac_02 = list[index].ac_02 == '0' ? "" : list[index].ac_02
            list[index].ac_03 = list[index].ac_03 == '0' ? "" : list[index].ac_03
            list[index].ac_04 = list[index].ac_04 == '0' ? "" : list[index].ac_04
            list[index].ac_05 = list[index].ac_05 == '0' ? "" : list[index].ac_05
            list[index].ac_06 = list[index].ac_06 == '0' ? "" : list[index].ac_06
            list[index].ac_07 = list[index].ac_07 == '0' ? "" : list[index].ac_07
            list[index].ac_08 = list[index].ac_08 == '0' ? "" : list[index].ac_08
            list[index].ac_09 = list[index].ac_09 == '0' ? "" : list[index].ac_09
            list[index].ac_10 = list[index].ac_10 == '0' ? "" : list[index].ac_10
            list[index].ac_11 = list[index].ac_11 == '0' ? "" : list[index].ac_11
            list[index].ac_12 = list[index].ac_12 == '0' ? "" : list[index].ac_12
            list[index].ac_mave = list[index].ac_mave == '0' ? "" : list[index].ac_mave
            list[index].ac_total = list[index].ac_total == '0' ? "" : list[index].ac_total
          }
        }

        let bfb = ""
        if (that.data.jyzbLbSelectName == "毛利率" || that.data.jyzbLbSelectName == "主营毛利率" || that.data.jyzbLbSelectName == "毛利率" || that.data.jyzbLbSelectName == "净利润率") {
          bfb = "%"
        }

        // 赋值
        that.setData({
          jyzbIndexTableList: list,
          jyzbChartImagePath: null,
          bfb: bfb
        })
        that.getJyzbOption()
      } else {
      }

    }).catch((e) => {
      console.log(e)
    })
  },

  // 获取 资产总报  公司12个月数据
  zczbTableYearData: function (e) {
    let that = this
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);


    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Asset_Trajectory";
    let params = {
      co_no: that.data.zczbCompanySelectCoNo,
      // ac_ym : Y+'-'+M,
      item_no: that.data.zczbLbSelectIdx
    }

    params = JSON.stringify(params)

    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Asset_Trajectory').then((data) => {
      if (data.code == 100) {
        let list = data.data
        console.log('资产总报  公司12个月数据')
        console.log(data)
        for (let index = 0; index < list.length; index++) {
          list[index].ac_01 = utils.dataToFixed(list[index].ac_01, 0)
          list[index].ac_02 = utils.dataToFixed(list[index].ac_02, 0)
          list[index].ac_03 = utils.dataToFixed(list[index].ac_03, 0)
          list[index].ac_04 = utils.dataToFixed(list[index].ac_04, 0)
          list[index].ac_05 = utils.dataToFixed(list[index].ac_05, 0)
          list[index].ac_06 = utils.dataToFixed(list[index].ac_06, 0)
          list[index].ac_07 = utils.dataToFixed(list[index].ac_07, 0)
          list[index].ac_08 = utils.dataToFixed(list[index].ac_08, 0)
          list[index].ac_09 = utils.dataToFixed(list[index].ac_09, 0)
          list[index].ac_10 = utils.dataToFixed(list[index].ac_10, 0)
          list[index].ac_11 = utils.dataToFixed(list[index].ac_11, 0)
          list[index].ac_12 = utils.dataToFixed(list[index].ac_12, 0)
          list[index].ac_mave = utils.dataToFixed(list[index].ac_mave, 0)
          list[index].ac_total = utils.dataToFixed(list[index].ac_total, 0)
          // list[index].ac_total = parseInt(list[index].ac_01) + parseInt(list[index].ac_02) + parseInt(list[index].ac_03) + parseInt(list[index].ac_04) + parseInt(list[index].ac_05) + parseInt(list[index].ac_06) + parseInt(list[index].ac_07) + parseInt(list[index].ac_08) + parseInt(list[index].ac_09) + parseInt(list[index].ac_10) + parseInt(list[index].ac_11) + parseInt(list[index].ac_12)
          list[index].ac_mave = utils.dataToFixed(list[index].ac_mave, 0)
          list[index].ac_total = utils.dataToFixed(list[index].ac_total, 0)
          list[index].ac_01 = list[index].ac_01 == '0' ? "" : list[index].ac_01
          list[index].ac_02 = list[index].ac_02 == '0' ? "" : list[index].ac_02
          list[index].ac_03 = list[index].ac_03 == '0' ? "" : list[index].ac_03
          list[index].ac_04 = list[index].ac_04 == '0' ? "" : list[index].ac_04
          list[index].ac_05 = list[index].ac_05 == '0' ? "" : list[index].ac_05
          list[index].ac_06 = list[index].ac_06 == '0' ? "" : list[index].ac_06
          list[index].ac_07 = list[index].ac_07 == '0' ? "" : list[index].ac_07
          list[index].ac_08 = list[index].ac_08 == '0' ? "" : list[index].ac_08
          list[index].ac_09 = list[index].ac_09 == '0' ? "" : list[index].ac_09
          list[index].ac_10 = list[index].ac_10 == '0' ? "" : list[index].ac_10
          list[index].ac_11 = list[index].ac_11 == '0' ? "" : list[index].ac_11
          list[index].ac_12 = list[index].ac_12 == '0' ? "" : list[index].ac_12
          list[index].ac_mave = list[index].ac_mave == '0' ? "" : list[index].ac_mave
          list[index].ac_total = list[index].ac_total == '0' ? "" : list[index].ac_total
        }

        let bfb = ""

        // 赋值
        that.setData({
          zczbIndexTableList: list,
          zczbChartImagePath: null,
          bfb: bfb
        })

        that.getZczbOption()
      } else {
      }

    }).catch((e) => {
      console.log(e)
    })
  },

  jyzbLbSelect: function (e) {
    let that = this
    let item_no = e.currentTarget.dataset.no
    let item_name = e.currentTarget.dataset.name
    that.setData({
      jyzbLbSelectIdx: item_no,
      jyzbLbSelectName: item_name,
    })
  },
  zczbLbSelect: function (e) {
    let that = this
    let item_no = e.currentTarget.dataset.no
    let item_name = e.currentTarget.dataset.name
    that.setData({
      zczbLbSelectIdx: item_no,
      zczbLbSelectName: item_name,
    })
  },

  // 获取财务指标
  getAssetsIndicators() {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Assets_Indicators";
    let params = {
      index_code: 'A'
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Assets_Indicators').then((data) => {
      console.log(data)
      console.log("财务指标")

      //  获取财务指标公司列表
      this.getCompanyCwzb()
    }).catch((e) => {

      console.log('获取数据错误 ====' + JSON.stringify(e))

    })
  },
  getCompanyCwzb() {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_Company_Lists";
    let params = {
      struct_type: 'D',
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_Company_Lists').then((data) => {
      if (data.code == 100) {
        let list = data.data
        let companyList = []
        for (let index = 0; index < list.length; index++) {
          companyList[index] = list[index].org_name;
        }
        // 赋值
        that.setData({
          companyCwzbList: companyList,
          companyCwzbListTol: list
        })
      } else {
        console.log(data)
      }

    }).catch((e) => {
      console.log(e)
    })
  },
  // 财务指标详情页面
  cwzbDetail(e) {
    let item_no = e.currentTarget.dataset.code;
    console.log(e)
    let title = ""
    switch (item_no) {
      case '01':
        title = "货币资金"
        break;
      case '03':
        title = "应收账款"
        break;
      case '05':
        title = "物品存货"
        break;
      case '07':
        title = "固定资产"
        break;
      case '013':
        title = "应付账款"
        break;
      default:
        break;
    }

    wx.navigateTo({
      url: '../cwzb/cwzb?org_code=' + this.data.companyCwzbListTol[this.data.cwzb_index].org_code + "&org_name=" + this.data.companyCwzbListTol[this.data.cwzb_index].org_name + "&item_no=" + item_no + "&title=" + title,
    })
  },

  // 分析报告start
  getfxbgSxlb: function () {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_BusinessReport_Items";
    let params = {
      'co_no': '00',
      'item_type': '2'
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_BusinessReport_Items').then((data) => {
      console.log("---------------------分析报告类别---------------------")
      console.log(data)
      if (data.code == 100) {
        let list = data.data
        let fxbgLbData = []
        let num = 0
        for (let index = 0; index < list.length; index++) {
          if (list[index].item_own == '') {
            fxbgLbData[num] = list[index]
            num++
          }
        }

        for (let index1 = 0; index1 < fxbgLbData.length; index1++) {
          let num_sub = 0
          fxbgLbData[index1].subordinate = []
          for (let index2 = 0; index2 < list.length; index2++) {
            if (fxbgLbData[index1].item_no == list[index2].item_own) {
              fxbgLbData[index1].subordinate[num_sub] = list[index2]
              num_sub++
            }
          }
        }
        console.log(fxbgLbData)
        // let jyzbSelectDl2List = new Array()
        // let jyzbSortList = new Array()
        // console.log(jyzbLbData)
        // //经营总报筛选2
        // for (let index3 = 0; index3 < jyzbLbData.length; index3++) {
        //    let list2 = new Array()
        //     for (let index4 = 0; index4 < jyzbLbData[index3].subordinate.length; index4++) {
        //         list2[index4] = jyzbLbData[index3].subordinate[index4].item_name
        //         console.log()
        //     }
        //     jyzbSelectDl2List[index3] = list2
        //     jyzbSortList[index3] = jyzbSelectDl2List[index3][0]
        // }
        // console.log(jyzbSortList)
        // console.log(jyzbSelectDl2List)
        // 赋值
        that.setData({
          fxbg_item_no: fxbgLbData[0]['subordinate'][0].item_no,
          fxbgLbData: fxbgLbData,
          fxbg_menu: 0
        })

        that.fxbgTableYearData()
      } else {
      }

    }).catch((e) => {
      console.log(e)
    })
  },
  // 切换类别
  fxbgActive: function (e) {
    console.log("----------------------切换类别----------------------")
    console.log(e.target.dataset.id)
    this.setData({
      fxbg_menu: e.target.dataset.id,
      fxbg_item_no: this.data.fxbgLbData[e.target.dataset.id]['subordinate'][0].item_no,
    })
    if (e.target.dataset.id == 4) {//现金流量
      this.setData({
        xjllSelectMonthIndex: 13,
        barChart: false,
        fxbg_menu: e.target.dataset.id,
        fxbg_item_no: this.data.fxbgLbData[e.target.dataset.id].item_no
      })
    } else {
      this.setData({
        barChart: true,
        fxbg_menu: e.target.dataset.id,
        fxbg_item_no: this.data.fxbgLbData[e.target.dataset.id]['subordinate'][0].item_no
      })
    }
    setTimeout(() => { this.fxbgTableYearData() }, 100);
    //this.fxbgTableYearData()
  },
  fxbg2Active(e) {
    this.setData({
      fxbg_item_no: this.data.fxbgLbData[this.data.fxbg_menu]['subordinate'][e.currentTarget.dataset.id].item_no,
    })
    this.fxbgTableYearData()
  },
  // 获取柱状图数据
  fxbgTableYearData() {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_AnalysisReport";
    let params = {
      'co_no': '00',
      'item_no': that.data.fxbg_item_no
    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_AnalysisReport').then((data) => {
      console.log("-----------------分析报告图表数据-----------------")
      console.log(data.data)
      if (data.code == 100) {
        that.setData({
          fxbgYearData: data.data[0],
        })
        if (that.data.fxbg_menu == 4) {
          that.getFxbgZztXjll(data.data)
        } else {
          console.log(data.data[0])
          var checkIndex = 11
          if (data.data[0].ac_12 == '0') {
            checkIndex = 10
          } else if (data.data[0].ac_11 == '0') {
            checkIndex = 9
          }
          that.setData({
            checkIndex: checkIndex,
          })
          that.getFxbgZzt1(data.data[0])
          that.leftTouchHander1(checkIndex)
        }
      } else {
        console.log("分析报告柱状图数据获取失败")
      }
    }).catch((e) => {
      console.log(e)
    })
  },

  // 分析报告柱状图
  // getFxbgZzt(data) {
  //   console.log(data)
  //   let that = this
  //   let categories = []
  //   let categoriesL = []
  //   let categoriesR = []
  //   let startMonth = data['e_ym'].split("/")[1]
  //   for (let index = 1; index < 13; index++) {
  //     //左边
  //     if (parseInt(startMonth) < index) {
  //       // if (index === 13) {
  //       //   categoriesL.push('月均')
  //       // } else {
  //       //   categoriesL.push(index)
  //       // }
  //       categoriesL.push(index)
  //     } else {
  //       categoriesR.push(index)
  //     }
  //   }

  //   categories = categoriesL.concat(categoriesR)
  //   let seriesData = []
  //   let num = 0
  //   // for (const iterator of categories) {
  //   const keys = Object.keys(data)
  //   keys.forEach(function (item, key) {
  //     if (item.indexOf("ac_") != -1) {
  //       if (item.split("_")[1] != "lev") {
  //         seriesData[num] = data[item]
  //         num++
  //       }
  //     }
  //   })

  //   // let seriesDataKey = ['ac_01','ac_02','ac_03','ac_04','ac_05','ac_06','ac_07','ac_08','ac_09','ac_10','ac_11','ac_12',"ac_mave"]
  //   // seriesDataKey.forEach(function(item,key){
  //   //   seriesData[num] = data[item]
  //   //   num++
  //   // })
  //   // console.log(seriesData)
  //   // let seriesDataL = []
  //   // let seriesDataR = []
  //   // seriesData.forEach(function(e,key){
  //   //   //左边
  //   //   if (parseInt(startMonth) < key+1) {
  //   //     seriesDataL.push(e)
  //   //   } else {
  //   //     seriesDataR.push(e)
  //   //   }
  //   // })
  //   // seriesData = seriesDataL.concat(seriesDataR)

  //   let max = 0
  //   let min = 0
  //   let seriesData1 = []
  //   console.log(seriesData)
  //   for (let index = 0; index < seriesData.length; index++) {
  //     seriesData[index] = parseFloat(seriesData[index])
  //     if (min > seriesData[index]) {
  //       min = seriesData[index]
  //       console.log(min)
  //     }

  //     if (max < seriesData[index]) {
  //       max = seriesData[index]
  //     }
  //   }
  //   console.log(seriesData[this.data.xjllSelectMonthIndex])
  //   for (let index = 0; index < seriesData.length; index++) {
  //     if (index != this.data.xjllSelectMonthIndex) {
  //       seriesData1[index] = null
  //     } else {
  //       seriesData1[index] = seriesData[index]
  //     }
  //   }
  //   // for (let index = 0; index < seriesData.length; index++) {
  //   //   if (index != this.data.xjllSelectMonthIndex) {
  //   //     if (min < 0) {
  //   //       seriesData1[index] = Math.floor(min)
  //   //     } else {
  //   //       seriesData1[index] = 0    
  //   //     }
  //   //   } else {
  //   //     seriesData1[index] = seriesData[index]
  //   //   }
  //   // }

  //   max = Math.ceil(max)
  //   min = Math.floor(min)
  //   console.log(seriesData1)
  //   console.log("seriesData1seriesData1")

  //   //评分标准
  //   let scoreList = that.data.scoreList
  //   let item_name = data.item_name
  //   let scoreSelectData = []
  //   for (let index = 0; index < scoreList.length; index++) {
  //     if (scoreList[index].name == item_name) {
  //       scoreSelectData = scoreList[index].level
  //     }
  //   }
  //   that.setData({
  //     xjllLeftpjData: seriesData,
  //     zjllLeftCategories: categories,
  //     scoreSelectData: scoreSelectData
  //   })
  //   //设置柱形图
  //   columnChart = new wxCharts({
  //     canvasId: 'columnCanvas',
  //     type: 'column',
  //     animation: false,
  //     legend: false,
  //     disablePieStroke: true,
  //     categories: categories,
  //     series: [{
  //       name: data.item_name,
  //       data: seriesData,
  //       color: "#4A90E2",//未选中颜色
  //       // color: "#rgb(255 0 0)",//未选中颜色
  //       format: function (val, name) {
  //         return val;
  //       }

  //     }],
  //     yAxis: {
  //       format: function (val) {
  //         return val;
  //       },
  //       // title: 'hello',
  //       min: min,
  //       max: max,
  //       disabled: true,

  //     },
  //     xAxis: {
  //       disableGrid: false,
  //       type: 'calibration'
  //     },
  //     extra: {
  //       column: {
  //         width: 15
  //       }
  //     },
  //     enableScroll: false,
  //     // enableScroll:true,是否滑动配置
  //     width: wx.getSystemInfoSync().windowWidth,
  //     height: 200,
  //   });

  //   setTimeout(function () {
  //     wx.canvasToTempFilePath({
  //       x: 0, y: 0,

  //       canvasId: 'columnCanvas',
  //       success: function (res) {
  //         var tempFilePath = res.tempFilePath;
  //         // that.setData({
  //         //   columnCanvasImagePath: tempFilePath,
  //         // });
  //         console.log(tempFilePath)
  //       },
  //       fail: function (res) {
  //         console.log(res);
  //       }
  //     })

  //   }, 1000);

  //   columnChart = new wxCharts({
  //     canvasId: 'columnCanvas1',
  //     type: 'column',
  //     animation: false,
  //     legend: false,
  //     disablePieStroke: true,
  //     categories: categories,
  //     dataLabel: false,
  //     dataPointShape: false,
  //     series: [{
  //       name: data.item_name,
  //       data: seriesData1,
  //       color: "#7ED321",//选中的颜色
  //       //color: "#ff0000",//选中的颜色
  //       format: function (val, name) {
  //         return val;
  //       }

  //     }],
  //     yAxis: {
  //       format: function (val) {
  //         return val;
  //       },
  //       // title: 'hello',
  //       min: min,
  //       max: max,
  //       disabled: true,
  //       gridColor: 'transparent'
  //     },
  //     xAxis: {
  //       disableGrid: false,
  //       type: 'calibration'
  //     },
  //     extra: {
  //       column: {
  //         width: 15
  //       }
  //     },
  //     enableScroll: false,
  //     // enableScroll:true,是否滑动配置
  //     width: wx.getSystemInfoSync().windowWidth,
  //     height: 200,
  //   });

  //   this.init();
  // },

  getFxbgZztXjll(data) {//现金流量
    console.log("-----------------现金流量-----------------")
    console.log(data)
    let that = this
    let categories = []
    //s_ym 上年 e_ym 今年
    let startMonth = data[0]['s_ym'].split("-")[1]
    //左 右边数据
    let categoriesL = []
    let categoriesR = []
    let currentYear = data[0]['e_ym'].split("-")[0]
    // let currentMonth = parseInt(data[0]['e_ym'].split("-")[1]) < 10 ? '0' + parseInt(data[0]['e_ym'].split("-")[1]) : parseInt(data[0]['e_ym'].split("-")[1])
    for (let index = 1; index < 13; index++) {
      //左边
      if (parseInt(startMonth) <= index) {
        categoriesL.push(index)
      } else {
        categoriesR.push(index)
      }
    }
    categories = categoriesL.concat(categoriesR)
    //x轴加多两个位置
    let arr = []
    categories.forEach(e => {
      if (e == 6) {
        arr.push(e)
        arr.push('半年')
      } else if (e == 12) {
        arr.push(e)
        arr.push('全年')
      } else {
        arr.push(e)
      }
    })
    categories = arr
    // 按季度
    // let s_ym = data[0]['s_ym'].split(" ")[0].substring(2, 4)
    // let e_ym = data[0]['e_ym'].split(" ")[0].substring(2, 4)
    // categories = [
    //   s_ym+'一季度',s_ym+'二季度',s_ym+"半年",s_ym+'三季度',s_ym+'四季度',s_ym+"全年",
    //   e_ym+'一季度',e_ym+'二季度',e_ym+"半年",e_ym+'三季度',e_ym+'四季度',e_ym+"全年"
    // ]
    let seriesDataList = []
    let pjDataList = []
    //半年x轴index
    let half_index = ''
    //全年x轴index
    let total_index = ''
    for (let i = 0; i < data.length; i++) {
      let seriesData = []
      let num = 0
      // for (const iterator of categories) {
      const keys = Object.keys(data[i])
      keys.forEach(function (item, key) {
        if (item.indexOf("ac_") != -1) {
          if (item.split("_")[1] != "lev") {
            if (data[i][item] != 0) {
              seriesData.push(data[i][item])
            }
          }
        }
      })
      //获取半年和全年在x轴的index 便根据index插入seriesData数据中
      categories.forEach((item, index) => {
        if (item == '半年') {
          half_index = index
        } else if (item == '全年') {
          total_index = index
        }
      })
      //根据x轴的index插入半年和全年数据
      seriesData.splice(half_index, 0, data[i].half_21)
      seriesData.splice(total_index, 0, data[i].total_21)

      let color = ""
      if (i == 0) {
        color = "#4A90E2"//蓝色 经营活动
      }
      if (i == 1) {
        color = "#7ED321"//绿色 投资活动
      }
      if (i == 2) {
        color = "#F5A623"//橙色 筹资活动
      }
      if (i == 3) {
        color = "#D0021B"//红色 现金
      }
      pjDataList[i] = {
        name: data[i].item_name.substring(0, 11),
        data: seriesData
      }
      seriesDataList[i] = {
        color: color,
        name: data[i].item_name,
        type: 'line',
        smooth: true,
        data: seriesData
      }
    }

    let year = ""
    if (parseInt(this.data.fxbgYearData.s_ym.split('-')[1]) <= (13 - that.data.xjllSelectMonthIndex)) {
      year = this.data.fxbgYearData.s_ym.split('-')[0]
    } else {
      year = this.data.fxbgYearData.e_ym.split('-')[0]
    }

    let currentMonth = categories[that.data.xjllSelectMonthIndex]
    console.log(currentMonth)
    currentMonth = currentMonth == '半年' || currentMonth == '全年' ? currentMonth : currentMonth + '月'

    that.setData({
      xjllpjDate1: year + "年" + currentMonth,
      xjllpjData: pjDataList,
      zjllCategories: categories,
      xjllData: data,
    })
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    //设置柱形图
    columnChart = new wxCharts({
      canvasId: 'lineCanvasXjll',
      type: 'line',
      legend: false,
      categories: categories,
      animation: true,
      // background: '#f5f5f5',
      series: seriesDataList,
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        min: 0
      },
      dataLabel: false,
      dataPointShape: true,
      extra: {
      },
      width: windowWidth,
      height: 200,
    });
  },

  // leftTouchHander(e) {
  //   let xjllpjDate = ''
  //   let fxbgDate1 = ''
  //   let fxbgDate2 = ''
  //   let index = columnChart.getCurrentDataIndex(e)
  //   let month = this.data.zjllLeftCategories[index]
  //   if (index == undefined || index == 'undefined') { index = 0 }
  //   console.log(index)
  //   if (index == -1) { return }
  //   //e_ym今年  s_ym上年
  //   let year = ""
  //   if (parseInt(this.data.fxbgYearData.s_ym.split('/')[1]) <= (12 - index)) {
  //     year = this.data.fxbgYearData.s_ym.split('/')[0]
  //     xjllpjDate = year + "年" + month + "月"
  //     fxbgDate1 = year + "/" + (month < 10 ? '0' + month : month)
  //     let month1 = parseInt(month) + 1 < 10 ? '0' + (parseInt(month) + 1) : (parseInt(month) + 1)
  //     //fxbgDate2 = (month1===13 ? parseInt(year) : (parseInt(year) - 1))  + "/" + (month1 === 13 ? 1 : month1)
  //   } else {
  //     year = this.data.fxbgYearData.e_ym.split('/')[0]
  //     xjllpjDate = year + "年" + month + "月"
  //     fxbgDate1 = year + "/" + (month < 10 ? '0' + month : month)
  //     let month1 = parseInt(month) + 1 < 10 ? '0' + (parseInt(month) + 1) : (parseInt(month) + 1)
  //     // fxbgDate2 = (month1===13 ? parseInt(year) : (parseInt(year) - 1))  + "/" + (month1 === 13 ? 1 : month1)
  //     // if(index === 7 ){
  //     //   xjllpjDate = this.data.zjllLeftCategories[index]
  //     //   year = this.data.fxbgYearData.s_ym.split('/')[0]
  //     //   fxbgDate2 = year +"/" + this.data.zjllLeftCategories[0]
  //     //   fxbgDate1 = year + "/" + 12
  //     // }else{
  //     //   year = this.data.fxbgYearData.e_ym.split('/')[0]
  //     //   xjllpjDate = year + "年" + month + "月"
  //     //   fxbgDate1 = year + "/" + (month < 10 ? '0' + month : month)
  //     //   let month1 = parseInt(month) + 1 < 10 ? '0'+(parseInt(month) + 1): (parseInt(month) + 1)
  //     //   fxbgDate2 = (month1===13 ? parseInt(year) : (parseInt(year) - 1))  + "/" + (month1 === 13 ? 1 : month1)
  //     // }
  //   }

  //   //获取该月的评价
  //   this.getLeftLevel(index)
  //   this.setData({
  //     xjllpjDate: xjllpjDate,
  //     xjllSelectMonthIndex: index,
  //     fxbgDate1: fxbgDate1,
  //     fxbgDate2: fxbgDate2,
  //   })
  //   this.fxbgTableYearData()
  // },

  //获取该月的评价
  getLeftLevel(index) {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_AnalysisReport_Appraise";
    let params = {
      data: [
        {
          'item_type': '0',
          'item_no': that.data.fxbg_item_no,
          'ac_amt': that.data.xjllLeftpjData[index]
        }
      ]

    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_AnalysisReport_Appraise').then((data) => {
      let fxbgYearData = that.data.fxbgYearData
      fxbgYearData.ac_lev = data.data.ac_lev
      that.setData({
        fxbgYearData: fxbgYearData
      })

    }).catch((e) => {
      console.log(e)
    })
  },
  //获取该月的评价
  getRightLevel(index) {
    let that = this
    // 获取接口
    let urlStr = app.config.apiUrl + "Interface_AnalysisReport_Appraise";
    let params = {
      data: [
        {
          'item_type': '1',
          'item_no': that.data.xjllData[0].item_no,
          'ac_amt': that.data.xjllpjData[0].data[index]
        },
        {
          'item_type': '1',
          'item_no': that.data.xjllData[1].item_no,
          'ac_amt': that.data.xjllpjData[1].data[index]
        },
        {
          'item_type': '1',
          'item_no': that.data.xjllData[2].item_no,
          'ac_amt': that.data.xjllpjData[2].data[index]
        },
        {
          'item_type': '1',
          'item_no': that.data.xjllData[3].item_no,
          'ac_amt': that.data.xjllpjData[3].data[that.data.xjllSelectMonthIndex]
        },
      ]

    }
    params = JSON.stringify(params)
    // 请求数据
    app.server.postSoapRequest(urlStr, params, 'Interface_AnalysisReport_Appraise').then((data) => {
      let fxbgYearData = that.data.fxbgYearData
      fxbgYearData.ac_lev = data.data.ac_lev
      that.setData({
        fxbgYearData: fxbgYearData
      })
    }).catch((e) => {
      console.log(e)
    })
  },
  //折线图点击事件
  touchHander(e) {
    columnChart.showToolTip(e, {
      format: function (item, category) {
        //return category + ' ' + item.name + ':' + item.data
        return item.data
      }
    });
    let index = columnChart.getCurrentDataIndex(e)
    if (index == undefined || index == 'undefined') { index = 0 }
    if (index == -1) { return }
    //s_ym 上年 e_ym 今年
    let year = ""
    console.log(index)
    if (parseInt(this.data.fxbgYearData.s_ym.split('-')[1]) <= (14 - index)) {
      //上年
      year = this.data.fxbgYearData.s_ym.split('-')[0]
    } else {
      //今年
      year = this.data.fxbgYearData.e_ym.split('-')[0]
    }
    let month = this.data.zjllCategories[index]

    month

    this.getRightLevel(index)
    this.setData({
      xjllSelectMonthIndex: index,
      xjllpjDate1: year + "年" + (month == '半年' || month == '全年' ? month : month + '月')
    })
  },
  //分析报告end
  getJyzbOption: function () {
    let that = this
    let jyzbIndexTableList = that.data.jyzbIndexTableList
    let dataList = []
    let date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let color = ''
    if (jyzbIndexTableList.length < 1) return
    for (let index = 0; index < jyzbIndexTableList.length; index++) {
      if (index === 0) {
        color = "#7ED321"
      } else {
        color = "#4A90E2"
      }
      dataList[index] = {
        name: jyzbIndexTableList[index].ac_yy,
        type: 'line',
        smooth: true,
        data: [jyzbIndexTableList[index].ac_01, jyzbIndexTableList[index].ac_02, jyzbIndexTableList[index].ac_03, jyzbIndexTableList[index].ac_04, jyzbIndexTableList[index].ac_05, jyzbIndexTableList[index].ac_06, jyzbIndexTableList[index].ac_07, jyzbIndexTableList[index].ac_08, jyzbIndexTableList[index].ac_09, jyzbIndexTableList[index].ac_10, jyzbIndexTableList[index].ac_11, jyzbIndexTableList[index].ac_12],
        color: color,
      }
      console.log(dataList[index])

      if (jyzbIndexTableList[index].ac_yy == Y) {
        dataList[index].data[0] = (M <= 1) ? null : dataList[index].data[0]
        dataList[index].data[1] = (M <= 2) ? null : dataList[index].data[1]
        dataList[index].data[2] = (M <= 3) ? null : dataList[index].data[2]
        dataList[index].data[3] = (M <= 4) ? null : dataList[index].data[3]
        dataList[index].data[4] = (M <= 5) ? null : dataList[index].data[4]
        dataList[index].data[5] = (M <= 6) ? null : dataList[index].data[5]
        dataList[index].data[6] = (M <= 7) ? null : dataList[index].data[6]
        dataList[index].data[7] = (M <= 8) ? null : dataList[index].data[7]
        dataList[index].data[8] = (M <= 9) ? null : dataList[index].data[8]
        dataList[index].data[9] = (M <= 10) ? null : dataList[index].data[9]
        dataList[index].data[10] = (M <= 11) ? null : dataList[index].data[10]
        dataList[index].data[11] = (M <= 12) ? null : dataList[index].data[11]

        dataList[index].data[0] = (dataList[index].data[0] == "") ? null : dataList[index].data[0]
        dataList[index].data[1] = (dataList[index].data[1] == "") ? null : dataList[index].data[1]
        dataList[index].data[2] = (dataList[index].data[2] == "") ? null : dataList[index].data[2]
        dataList[index].data[3] = (dataList[index].data[3] == "") ? null : dataList[index].data[3]
        dataList[index].data[4] = (dataList[index].data[4] == "") ? null : dataList[index].data[4]
        dataList[index].data[5] = (dataList[index].data[5] == "") ? null : dataList[index].data[5]
        dataList[index].data[6] = (dataList[index].data[6] == "") ? null : dataList[index].data[6]
        dataList[index].data[7] = (dataList[index].data[7] == "") ? null : dataList[index].data[7]
        dataList[index].data[8] = (dataList[index].data[8] == "") ? null : dataList[index].data[8]
        dataList[index].data[9] = (dataList[index].data[9] == "") ? null : dataList[index].data[9]
        dataList[index].data[10] = (dataList[index].data[10] == "") ? null : dataList[index].data[10]
        dataList[index].data[11] = (dataList[index].data[11] == "") ? null : dataList[index].data[11]
      }


    }



    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    console.log("zhexiantushuju")
    console.log(dataList)
    jyzbChart = new wxCharts({
      canvasId: 'jyzbChart',
      type: 'line',
      categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      animation: true,
      // background: '#f5f5f5',
      series: dataList,


      xAxis: {
        disableGrid: true,
        fontColor: '#000000',
      },
      yAxis: {
        fontColor: '#000000',
        min: 0
      },

      dataLabel: false,
      legend: false,
      dataPointShape: true,
      extra: {
      },
      width: windowWidth,
      height: 165,
    });
    setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0, y: 0,

        canvasId: 'jyzbChart',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            jyzbChartImagePath: tempFilePath,
          });
        },
        fail: function (res) {
          console.log(res);
        }
      })

    }, 1000);

  },
  getZczbOption: function () {
    let that = this
    let zczbIndexTableList = that.data.zczbIndexTableList
    let dataList = []
    let date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    console.log(zczbIndexTableList)
    if (zczbIndexTableList.length < 1) return
    for (let index = 0; index < zczbIndexTableList.length; index++) {
      dataList[index] = {
        name: zczbIndexTableList[index].ac_yy,
        type: 'line',
        smooth: true,
        data: [zczbIndexTableList[index].ac_01, zczbIndexTableList[index].ac_02, zczbIndexTableList[index].ac_03, zczbIndexTableList[index].ac_04, zczbIndexTableList[index].ac_05, zczbIndexTableList[index].ac_06, zczbIndexTableList[index].ac_07, zczbIndexTableList[index].ac_08, zczbIndexTableList[index].ac_09, zczbIndexTableList[index].ac_10, zczbIndexTableList[index].ac_11, zczbIndexTableList[index].ac_12],
      }

      if (zczbIndexTableList[index].ac_yy == Y) {
        dataList[index].data[0] = (M <= 1) ? null : dataList[index].data[0]
        dataList[index].data[1] = (M <= 2) ? null : dataList[index].data[1]
        dataList[index].data[2] = (M <= 3) ? null : dataList[index].data[2]
        dataList[index].data[3] = (M <= 4) ? null : dataList[index].data[3]
        dataList[index].data[4] = (M <= 5) ? null : dataList[index].data[4]
        dataList[index].data[5] = (M <= 6) ? null : dataList[index].data[5]
        dataList[index].data[6] = (M <= 7) ? null : dataList[index].data[6]
        dataList[index].data[7] = (M <= 8) ? null : dataList[index].data[7]
        dataList[index].data[8] = (M <= 9) ? null : dataList[index].data[8]
        dataList[index].data[9] = (M <= 10) ? null : dataList[index].data[9]
        dataList[index].data[10] = (M <= 11) ? null : dataList[index].data[10]
        dataList[index].data[11] = (M <= 12) ? null : dataList[index].data[11]
      }
      dataList[index].data[0] = (dataList[index].data[0] == "") ? null : dataList[index].data[0]
      dataList[index].data[1] = (dataList[index].data[1] == "") ? null : dataList[index].data[1]
      dataList[index].data[2] = (dataList[index].data[2] == "") ? null : dataList[index].data[2]
      dataList[index].data[3] = (dataList[index].data[3] == "") ? null : dataList[index].data[3]
      dataList[index].data[4] = (dataList[index].data[4] == "") ? null : dataList[index].data[4]
      dataList[index].data[5] = (dataList[index].data[5] == "") ? null : dataList[index].data[5]
      dataList[index].data[6] = (dataList[index].data[6] == "") ? null : dataList[index].data[6]
      dataList[index].data[7] = (dataList[index].data[7] == "") ? null : dataList[index].data[7]
      dataList[index].data[8] = (dataList[index].data[8] == "") ? null : dataList[index].data[8]
      dataList[index].data[9] = (dataList[index].data[9] == "") ? null : dataList[index].data[9]
      dataList[index].data[10] = (dataList[index].data[10] == "") ? null : dataList[index].data[10]
      dataList[index].data[11] = (dataList[index].data[11] == "") ? null : dataList[index].data[11]
    }

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    zczbChart = new wxCharts({
      canvasId: 'zczbChart',
      type: 'line',
      categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      animation: true,
      legend: false,
      // background: '#f5f5f5',
      series: dataList,

      xAxis: {
        fontColor: '#000000',
        disableGrid: true
      },
      yAxis: {
        fontColor: '#000000',
        min: 0
      },

      dataLabel: false,
      dataPointShape: true,
      extra: {
      },
      width: windowWidth,
      height: 165,
    });
    setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0, y: 0,

        canvasId: 'zczbChart',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            zczbChartImagePath: tempFilePath,
          });
        },
        fail: function (res) {
          console.log(res);
        }
      })

    }, 1000);

  },

  //分析报告柱形图 初始化图表 --经营效率 --偿债能力 --财务杠杆 --获利能力
  init: function () {
    let that = this;
    that.echartsComponent.init((canvas, width, height, dpr) => {
      // 初始化图表
      chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      that.setOption()
      return chart
    });

  },
  //echarts配置 分析报告数据和样式
  setOption: function () {
    var checkIndex = this.data.checkIndex
    let data = {
      data: this.data.xjllLeftpjData,
      type: 'bar',
      //color: '#4A90E2',
      itemStyle: {
        normal: {
          label: { show: true },
          color: function (params) {
            //通过判断选中的名字改变柱子的颜色样式 未选中颜色 #4A90E2  选中颜色 #7ED321
            if (checkIndex === params.dataIndex) {
              return '#7ED321';
            } else {
              return '#4A90E2';
            }
          }
        }
      },
      //组件自己的选中改变颜色
      // emphasis: {
      //   itemStyle: {
      //     color: '#7ED321',//选中柱形颜色
      //   }
      // },
      barGap: '0%',
      barWidth: 12,
      label: {
        normal: {
          show: true,
          position: 'top', //柱形文字的位置
          fontSize: 10,//文字大小
        }
      },
    }
    var option = {
      tooltip: {
        show: false,
        trigger: 'axis',
        axisPointer: {
          type: 'line',// 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true,
        formatter: function (params) {
          console.log(params)
          return null;
        },
      },
      grid: {
        left: 42,
        right: 20,
        bottom: 20,
        top: 15,
        //containLabel: true
      },
      xAxis: {
        type: 'category',
        data: this.data.zjllLeftCategories,
      },
      yAxis: {
        type: 'value'
      },
      series: data
    };
    chart.setOption(option); //获取新数据
    chart.getZr().on("click", (params) => {
      let pointInPixel = [params.offsetX, params.offsetY]
      if (chart.containPixel('grid', pointInPixel)) {
        let xIndex = chart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
        console.log("分析报告柱形图点击的index")
        console.log(xIndex)
        this.leftTouchHander1(xIndex)
      }
      //点击的柱子的名称
      checkIndex = chart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
      //柱形图重构
      chart.setOption(option);

    });
  },

  // 分析报告柱状图 x坐标和data数据处理
  getFxbgZzt1(data) {
    let that = this
    let categories = []
    let categoriesL = []
    let categoriesR = []
    //e_ym 今年 s_ym 上年
    let startMonth = data['e_ym'].split("/")[1]
    for (let index = 1; index < 13; index++) {
      //左边
      if (parseInt(startMonth) < index) {
        categoriesL.push(index)
      } else {
        categoriesR.push(index)
      }
    }

    categories = categoriesL.concat(categoriesR)
    let seriesData = []
    let num = 0
    // for (const iterator of categories) {
    const keys = Object.keys(data)
    keys.forEach(function (item, key) {
      if (item.indexOf("ac_") != -1) {
        if (item.split("_")[1] != "lev") {
          seriesData[num] = data[item]
          num++
        }
      }
    })
    let max = 0
    let min = 0
    let seriesData1 = []
    for (let index = 0; index < seriesData.length; index++) {
      seriesData[index] = parseFloat(seriesData[index])
      if (min > seriesData[index]) {
        min = seriesData[index]
      }
      if (max < seriesData[index]) {
        max = seriesData[index]
      }
    }
    for (let index = 0; index < seriesData.length; index++) {
      if (index != this.data.xjllSelectMonthIndex) {
        seriesData1[index] = null
      } else {
        seriesData1[index] = seriesData[index]
      }
    }
    max = Math.ceil(max)
    min = Math.floor(min)

    console.log(seriesData)
    //如果最后一个没有数据  则初始化默认选中上一个月的数据为默认选中
    var xjllSelectMonthIndex = 11
    if (seriesData[11] == '0') {
      xjllSelectMonthIndex = 10
    } else if (seriesData[10] == '0') {
      xjllSelectMonthIndex = 9
    }
    //评分标准
    let scoreList = that.data.scoreList
    let item_name = data.item_name
    let scoreSelectData = []
    for (let index = 0; index < scoreList.length; index++) {
      if (scoreList[index].name == item_name) {
        scoreSelectData = scoreList[index].level
      }
    }
    that.setData({
      xjllSelectMonthIndex: xjllSelectMonthIndex,
      xjllLeftpjData: seriesData,
      zjllLeftCategories: categories,
      scoreSelectData: scoreSelectData
    })
    this.init()
  },

  //分析报告柱形图 点击事件
  leftTouchHander1(e) {
    let xjllpjDate = ''
    let fxbgDate1 = ''
    let fxbgDate2 = ''
    let index = Math.abs(e);
    let month = this.data.zjllLeftCategories[index]
    if (index == undefined || index == 'undefined') { index = 0 }
    if (index == -1) { return }
    //e_ym今年  s_ym上年
    let year = ""
    if (parseInt(this.data.fxbgYearData.s_ym.split('/')[1]) <= (12 - index)) {
      year = this.data.fxbgYearData.s_ym.split('/')[0]
      xjllpjDate = year + "年" + month + "月"
      fxbgDate1 = year + "/" + (month < 10 ? '0' + month : month)
      let month1 = parseInt(month) + 1 < 10 ? '0' + (parseInt(month) + 1) : (parseInt(month) + 1)
      fxbgDate2 = (month1 === 13 ? parseInt(year) : (parseInt(year) - 1)) + "/" + (month1 === 13 ? 1 : month1)
    } else {
      year = this.data.fxbgYearData.e_ym.split('/')[0]
      xjllpjDate = year + "年" + month + "月"
      fxbgDate1 = year + "/" + (month < 10 ? '0' + month : month)
      let month1 = parseInt(month) + 1 < 10 ? '0' + (parseInt(month) + 1) : (parseInt(month) + 1)
      fxbgDate2 = (month1 === 13 ? parseInt(year) : (parseInt(year) - 1)) + "/" + (month1 === 13 ? 1 : month1)
    }
    //获取该月的评价
    this.getLeftLevel(index)
    this.setData({
      xjllpjDate: xjllpjDate,
      xjllSelectMonthIndex: index,
      fxbgDate1: fxbgDate1,
      fxbgDate2: fxbgDate2,
    })
    //this.fxbgTableYearData()
  },
});



function toNull(data) {
  if (data == '') {
    return null
  } else {
    return data
  }

}
