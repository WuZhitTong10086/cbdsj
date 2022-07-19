// 网络请求相关

const config = {}


/**
 * 网络请求基础方法
 * method: GET
 * urlStr: 请求接口Url
 * params: 请求参数
 * isEncode: 默认不进行数据加密 过滤第三方接口
 */
export const getRequest = function (urlStr, params, isEncode = false) {
  let that = this
  return request(that, 'GET', urlStr, params, isEncode)
}

/**
 * 网络请求基础方法
 * method: POST
 * urlStr: 请求接口Url
 * params: 请求参数
 * isEncode: 默认进行数据加密 过滤第三方接口
 */
export const postRequest = function (urlStr, params, isEncode = false) {
  let that = this
  return request(that, 'POST', urlStr, params, isEncode)
}

/**
 * 网络请求基础方法
 * method: POST GET
 * urlStr: 请求接口Url
 * params: 请求参数
 * isEncode: 默认进行数据加密
 */
export const postSoapRequest = function (urlStr, params,op) {
  var httpBody = '<?xml version="1.0" encoding="utf-8"?>';
      httpBody += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
      httpBody += '<soap:Body>';
      httpBody += '<'+op+' xmlns="http://tempuri.org/">';
      httpBody += '<strJson>'+params+'</strJson>';
      httpBody += '</'+op+'>';
      httpBody += '</soap:Body>';
      httpBody += '</soap:Envelope>';

      

  let promise = new Promise((resolve, reject) => {
    wx.request({
      // url: 'http://183.63.196.130:23030/Interface_HeTong.asmx?op=Interface_Cash_Details',
      url:urlStr,
      data: httpBody,  //请求体
      method: 'POST',  //使用POST请求
      header: { // 设置请求的 header
          'content-type': 'text/xml; charset=utf-8',
          'SOAPAction': 'http://tempuri.org/'+op,    //因为后台给的请求头上有该数据，所以也得加上
      },

      success: function (res) {   
        // console.log("H："+myDate.getHours()+"m:"+myDate.getMinutes()+"i:"+myDate.getSeconds())

        if (res.statusCode == 200) {
          // console.log(res);  //得到有规则的xml数据
          let str = res.data
          let index = str.indexOf("{\"code\":");
          let end = str.indexOf("</"+op+"Result>");
          //index是“=”的下标，index + 1就是“=”后一位数字（id的值就是10）
          let result = str.substring(index, end);

          result = JSON.parse(result);
          // console.log(result.data)
          if(result.data!=undefined && result.data !=''){
            let resultdata = result.data
            resultdata=resultdata.replace(/\\/g,"\\\\");
            resultdata=resultdata.replace(/\n/g,"\\n");
            resultdata=resultdata.replace(/\r/g,"\\r");
            resultdata=resultdata.replace(/\t/g,"\\t");
            resultdata=resultdata.replace(/("")+/g,"\"\"");
            resultdata=resultdata.replace(/\'/g,"&#39;");
            resultdata=resultdata.replace(/ /g," ");
            resultdata=resultdata.replace(/</g,"&lt;");
            resultdata=resultdata.replace(/>/g,"&gt;");

            try{
              
              result.data = JSON.parse(resultdata)
              
            }catch(err){
              // console.log(err)
              result.data = JSON.parse('['+resultdata+']')
            }
            
          }else{
            result.data = []
          }
          resolve(result);
        } else {
          that.config.toast('没有数据')
          reject(res)
        }
          
      },
      fail: function () {
          // fail
      },
      complete: function () {
          // complete
      }
    })
  })
  return promise;
}

