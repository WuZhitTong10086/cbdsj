// components/myRadio/myRadio.js
// 助手单选使用
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    radioItems: Array, // 单选数组
    currentRadio: String // 默认选中
  },

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    radioChange: function (e) {
      if (this.data.currentRadio === e.detail.value) {
        return
      } else {
        this.setData({
          currentRadio: e.detail.value
        })
        this.triggerEvent('radioChange', { currentRadio: e.detail.value},{ bubbles: true, composed: true }) // bubbles：事件是否冒泡 composed：事件是否可以穿越组件边界
      }
    }
  }
})
