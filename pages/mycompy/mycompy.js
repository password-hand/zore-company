// pages/me/me.js
var openapi = require('../../utils/openapi.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 2,
    noCompany: true,
    userEnterpriseId: '',
    //添加企业信息
    addCompany: [],
  },

  //添加企业
  addCompanyP: function () {
    wx.redirectTo({
      url: 'addcompany/addcompany',
    })
  },
  // 删除企业
  deleteMsg: function (e) {
    var self = this;
    var parmaer = new Array
    parmaer["userEnterpriseId"] = this.data.userEnterpriseId
    wx.showModal({
      title: '确定要删除企业，删除后EB不会增加',
      success: function (res) {
        if (res.confirm) {
          //删除视图列表
          var ind = e.currentTarget.dataset.id
          openapi.dorequest(parmaer, 'applet.enterpris.unbinde.single.user', (res) => {
            if (res.data.code == 100) {
              self.data.addCompany.splice(ind, 1)
              self.setData({
                addCompany: self.data.addCompany
              })
              if (self.data.addCompany.length === 0) {
                self.setData({
                  noCompany: true,
                })
              }
            }
            else if (res.cancel) {

            }
          })
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var parmaer = new Array
    parmaer["uid"] = '456789'
    parmaer["pn"] = '1'
    //请求查询绑定的企业
    openapi.dorequest(parmaer, 'applet.enterprise.bound.query', (res) => {
      //进入页面判断是否有添加企业
      if (res.data.data.enterprise.length == 0) {
        this.setData({
          noCompany: true,
        })
      } else {
        this.setData({
          noCompany: false,
          addCompany: res.data.data.enterprise,
          userEnterpriseId: res.data.data.enterprise[0].userEnterpriseId,
          page: 2
        })
        // 隐藏导航栏加载框  
        wx.hideNavigationBarLoading();
        // 停止下拉动作  
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // wx.showLoading({
    //   title: '玩命加载中',
    // }) 
    var parmaer = new Array
    var newArray = []
    parmaer["uid"] = '456789'
    parmaer['pn'] = this.data.page
    //请求查询绑定的企业
    openapi.dorequest(parmaer, 'applet.enterprise.bound.query', (res) => {
      //进入页面判断是否有添加企业
      this.data.addCompany.push(...res.data.data.enterprise)
      this.setData({
        addCompany: this.data.addCompany
      })
    })
    this.data.page++
    // wx.hideLoading(); 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面刷新
    var parmaer = new Array
    parmaer["uid"] = '456789'
    //请求查询绑定的企业
    openapi.dorequest(parmaer, 'applet.enterprise.bound.query', (res) => {
      //进入页面判断是否有添加企业
      //console.log(res)
      if (res.data.data.enterprise.length == 0) {
        this.setData({
          noCompany: true,
        })
      } else {
        this.setData({
          noCompany: false,
          addCompany: res.data.data.enterprise,
          userEnterpriseId: res.data.data.enterprise[0].userEnterpriseId
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})