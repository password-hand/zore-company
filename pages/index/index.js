//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
var openapi = require('../../utils/openapi.js');

Page({
  data: {
    skip: true,
    index0: 100,
    index1: 0,
    index2: 0,
    arrayYear: [],
    arrayMouth: [],
    arrayDay: [],
    //昵称
    niceName: '',
    //剩余天数
    days: '',
    stagese: '',
    //循环图标
    img: '',
    //tab切换
    home: '',
    eb: '',
    message: '',
    company: '',
    me: true,
    dataTime: '',
    //申报与否条件判断
    recode: 'true',
    searchSta: false,
    //选中状态
    checkedHome: true,
    checkedMe: false,
    date: '',
    //弹框状态
    showPop: true,
    year: '',
    mouth: '',
    day: '',
    recordArr: [],
    changeYJ: '',
    changeSF: '',
    declare_id: '',
    srollHeight: '',
    page:2
  },
  onLoad: function () {

    var time = util.formatTime(new Date())
    var arrTime = time.split('/')
    var year = arrTime[0]
    var mouth = arrTime[1]
    var day = arrTime[2]
    var arrayYears = this.data.arrayYear
    var arrayMouths = this.data.arrayMouth
    var arrayDays = this.data.arrayDay
    var that = this
    var ping
    // if (wx.getSystemInfoSync().windowWidth > 380) {
    //   ping = 440
    // } else {
    //   ping = 370
    // }
    that.setData({
      //设置本地时间为默认时间
      year: arrTime[0],
      mouth: arrTime[1],
      day: arrTime[2],
      index1: mouth - 1,
      index2: day - 1,
      //srollHeight: (wx.getSystemInfoSync().windowHeight - ping) * 2
    })
    // console.log(this.data.srollHeight)
    wx.getUserInfo({
      success: (res) => {
        that.setData({
          img: res.userInfo.avatarUrl,
          niceName: res.userInfo.nickName
        })
      }
    })
    for (var i = year * 1 - 100; i < year * 1 + 100; i++) {
      arrayYears.push(i)
    }
    that.setData({
      arrayYear: arrayYears
    })
    for (var i = 1; i <= 12; i++) {
      if (i < 10) { i = '0' + i }
      arrayMouths.push(i)
    }
    that.setData({
      arrayMouth: arrayMouths
    })
    if (that.data.mouth == '04' || that.data.mouth == '06' || that.data.mouth == '09' || that.data.mouth == '11') {
      for (var i = 1; i < 31; i++) {
        if (i < 10) { i = '0' + i }
        arrayDays.push(i)
      }
    } else {
      for (var i = 1; i <= 31; i++) {
        if (i < 10) { i = '0' + i }
        arrayDays.push(i)
      }
    }
    that.setData({
      arrayDay: arrayDays
    })

    //查询套餐数量
    var parmaer = new Array
    parmaer["uid"] = '456789'
    openapi.dorequest(parmaer, 'applet.package.amount', (res) => {
      //console.log(res.data.data)
      this.setData({
        eb: res.data.data.ebAmount,
        message: res.data.data.smsAmount,
        company: res.data.data.beAmount
      })
    })

    //查询当月申报记录
    var param = new Array
    var arr = []
    param['uid'] = '456789'
    param['pn'] = '1'
    param['ps'] = '10'
    param['month'] = '01'
    openapi.dorequest(param, 'applet.declare.record.list', (res) => {
      console.log(res)
      arr.push(...res.data.data)
      for (let j = 0; j < arr.length; j++) {
        arr[j].create_time = arr[j].create_time.split(' ')[0]
        arr[j].changeYJ = ''
        arr[j].changeSF = ''
        if (arr[j].declare_way == '00') {
          arr[j].declare_way = '月报'
          arr[j].changeYJ = true
        }
        if (arr[j].declare_way == '01') {
          arr[j].declare_way = '季报'
          arr[j].changeYJ = false

        }
        if (arr[j].declare_result == '成功') {
          arr[j].changeSF = true

        }
        if (arr[j].declare_result == '失败') {
          arr[j].changeSF = false
        }
      }
      this.setData({
        recordArr: arr
      })
      if (this.data.recordArr.length == 0) {
        this.setData({
          recode: true
        })
      } else {
        this.setData({
          recode: false,
          declare_id: res.data.data
        })
      }
    })

    //查询距离申报天数
    var params = new Array
    params['ss'] = ''
    openapi.dorequest(params, 'applet.declare.deadline', (res) => {
      //console.log(res)
      if (res.data.data.deadline == '01') {
        that.setData({
          stagese: '开始',
          days: res.data.data.day
        })
      } else {
        that.setData({
          stagese: '结束',
          days: res.data.data.day
        })
      }
    })
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.record']) {
    //       wx.authorize({
    //         scope: 'scope.record',
    //         success() {
    //           // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
    //           wx.startRecord()
    //         }
    //       })
    //     }
    //   }
    // })
  },
  //授权页跳过
  skipPage: function () {
    this.setData({
      skip: false
    })
  },
  showHome: function () {
    let self = this;
    self.setData({
      home: false,
      me: true,
      checkedHome: true,
      checkedMe: false,
      searchSta: false
    })
  },
  showMe: function () {
    let self = this;
    self.setData({
      home: true,
      me: false,
      checkedHome: false,
      checkedMe: true,
      searchSta: true
    })
  },
  //当月申报记录详情
  detailsRecord: function (e) {
    let ind = e.currentTarget.dataset.index
    let num = this.data.declare_id[ind].declare_id
    wx.navigateTo({
      url: 'details/details?' + "&num=" + num,
    })
  },

  comtaxesList: function () {
    //查询纳税人接口
    var parmaer = new Array
    parmaer["ps"] = '10'
    parmaer["nsrlx"] = '00'
    parmaer["pn"] = '1'
    openapi.dorequest(parmaer, 'applet.declare.state.list', (res) => {
      //console.log(res)
    })
    wx.navigateTo({
      url: 'commontaxes/commontaxes',
    })
  },
  smataxesList: function () {
    wx.navigateTo({
      url: 'smalltaxes/smalltaxes',
    })
  },
  showDate: function (e) {
    this.setData({
      showPop: false
    })
  },
  // 年份选择器
  bindDateYear: function (e) {
    var self = this
    self.setData({
      index0: e.detail.value,
    })
    self.setData({
      year: self.data.arrayYear[self.data.index0]
    })
  },
  // 月份选择器
  bindDateMouth: function (e) {
    var self = this
    var str = e.detail.value
    self.setData({
      index1: e.detail.value,
    })
    self.setData({
      mouth: self.data.arrayMouth[self.data.index1]
    })
    //判断年份和月份
    let mou = self.data.mouth
    let yea = self.data.year
    if (mou == '04' || mou == '06' || mou == '09' || mou == 11) {
      if (this.data.index2 >= 30) {
        self.setData({
          index2: 29,
          day: 30
        })
      }
      self.data.arrayDay = []
      for (var i = 1; i <= 30; i++) {
        if (i < 10) { i = '0' + i }
        self.data.arrayDay.push(i)
      }
      self.setData({
        arrayDay: self.data.arrayDay
      })
    }
    if (yea % 4 != 0 && mou == '02') {
      if (this.data.index2 >= 28) {
        self.setData({
          index2: 27,
          day: 28
        })
      }
      self.data.arrayDay = []
      for (var i = 1; i < 29; i++) {
        if (i < 10) { i = '0' + i }
        self.data.arrayDay.push(i)
      }
      self.setData({
        arrayDay: self.data.arrayDay
      })
    }
    if (yea % 4 == 0 && mou == '02') {
      if (this.data.index2 >= 29) {
        self.setData({
          index2: 28,
          day: 29
        })
      }
      self.data.arrayDay = []
      for (var i = 1; i <= 29; i++) {
        if (i < 10) { i = '0' + i }
        self.data.arrayDay.push(i)
      }
      self.setData({
        arrayDay: self.data.arrayDay,
      })
    }
    if (mou == '01' || mou == '03' || mou == '05' || mou == '07' || mou == '08' || mou == 10 || mou == 12) {
      self.data.arrayDay = []
      for (var i = 1; i <= 31; i++) {
        if (i < 10) { i = '0' + i }
        self.data.arrayDay.push(i)
      }
      self.setData({
        arrayDay: self.data.arrayDay
      })
    }
  },
  // 日期选择器
  bindDateDay: function (e) {
    var self = this
    self.setData({
      index2: e.detail.value,
    })
    self.setData({
      day: self.data.arrayDay[self.data.index2]
    })
  },
  cancelData: function (e) {
    var time = util.formatTime(new Date())
    var arrTime = time.split('/')
    var year = arrTime[0]
    var mouth = arrTime[1]
    var day = arrTime[2]
    this.setData({
      showPop: true,
      year: arrTime[0],
      mouth: arrTime[1],
      day: arrTime[2],
      index0: 100,
      index1: mouth - 1,
      index2: day - 1,
    })
  },
  //确认查询
  confirmData: function () {
    var time = util.formatTime(new Date())
    var arrTime = time.split('/')
    var mouth = arrTime[1]
    var day = arrTime[2]
    var time = this.data.year + '-' + this.data.mouth + '-' + this.data.day
    this.setData({
      showPop: true,
      year: arrTime[0],
      mouth: arrTime[1],
      day: arrTime[2],
      index0: 100,
      index1: mouth - 1,
      index2: day - 1,
      dataTime: time
    })
    wx.navigateTo({
      url: 'search/search?' + "&datas=" + this.data.dataTime
    })
  },
  declareRecord: function (e) {
    var self = this;
    wx.navigateTo({
      url: '../declare/declare'
    }),
      //添加成功后改变状态
      self.setData({
        recode: false
      })
  },
  showCom: function () {
    // //请求绑定企业列表
    // let company =''
    // var parmaer = new Array
    // parmaer["uid"] = '456789'
    // openapi.dorequest(parmaer,'applet.enterprise.bound.query',(res)=>{
    //   //console.log(res.data.data)
    //   company = res.data.data
    // })
    // console.log(company)
    wx.navigateTo({
      url: '../mycompy/mycompy'
    })
  },
  showRecharge: function () {
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },
  showOrder: function () {
    wx.navigateTo({
      url: '../myorder/myorder',
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this;
    //查询按照时间查询申报记录
    var param = new Array
    //var arr = []
    param['uid'] = '456789'
    param['pn'] = self.data.page
    param['ps'] = '10'
    param['month'] = '01'
    openapi.dorequest(param, 'applet.declare.record.list', (res) => {
      self.data.recordArr.push(...res.data.data)
      console.log(self.data.recordArr)
      for (let j = 0; j < self.data.recordArr.length; j++) {
        self.data.recordArr[j].create_time = self.data.recordArr[j].create_time.split(' ')[0]
        self.data.recordArr[j].changeYJ = ''
        self.data.recordArr[j].changeSF = ''
        if (self.data.recordArr[j].declare_way == '00') {
          self.data.recordArr[j].declare_way = '月报'
          self.data.recordArr[j].changeYJ = true
        }
        if (self.data.recordArr[j].declare_way == '01') {
          self.data.recordArr[j].declare_way = '季报'
          self.data.recordArr[j].changeYJ = false
        }
        if (self.data.recordArr[j].declare_result == '成功') {
          self.data.recordArr[j].changeSF = true
        }
        if (self.data.recordArr[j].declare_result == '失败') {
          self.data.recordArr[j].changeSF = false
        }
      }
      self.setData({
        recordArr: self.data.recordArr,
        declare_id: self.data.recordArr
      })
    })
    self.data.page++
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var self = this;
    //查询当月申报记录
    var param = new Array
    var arr = []
    param['uid'] = '456789'
    param['pn'] = '1'
    param['ps'] = '10'
    param['month'] = '01'
    openapi.dorequest(param, 'applet.declare.record.list', (res) => {
      //   console.log(res)
      arr.push(...res.data.data)
      for (let j = 0; j < arr.length; j++) {
        arr[j].create_time = arr[j].create_time.split(' ')[0]
        arr[j].changeYJ = ''
        arr[j].changeSF = ''
        if (arr[j].declare_way == '00') {
          arr[j].declare_way = '月报'
          arr[j].changeYJ = true
        }
        if (arr[j].declare_way == '01') {
          arr[j].declare_way = '季报'
          arr[j].changeYJ = false
        }
        if (arr[j].declare_result == '成功') {
          arr[j].changeSF = true
        }
        if (arr[j].declare_result == '失败') {
          arr[j].changeSF = false
        }
      }
      self.setData({
        recordArr: arr,
      })
      if (this.data.recordArr.length == 0) {
        this.setData({
          nothing: true
        })
      } else {
        this.setData({
          nothing: false,
          declare_id: res.data.data,
          page: 2
        })
      }
    })
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
  },
})
