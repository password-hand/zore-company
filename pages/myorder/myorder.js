var openapi = require('../../utils/openapi.js');

Page({
  data: {
    arrHead: ['全部', '已完成', '待付款', '已取消'],
    chooseCon: 0,
    showOder0: true,
    showOder1: true,
    showOder2: true,
    showOder3: true,
    show0: false,
    show1: true,
    show2: true,
    show3: true,
    mun0: 0,
    mun1: 1,
    mun2: 2,
    mun3: 3,
    allOrder: [],
    complete: [],
    cancel: [],
    waitpay: []
  },
  showCon: function (e) {
    var that = this;
    var wanP = []
    var quP = []
    var daiP = []
    var parmaer = new Array
    var num = e.currentTarget.dataset.id * 1
    that.setData({
      chooseCon: e.currentTarget.dataset.id * 1,
    })
    parmaer["uid"] = '456789'
    openapi.dorequest(parmaer, 'applet.order.list.my', (res) => {
      //判断是否有订单
      if (res.data.code == 100) {
        //判断订单状态
        if (res.data.data.order.length == 0) {
          that.setData({
            showOder0: true,
            showOder1: true,
            showOder2: true,
            showOder3: true,
          })
        } else {
          for (var i = 0; i < res.data.data.order.length; i++) {
            // 待付款 00
            if (res.data.data.order[i].payState == '00') {
              res.data.data.order[i].payState = '待付款'
              daiP.push(res.data.data.order[i])
            }
            // 已完成 01
            if (res.data.data.order[i].payState == '01') {
              res.data.data.order[i].payState = '已完成'
              wanP.push(res.data.data.order[i])
            }
            // 已取消 02
            if (res.data.data.order[i].payState == '02') {
              res.data.data.order[i].payState = '已取消'
              quP.push(res.data.data.order[i])
            }
          }
          that.setData({
            complete:wanP,
            cancel: quP,
            waitpay: daiP,
            allOrder: res.data.data.order
          })
          //判断数据多少，是否显示空状态
          if (that.data.allOrder.length != 0) {
            that.setData({
              showOder0: false,
              showOder1: false,
              showOder2: false,
              showOder3: false,
            })
          }
          else {
            that.setData({
              showOder0: true,
              showOder1: true,
              showOder2: true,
              showOder3: true,
            })
          }
          if (that.data.complete.length != 0) {
            that.setData({
              showOder1: false,
            })
          } else {
            that.setData({
              showOder1: true,
            })
          }
          if (that.data.cancel.length != 0) {
            that.setData({
              showOder3: false,
            })
          } else {
            that.setData({
              showOder3: true,
            })
          }
          if (that.data.waitpay.length != 0) {
            that.setData({
              showOder2: false,
            })
          } else {
            that.setData({
              showOder2: true,
            })
          }
        }
      }
    })
    if (num === that.data.mun0) {
      that.setData({
        show0: false,
        show1: true,
        show2: true,
        show3: true,
      })
    }
    else if (num === that.data.mun1) {
      that.setData({
        show1: false,
        show0: true,
        show2: true,
        show3: true,
      })
    }
    else if (num === that.data.mun2) {
      that.setData({
        show2: false,
        show0: true,
        show1: true,
        show3: true,
      })
    }
    else {
      that.setData({
        show3: false,
        show0: true,
        show2: true,
        show1: true,
      })
    }
  },
  //删除全部订单
  deleteAllOrder: function (e) {
    var param = new Array
    var self = this
    var index = e.currentTarget.dataset.index
    param['orderId'] = self.data.allOrder[index].orderId
    wx.showModal({
      title: '确定删除订单',
      success: function (res) {
        if (res.confirm) {
          //删除视图列表
          openapi.dorequest(param, 'applet.order.fdelete.single', (res) => {
            if (res.data.code == 100) {
              self.data.allOrder.splice(index, 1)
              self.setData({
                allOrder: self.data.allOrder
              })
              if (self.data.allOrder.length == 0) {
                self.setData({
                  showOder0: true,
                })
              }
            }
          })
        }
        else if (res.cancel) {
        }
      }
    })
  },
  //删除完成订单
  deleteComOrder: function (e) {
    var param = new Array
    var self = this
    var index = e.currentTarget.dataset.index
    param['orderId'] = self.data.complete[index].orderId
    //console.log(res)
    wx.showModal({
      title: '确定要删除订单',
      success: function (res) {
        if (res.confirm) {
          //删除视图列表
          openapi.dorequest(param, 'applet.order.fdelete.single', (res) => {
            if (res.data.code == 100) {
              self.data.complete.splice(index, 1)
              self.setData({
                complete: self.data.complete
              })
              if (self.data.complete.length == 0) {
                self.setData({
                  showOder1: true,
                })
              }
            }
          })
        }
        else if (res.cancel) {
        }
      }
    })
  },
  //删除待付款
  deleteWaitOrder: function (e) {
    var param = new Array
    var self = this
    var index = e.currentTarget.dataset.index
    param['orderId'] = self.data.waitpay[index].orderId
    //console.log(res)
    wx.showModal({
      title: '确定删除订单',
      success: function (res) {
        if (res.confirm) {
          //删除视图列表
          openapi.dorequest(param, 'applet.order.fdelete.single', (res) => {
            if (res.data.code == 100) {
              self.data.waitpay.splice(index, 1)
              self.setData({
                waitpay: self.data.waitpay
              })
            }
          })
          if (self.data.waitpay.length == 0) {
            self.setData({
              showOder2: true,
            })
          }
        }
        else if (res.cancel) {
         // console.log(self.data.showOder2)
        }
      }
    })
  },
  //删除取消
  deleteCancelOrder: function (e) {
    var param = new Array
    var self = this
    var index = e.currentTarget.dataset.index
    param['orderId'] = self.data.cancel[index].orderId
    wx.showModal({
      title: '确定删除订单',
      success: function (res) {
        if (res.confirm) {
          //删除视图列表
          openapi.dorequest(param, 'applet.order.fdelete.single', (res) => {
            if (res.data.code == 100) {
              self.data.cancel.splice(index, 1)
              self.setData({
                cancel: self.data.cancel
              })
              if (self.data.cancel.length == 0) {
                self.setData({
                  showOder3: true,
                })
              }
            }
          })
        }
        else if (res.cancel) {
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function () {
    var that = this
    var wanP = ''
    var quP = ''
    var daiP = ''
    var parmaer = new Array
    parmaer["uid"] = '456789'
    openapi.dorequest(parmaer, 'applet.order.list.my', (res) => {
      //console.log(res)
      //判断是否有订单
      if (res.data.code == 100) {
        //判断订单状态
        if (res.data.data.order.length == 0) {
          that.setData({
            complete: [wanP],
            cancel: [quP],
            waitpay: [daiP],
            allOrder: [],
          })
        } else {
          for (var i = 0; i < res.data.data.order.length; i++) {
            // 待付款 00
            if (res.data.data.order[i].payState == '00') {
              res.data.data.order[i].payState = '待付款'
              daiP = res.data.data.order[i]
            }
            // 已完成 01
            if (res.data.data.order[i].payState == '01') {
              res.data.data.order[i].payState = '已完成'
              wanP = res.data.data.order[i]
            }
            // 已取消 02
            if (res.data.data.order[i].payState == '02') {
              res.data.data.order[i].payState = '已取消'
              quP = res.data.data.order[i]
            }
          }
          that.setData({
            complete: [wanP],
            cancel: [quP],
            waitpay: [daiP],
            allOrder: res.data.data.order
          })
          //判断数据多少，是否显示空状态
          if (that.data.allOrder[0] != '') {
            that.setData({
              showOder0: false,
              showOder1: false,
              showOder2: false,
              showOder3: false,
            })
          } else {
            that.setData({
              showOder0: true,
              showOder1: true,
              showOder2: true,
              showOder3: true,
            })
          }
          if (that.data.complete[0] != '') {
            that.setData({
              showOder1: false,
            })
          } else {
            that.setData({
              showOder1: true,
            })
          }
          if (that.data.cancel[0] != '') {
            that.setData({
              showOder3: false,
            })
          } else {
            that.setData({
              showOder3: true,
            })
          }
          if (that.data.waitpay[0] != '') {
            that.setData({
              showOder2: false,
            })
          } else {
            that.setData({
              showOder2: true,
            })
          }
        }
      }
    })
  }
})




