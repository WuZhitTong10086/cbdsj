const httpGet = (url,data) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url:`https://htpcb.lidanwang.cn/${url}`,
      data: data,
      // header: {
      //   //'content-type': 'application/x-www-form-urlencoded' // 默认值
      //   'content-type': 'application/json'
      // },
      success: function (res) {
        if (res.statusCode != 200) {
          reject({ error: '服务器忙，请稍后重试', code: 500 });
          return;
        }

        resolve(res.data);

      },
      fail: function (res) {
        // fail调用接口失败
        reject({ error: '网络错误', code: 0 });
      },
      complete: function (res) {
        // complete
      }
    })
    
  })
}

const httpPost = (url,data) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url:`https://htpcb.lidanwang.cn/${url}`,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        if (res.statusCode != 200) {
          reject({ error: '服务器忙，请稍后重试', code: 500 });
          return;
        }

        resolve(res.data);

      },
      fail: function (res) {
        // fail调用接口失败
        reject({ error: '网络错误', code: 0 });
      },
      complete: function (res) {
        // complete
      }
    })
    
  })
}

module.exports = {
  httpGet: httpGet,
  httpPost: httpPost
}

