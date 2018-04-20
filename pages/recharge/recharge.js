// pages/recharge/recharge.js
var openapi = require('../../utils/openapi.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrEb: [],
    arrMsg: [],
    chooseIndexE: 0,
    chooseConM: '',
    chooseIndexMsg: 0,
    money: 100,
    checkedEB: true,
    checkedMsg: false,
    showMain: false,
    img: '',
    niceName: '',
    show: true,
    showM: true,
    inpValueE: '',
    inpValueM: '',
    beAmount:'',
    smsAmount:'',
    constEX:'',
    constEY:'',
    constMX: '',
    constMY: '',
    goodsId:''

  },
  showEB: function () {
    this.setData({
      checkedEB: true,
      checkedMsg: false,
      showMain: false
    })
  },
  showMsg: function () {
    //查询商品列表(短信)
    var param = new Array
    param["type"] = '01'
    openapi.dorequest(param, 'applet.goods.list', (res) => {
      //console.log(res)
      this.setData({
        arrMsg: res.data.data,
        constMX: res.data.data[0].goodsPrice,
        constMY: res.data.data[0].originalPrice,
        goodsId: res.data.data[0].goodsId,
      })
    })
    this.setData({
      checkedEB: false,
      checkedMsg: true,
      showMain: true
    })
  },
  chooseCountE: function (e) {
    var ind = e.currentTarget.dataset.index
    var self = this;
    var param = new Array
    param["type"] = '00'
    openapi.dorequest(param, 'applet.goods.list', (res) => {
      self.setData({
        chooseIndexE: ind* 1,
        //chooseConE: e.currentTarget.dataset.con,
        constEX: res.data.data[ind].goodsPrice,
        constEY: res.data.data[ind].originalPrice,
        goodsId: res.data.data[ind].goodsId,
      })
    })

  },
  // cancel: function () {
  //   this.setData({
  //     show: true,
  //     showM: true,
  //   })
  // },
  
  // chooseCountM: function (e) {
  //   var self = this;
  //   self.setData({
  //     chooseIndexM: e.currentTarget.dataset.id * 1,
  //   })
  // },
  chooseCountMsg: function (e) {
    var ind = e.currentTarget.dataset.index
    var self = this;
    var param = new Array
    param["type"] = '01'
    openapi.dorequest(param, 'applet.goods.list', (res) => {
      self.setData({
        chooseIndexMsg: ind * 1,
        constMX: res.data.data[ind].goodsPrice,
        constMY: res.data.data[ind].originalPrice,
        goodsId: res.data.data[ind].goodsId,
      })
    })
  },
//EB支付
  wechatPayEB: function(){
console.log('sf')
  //创建订单
  var param = new Array
  param["goodsId"] = this.data.goodsId
  param["uid"] = '456789'
  openapi.dorequest(param, 'applet.order.create', (res) => {
   // console.log(res)
  })
  },

  
  // 短信支付
  wechatPayMsg: function () {
    //创建订单
    var param = new Array
    param["goodsId"] = this.data.goodsId
    param["uid"] = '456789'
    openapi.dorequest(param,'applet.order.create',(res)=>{
     // console.log(res)
    })






    // wx.requestPayment({
    //   'timeStamp': '',
    //   'nonceStr': '',
    //   'package': '',
    //   'signType': 'MD5',
    //   'paySign': '',
    //   'success': function (res) {
    //     console.log('asfd')
    //   },
    //   'fail': function (res) {
    //     console.log('a333sfd')
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //查询套餐数量
    var par = new Array
    par["uid"] = '456789'
    openapi.dorequest(par, 'applet.package.amount', (res) => {
      //console.log(res.data)
      this.setData({
        smsAmount: res.data.data.smsAmount,
        beAmount: res.data.data.beAmount
      })
    })
    //查询商品列表(EB)
    var param = new Array
    param["type"] = '00'
    openapi.dorequest(param, 'applet.goods.list', (res) => {
      //console.log(res)
      this.setData({
        arrEb: res.data.data,
        constEX: res.data.data[0].goodsPrice,
        constEY: res.data.data[0].originalPrice,
        goodsId: res.data.data[0].goodsId, 
      })
    })



    wx.getUserInfo({
      success: (res) => {
        this.setData({
          img: res.userInfo.avatarUrl,
          niceName: res.userInfo.nickName
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})