const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/')
}


const formatDate = (date) => {
  if (!date) {
    return date;
  }
  date = new Date(date);
  let map = {
    'y': date.getFullYear(), //n年
    'M': date.getMonth() + 1, // 月份
    'd': date.getDate(), // 日
    'h': date.getHours(), // 小时
    'm': date.getMinutes(), // 分
    's': date.getSeconds(), // 秒
    'q': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  var arrM = []
  var arrd = []
  if (map.M.toString().split('').length == 1) {
    arrM[0] = '0' + map.M
  } else {
    arrM.push(map.M)
  }
  if (map.d.toString().split('').length == 1) {
    arrd[0] = '0' + map.d
  } else {
    arrd.push(map.d)
  }
  return map.y + '-' + arrM.join() + '-' + arrd.join()
};
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate
}
