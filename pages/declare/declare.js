var openapi = require('../../utils/openapi.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nothing:true,
    page:2,
    recordArr:[],
    arrs:[]
  },
  declareList:function(e){
     
    let ind = e.currentTarget.dataset.index
    let num = this.data.declare_id[ind].declare_id
    wx.navigateTo({
      url: 'declarelist/declarelist?' + "&num=" + num,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查询所有申报记录
    var param = new Array
    var arr = []
    param['uid'] = '456789'
    param['pn'] = '1'
    param['ps'] = '10'
    openapi.dorequest(param, 'applet.declare.record.list', (res) => {
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
      this.setData({
        recordArr: arr
      })
      if (this.data.recordArr.length == 0) {
        this.setData({
          nothing: true
        })
      } else {
        this.setData({
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
    openapi.dorequest(param, 'applet.declare.record.list', (res) => {
      console.log(res.data.data)
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
          page: 2
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
  onReachBottom: function () {
    var param = new Array
    var that = this
    var arrss = []
    param['uid'] = '456789'
    param['pn'] = that.data.page
    param['ps'] = '10'
    openapi.dorequest(param, 'applet.declare.record.list', (res) => {
      // that.data.recordArr.push(...res.data.data)
      that.data.arrs.push(...res.data.data)
      console.log(that.data.arrs)
      for (let j = 0; j < that.data.arrs.length; j++) {
        //this.data.recordArr[j].create_time = this.data.recordArr[j].create_time.split(' ')[0]
        that.data.arrs[j].create_time = util.formatDate(that.data.arrs[j].create_time)
        that.data.arrs[j].changeYJ = ''
        that.data.arrs[j].changeSF = ''
        if (that.data.arrs[j].declare_way == '00') {
          that.data.arrs[j].declare_way = '月报'
          that.data.arrs[j].changeYJ = true

        }
        if (that.data.arrs[j].declare_way == '01') {
          that.data.arrs[j].declare_way = '季报'
          that.data.arrs[j].changeYJ = false

        }
        if (that.data.arrs[j].declare_result == '成功') {
          that.data.arrs[j].changeSF = true

        }
        if (that.data.arrs[j].declare_result == '失败') {
          that.data.arrs[j].changeSF = false
        }
      }
      arrss.push(...that.data.recordArr)
      arrss.push(...that.data.arrs)
      that.setData({
        recordArr: arrss,
        declare_id: arrss
      }) 
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})