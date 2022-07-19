Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    displayFileList: false,
    fileList: []
  },
  ready() {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭
    closeFileList: function(e){
      this.setData({
        displayFileList: false
      })
    },

    doNothing: function(e){
      return
    },

    // 打开
    openFileList(fileList){
      this.setData({
        displayFileList: true,
        fileList
      })
    },

  }
})
