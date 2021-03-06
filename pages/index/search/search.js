var openapi = require('../../../utils/openapi.js');
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nothing: '',
    page:2,
    time:'',
    recordArr: [],
    arrs:[]
  },
  declareList: function (e) {
    let ind = e.currentTarget.dataset.index
    let num = this.data.declare_id[ind].declare_id
    wx.navigateTo({
      url: 'searchdeta/searchdeta?' + "&num=" + num,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    //查询当月申报记录
    var param = new Array
    var arr = []
    param['uid'] = '456789'
    param['pn'] = '1'
    param['ps'] = '10'
    param['date'] = options.datas
    openapi.dorequest(param, 'applet.declare.record.list', (res) => {
      console.log(res)
      arr.push(...res.data.data)
      for (let j = 0; j < arr.length; j++) {
        //arr[j].create_time = arr[j].create_time.split(' ')[0]
        arr[j].create_time = util.formatDate(arr[j].create_time)
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
        time: options.datas
      })
      console.log(self.data.recordArr.length)
      if (self.data.recordArr.length == 0) {
        self.setData({
          nothing: true
        })
      } else {
        self.setData({
          nothing: false,
          declare_id: res.data.data
        })
      }
    })
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
    param['date'] = self.data.time
    openapi.dorequest(param, 'applet.declare.record.list', (res) => {
   //   console.log(res)
      arr.push(...res.data.data)
      for (let j = 0; j < arr.length; j++) {
        // arr[j].create_time = arr[j].create_time.split(' ')[0]
        arr[j].create_time = util.formatDate(arr[j].create_time)
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
          page:2
        })
      }
    })
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (options) {
    var self = this;
    //查询按照时间查询申报记录
    var param = new Array
    var arrss = []
    param['uid'] = '456789'
    param['pn'] = self.data.page
    param['ps'] = '10'
    param['date'] = self.data.time
    openapi.dorequest(param, 'applet.declare.record.list', (res) => {
      self.data.arrs.push(...res.data.data)
      console.log(self.data.arrs)
      for (let j = 0; j < self.data.arrs.length; j++) {
        // self.data.recordArr[j].create_time = self.data.recordArr[j].create_time.split(' ')[0]
        self.data.arrs[j].create_time = util.formatDate(self.data.arrs[j].create_time)
        self.data.arrs[j].changeYJ = ''
        self.data.arrs[j].changeSF = ''
        if (self.data.arrs[j].declare_way == '00') {
          self.data.arrs[j].declare_way = '月报'
          self.data.arrs[j].changeYJ = true
        }
        if (self.data.arrs[j].declare_way == '01') {
          self.data.arrs[j].declare_way = '季报'
          self.data.arrs[j].changeYJ = false
        }
        if (self.data.arrs[j].declare_result == '成功') {
          self.data.arrs[j].changeSF = true
        }
        if (self.data.arrs[j].declare_result == '失败') {
          self.data.arrs[j].changeSF = false
        }
      }
      arrss.push(...self.data.recordArr)
      arrss.push(...self.data.arrs)
      self.setData({
        recordArr: arrss,
        declare_id: arrss
      })
    })
    self.data.page++
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})