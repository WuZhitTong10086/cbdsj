const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const dataToFixed = (data, num) => {
  if(data == null || data == undefined || data == "" || data == '0' || data == 'null'){
    return "0";
  }
  return (parseFloat(data)).toFixed(num)
}

const showdate = (n) =>{ // 日期切换处理函数  返回时间格式 YYYY-MM-DD
  var date = new Date();
  date.setDate(date.getDate() + n);
  var month = date.getMonth() + 1
  month = month > 10 ? month : '0' + month // 格式化月份
  var day = date.getDate()
  day = day > 10 ? day : '0' + day // 格式化日期
  date = date.getFullYear() + "-" + month + "-" + day
  return date;
}

const dataEmptyZero = (data) => {
  data = parseFloat(data)
  if(data == "0" || data == "0.0" || data == 0 || data == 'null'|| data == '' || data == undefined){
    return true;
  }
  return false
}
// 数据为空返回false 
const dataIsNotEmpty = (data) =>{
  if(data == 'null'|| data == '' || data == undefined){
    return false;
  }
  return true
} 


module.exports = {
  formatTime,
  dataToFixed,
  showdate,
  dataEmptyZero,
  dataIsNotEmpty
}
