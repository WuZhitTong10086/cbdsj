// components/assistantButton/assistantButton.js
const app = getApp()
const http = require('../../pages/config/http')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isMainPage: Boolean, // 主页有footer，要考虑footer的高度
    functionid: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    startPoint: app.globalData.startPoint,
    //按钮位置参数
    buttonTop: app.globalData.buttonTop,
    buttonLeft: app.globalData.buttonLeft,
    windowHeight: '',
    windowWidth: '',
    //输入框参数
    textAreaTop: 0,
    displayTextarea: false,
    isMainPage: false,
    envItems: [
      {value: '0', name: '测试'},
      {value: '1', name: '使用', checked: true},
      {value: '2', name: '助手'}
    ],
    categoryItems: [
      {value: '0', name: '问题'},
      {value: '1', name: '建议'}
    ],
    currentRadio: 1,
    currentTab: 1,
    contentText: '',
    thumb:[], // 上传图片
    img:'' // 图片路径（数据库）
  },

  lifetimes: {
    created: function() {
      // 在组件实例刚刚被创建时执行
    },
    attached: function() {
      // 105rpx 计算文本框距离顶部的距离 手机高度-小黑条（res.safeArea.bottom-文本高度-底部footer高度（45）
      let textAreaTop

      // 在组件实例进入页面节点树时执行
      let that = this;
      wx.getSystemInfo({
        success: function (res) {
          if(that.data.isMainPage){
            textAreaTop = res.safeArea.bottom - (110 / 750 * wx.getSystemInfoSync().windowWidth) - (450 / 750 * wx.getSystemInfoSync().windowWidth)
          }
          else{
            textAreaTop = res.windowHeight - (480 / 750 * wx.getSystemInfoSync().windowWidth)
            //textAreaTop = res.safeArea.bottom - (600 / 750 * wx.getSystemInfoSync().windowWidth)
          }
          // 高度,宽度 单位为px
          that.setData({
            windowHeight: res.windowHeight,
            windowWidth: res.windowWidth,
            buttonTop: res.windowHeight*0.80,//这里定义按钮的初始位置
            buttonLeft: res.windowWidth*0.80,//这里定义按钮的初始位置
            textAreaTop: textAreaTop
          })

        }
      })
    },
    ready: function() {
      // 在组件在视图层布局完成后执行
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  pageLifetimes: {
    show: function() {
      // 页面被展示
      if(app.globalData.buttonTop!=0 && app.globalData.buttonLeft!=0){
        this.setData({
          buttonTop: app.globalData.buttonTop,//这里定义按钮的初始位置
          buttonLeft: app.globalData.buttonLeft,//这里定义按钮的初始位置
          startPoint: app.globalData.startPoint,
        })
      }
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //以下是按钮拖动事件
    buttonStart: function (e) {
      let startPoint = e.touches[0]//获取拖动开始点
      this.setData({
        startPoint
      })
      console.log(startPoint)
      app.globalData.startPoint = startPoint
    },

    buttonMove: function (e) {
      let startPoint = this.data.startPoint
      var endPoint = e.touches[e.touches.length - 1]//获取拖动结束点
      //计算在X轴上拖动的距离和在Y轴上拖动的距离
      var translateX = endPoint.clientX - startPoint.clientX
      var translateY = endPoint.clientY - startPoint.clientY
      startPoint = endPoint//重置开始位置
      var buttonTop = this.data.buttonTop + translateY
      var buttonLeft = this.data.buttonLeft + translateX
      //判断是移动否超出屏幕
      if (buttonLeft+50 >= this.data.windowWidth){
        buttonLeft = this.data.windowWidth-50;
      }
      if (buttonLeft<=0){
        buttonLeft=0;
      }
      if (buttonTop<=0){
        buttonTop=0
      }
      if (buttonTop + 50 >= this.data.windowHeight){
        buttonTop = this.data.windowHeight-50;
      }

      this.setData({
        buttonTop: buttonTop,
        buttonLeft: buttonLeft,
        startPoint: startPoint
      })
      app.globalData.buttonTop = buttonTop
      app.globalData.buttonLeft = buttonLeft
      app.globalData.startPoint = startPoint
    },

    buttonEnd: function (e) {
    },
    
    // 打开输入文本框
    openTextarea: function(e){
      this.setData({
        displayTextarea: true
      })
    },

    // 关闭输入文本框
    closeTextarea: function(e){
      this.setData({
        displayTextarea: false
      })
    },

    // 切换测试/使用/助手
    radioChange: function(e) {
      let currentRadio = e.detail.currentRadio
      this.setData({
          currentRadio
      })
    },

    // 切换问题/建议
    swichNav: function(e) {
      if (this.data.currentTab === e.target.dataset.current) {
        return
      } else {
        this.setData({
          currentTab: e.target.dataset.current
        })
      }
    },

    // 文本框赋值
    setValue: function(e){
      this.setData({
        contentText: e.detail.value
      })
    },

    // 选择图片
    chooseImg: function(e){
      let that = this
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths
          let thumb = that.data.thumb
          tempFilePaths.forEach(item => {
            thumb.push(item)
          })
          that.setData({
            thumb
          })
        }
      })
    },

    openVideo: function(e){
      let video = this.getVideo()
      if(!video){
        wx.showModal({
          title: '提示',
          content: '暂无指引视频'
        })
        return
      }
    },

    openFileList: function(e){
      let fileList = this.getFileList()
      if (fileList.length==0) {
        wx.showModal({
          title: '提示',
          content: '暂无其他指引'
        })
        return
      }
      this.selectComponent("#fileList").openFileList(fileList)
    },

    // 删除图片
    deleteImg: function(e){
      let delIndex = e.target.dataset.index
      let thumb = this.data.thumb
      thumb.forEach((item,index) => {
        if(delIndex==index){
          thumb.splice(index, 1)
        }
      })
      this.setData({
        thumb
      })
    },

    
    // 上传图片
    uploadFile(imgArray) {
      let self = this;
      let url = app.globalData.host + 'jyProposalController.do?uploadImg'
      return Promise.all(imgArray.map((image, index) => {
        return new Promise(function (resolve, reject) {
          let img = self.data.img
          wx.uploadFile({
            url: url,
            filePath: image,
            name: 'upFile',
            formData:{'type': 'weixin'},
            success: function(rsp){
              var rs = rsp.data
              var js = JSON.parse(rs)
              if(js.response_code==200){
                let filename = js.response_data.filename
                if(img != ''){
                  img += ','
                }
                img += filename
                self.setData({
                  img
                })
                resolve(self.data.img)
              }
              else{
                reject({ error: '图片上传失败', code: 0 });
              }
            }
          })
        })
      }));
    },

    // 获取视频
    getVideo(){
      let videoSrc = ""
      return videoSrc
    },

    // 获取文件列表
    getFileList(){
      let fileList = [
        // {
        //   fileName: '使用说明.mp4', fileSrc: 'https://lvdeng-gz-dev.obs.cn-south-1.myhuaweicloud.com/video/ktlnd5ov99o0-%E8%BF%9B%E8%A1%8C%E4%B8%AD-%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B8%8E%E6%BC%94%E7%A4%BA.mp4',fileExt:'mp4'
        // },
        // {
        //   fileName: '使用说明2.mp4', fileSrc: 'https://lvdeng-gz-dev.obs.cn-south-1.myhuaweicloud.com/video/ktlnd5ov99o0-%E8%BF%9B%E8%A1%8C%E4%B8%AD-%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B8%8E%E6%BC%94%E7%A4%BA.mp4',fileExt:'mp4'
        // }
      ]
      return fileList
    },

    // 提交
    async confirm(){
      let that = this
      if(!this.data.contentText){
        wx.showModal({
          title: '提示',
          content: '问题或建议不能为空'
        })
      }
      else{
        wx.showLoading({
          title: '上传中，请稍后...',
          mask: true
        })

        let thumb = that.data.thumb
        let img = await that.uploadFile(thumb) // 截图
        let env = this.data.currentRadio // 环境
        let category = this.data.currentTab // 类别
        let content = this.data.contentText // 问题/建议内容

        let serverid = app.globalData.serverid
        let openid = app.globalData.openid
        let functionid = this.data.functionid
      
        console.log(env+'|'+category+'|'+content+'|'+openid+'|functionid：'+functionid)

        let res = await http.httpPost(`jyProposalController.do?save`,{
          serverid,
          openid,
          functionid,
          env,
          category,
          content,
          img
        })
        if (res.response_code == 200) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '提交成功',
            success (res) {
              that.closeTextarea()
            }
          })
        }
        else{
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '提交失败，请稍后重试'
          })
        }

      }
    },

    // 弹窗时禁止上下滑动
    doNothing: function(e){
      return
    }
  }
})
