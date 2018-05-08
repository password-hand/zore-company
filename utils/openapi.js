var md5 = require('md5.js')
let security_key = "6be0138d0b104899935df8f1276f86e6"
let app_id = "9f8eeb6c167f4b89b13cf009a62259d3"
var token = ""
let tokenUrl = 'https://openapi.shujet.com/token/create?'
let basicUrl = 'https://openapi.shujet.com/gateway?'
let upload = 'https://openapi.shujet.com/upload?'
//网络请求
function dorequest(dic, method, callBack) {
  showTost('请稍后...', 3000 ,'loading')
  var that = this
  if (token === "") {
    getToken(function () {
      that.dorequest(dic, method, callBack)
    })
    return
  }
  wx.request({
    url: basicUrl,
    data: security(dic, method),
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      //token超时
      if (res.data.code === "20001") {
        token = ""
        //重新请求token
        getToken(function () {
          that.dorequest(dic, method, callBack)
        })
      }
      //如果返回数据不是100 提示错误
      else if (res.data.code !== "100") {
         showErrorTost(res.data.mesg)
          // console.log(res)
      } else {
        wx.hideToast()
        callBack(res)
        // console.log(res)
      }
    },
    fail: function (res) {
      showErrorTost("请求失败，请稍后再试")
    }
  })
}

function uploadImage(filePath, callBack) {
  wx.uploadFile({
    url: upload,
    filePath: filePath,
    name: 'file',
    formData: { "access_token": token, "action": "uploadimage", "app_id": app_id },
    success: function (res) {
      let obj = JSON.parse(res.data)
      //图片上传失败
      if (obj.code !== "100") {
        console.log(obj)
        showErrorTost(obj.mesg)
        callBack(null)
      } else { callBack(res) }
    },
    fail: function (res) {
      showErrorTost('图片上传失败，请稍后再试')
      callBack(null)
    }
  })
}

//获取token
function getToken(callBack) {
  var parmaer = new Array
  parmaer["app_secret"] = security_key
  parmaer["app_id"] = app_id
  wx.request({
    url: tokenUrl,
    data: security(parmaer, ""),
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      token = res.data.data
      if (callBack !== null) { callBack() }//存在回调 就进行回调
    }
  })
}

//请求参数加密
function security(dic, method) {
  var infoDic = new Array
  for (var key in dic) {
    infoDic[key] = dic[key]
  }
  infoDic["sign"] = jsonStr(dic)
  if (method !== "") { infoDic["method"] = method; }
  infoDic["access_token"] = token
  infoDic["version"] = "1.0"
  infoDic["app_id"] = app_id
  infoDic["sign_type"] = "md5"
  infoDic["timestamp"] = "" + Date.parse(new Date()) / 1000
  return infoDic
}

function jsonStr(dic) {
  var securityKeys = new Array
  for (var key in dic) {
    if (dic[key] !== "") {
      securityKeys.push(key);
    }
  }
  let result = securityKeys.sort(desc).map(x => x + "=" + dic[x]).join("&")
  let result1 = result + security_key
  return md5.md5(result1).toLocaleLowerCase()
}

//降序函数  
var desc = function (x, y) {
  if (x > y)
    return 1;  //返回一个小于0 的数即可  
  else
    return -1;  //返回一个大于0 的数即可  
}

function showTost(title, time, icons) {
  var loadTitle = title
  if (title === null || title === "") {
    loadTitle = "请输入内容"
  }
  if(icons === '' || icons === null || icons === undefined){
	  console.log(icons)
	icons = 'none'
  }
  wx.showToast({
    title: loadTitle,
    icon: icons,
    mask: true,
    duration: time,
  })
}
function showErrorTost(title) {
  var loadTitle = title
  if (title === null || title === "") {
    loadTitle = "请求失败"
  }
  
  wx.showToast({
    title: loadTitle,
    duration: 1500,
    icon: 'none',
    mask: true,
  })
}

module.exports = {
  getToken: getToken,
  dorequest: dorequest,
  upLoadImage: uploadImage,
  showTost: showTost
}