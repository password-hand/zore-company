var openapi = require('../../../utils/openapi.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查询当月申报记录
    var param = new Array
    var arr = []
    param['id'] = options.num
    openapi.dorequest(param, 'declare.record.detail', (res) => {
      //console.log(res)
      if (res.data.data.declare_way == '00') {
        res.data.data.declare_way = '月报'
      }
      if (res.data.data.declare_way == '01') {
        res.data.data.declare_way = '季报'
      }
      if (res.data.data.declare_state == '00') {
        res.data.data.declare_way = '已申报'
      }
      if (res.data.data.declare_state == '01') {
        res.data.data.declare_way = '未申报'
      }
       if (res.data.data.declare_state == '02') {
        res.data.data.declare_way = '逾期未申报'
      }
      if (res.data.data.declare_state == '03') {
        res.data.data.declare_way = '已提交'
      }
      if (res.data.data.failure_reason == null) {
        res.data.data.failure_reason = '无'
      }
      arr.push(res.data.data)
      this.setData({
        detailArr: arr
      })
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