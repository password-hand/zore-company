// pages/me/me.js
var openapi = require('../../../utils/openapi.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    str: 'ghADE2RXsdgsdgADFSSDFgHGhgTfdcVHvgFf66787876GFYfCGcfre5EgcGFC5eCG6Ytft5VyfTF65rFc656f6F5tc76DE7uTYgJKOij87uiVY3KL45436SDG534dfgSDdfbghfERTETH345RTHJklFG6MNopVWqOPQZabcdijHefmuBCvwSTUxyz01IJ78nrst9',
    arrtaxes: ['请选择申报类型', '月报', '季报'],
    arrcontact: ['请选择联系人'],
    index1: 0,
    index2: 0,
    //addContent: false,
    //noCompany: true,
    userEnterpriseId: '',
    //添加企业信息
    addCompany: [],
    checkedImg: '',
    checkedTel: '',
    letter: '',
    checknum: '',
    selectImg: false,
    djxh: '',
    dispalyNum: '',//识别号，诚信代码
    name: '',//公司名字
    address: '',//地址
    contact: '',//联系人
    telNum: '',//电话
    ediID: '02', //申报方式
    staType: '',// 纳税人类型
    //checkedCode: '',//验证码
  },
  listenerPickerCon: function (e) {
    var contact = 'meg.contact'
    var self = this;
    //改变index值，通过setData()方法重绘界面
    self.setData({
      index1: e.detail.value,
      [contact]: self.data.arrcontact[e.detail.value],
      contact: self.data.contact
    });
  },
  listenerPickerTaxes: function (e) {
    var self = this;
    var type = e.detail.value
    if (type == 1) {
      self.setData({
        ediID: '00'
      })
    } else if (type == 2) {
      self.setData({
        ediID: '01'
      })
    } else {
      self.setData({
        ediID: '02'
      })
    }
    //改变index值，通过setData()方法重绘界面
    self.setData({
      index2: e.detail.value,
    });
  },
  //识别号验证
  checkedId: function () {
    var that = this
    var parmaer = new Array
    parmaer["nsrsbh"] = that.data.dispalyNum
    openapi.dorequest(parmaer, 'ums.enterprise.nsrsbh.role.query', (res) => {
      //console.log(res)
      var roles = res.data.data.roles
      var arrRoles = []
      for (var i = 0; i < roles.length; i++) {
        arrRoles.push(roles[i].bdfzrmc + '(' + roles[i].jslxmc + ')')
      }
      that.setData({
        selectImg: true,
        name: res.data.data.nsrmc,
        address: res.data.data.scjydz,
        telNum: res.data.data.zgswjgdm,
        djxh: res.data.data.djxh,
        staType: '',
        arrcontact: arrRoles
      })
    })
  },
  //获取输入框图形验证码
  checkedImg: function (e) {
    this.setData({
      checkedImg: e.detail.value
    })
  },
  //获取输入框手机验证码
  checkedTel: function (e) {
    this.setData({
      checkedTel: e.detail.value
    })
  },
  //发送验证码
  sondMsg: function () {
    var parmaer = new Array
    parmaer["mobile"] = '12515485548'//最初获取的手机号
    openapi.dorequest(parmaer, 'applet.captcha.sendsms', (res) => {
      //console.log(res)
      this.setData({
        checknum: res.data.smsCode
      })
    })
  },

  //确认添加
  confirmAdd: function (e) {
    var self = this
    //判断
    var checkedImg = self.data.checkedImg.toLowerCase()
    var checkedTel = self.data.checkedTel
    var letter = self.data.letter.toLowerCase()
    var checknum = self.data.checknum.toLowerCase()
    var parmaer = new Array
    var add = e.currentTarget.dataset
    if (checkedImg === "" || checkedTel === "" || self.data.ediID=='02') {//|| checkedImg != letter || checkedTel ！= checknum
      openapi.showTost('请输入正确信息', 2000)
    } else {
      parmaer["type"] = self.data.ediID
      parmaer["uid"] = '456789'
      parmaer["nsrsbh"] = self.data.dispalyNum
      parmaer["djxh"] = self.data.djxh
      //用户绑定企业
      openapi.dorequest(parmaer, 'applet.enterprise.bind.user', (res) => {
        let company = res.data.data.nsrmc
        let code = res.data.data.nsrsbh
        let ediID = res.data.data.declareTypeName
        let staType = res.data.data.nsrlxmc
        if (res.data.code == 100) {
          wx.redirectTo({
            url: '../sucess/sucess?' + "&company=" + company + "&code=" + code + "&ediID=" + ediID + "&staType=" + staType
          })
        }
      })
    }
  },
  //获取输入框数据 识别号
  dispalyNum: function (e) {
    this.setData({
      dispalyNum: e.detail.value
    })
  },
  // getCompany: function (e) {
  //   var name = 'meg.name'
  //   this.setData({
  //     [name]: e.detail.value
  //   })
  // },
  // getAddress: function (e) {
  //   var address = 'meg.address'
  //   this.setData({
  //     [address]: e.detail.value
  //   })
  // },
  // //联系人
  // getContact: function (e) {
  //   console.log(e)
  //   var contact = 'meg.contact'
  //   this.setData({
  //     contact: e.detail.value
  //   })
  // },
  // getTelnum: function (e) {
  //   var telNum = 'meg.telNum'
  //   this.setData({
  //     [telNum]: e.detail.value
  //   })
  // },
  // //申报方式
  // getediID: function (e) {
  //   var ediID = 'meg.ediID'
  //   this.setData({
  //     ediID: e.detail.value
  //   })
  // },
  // getType: function (e) {
  //   var staType = 'meg.staType'
  //   this.setData({
  //     [staType]: e.detail.value
  //   })
  // },
  // getCheckedCode: function (e) {
  //   var checkedCode = 'meg.checkedCode'
  //   this.setData({
  //     [checkedCode]: e.detail.value
  //   })
  // },
  //改变验证码
  changeImg: function () {
    var randomNum = ""
    var str = this.data.str
    for (var i = 0; i < 4; i++) {
      var index = Math.round(Math.random() * str.length);
      randomNum += str.charAt(index);
    }
    this.setData({
      letter: randomNum
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面刷新
    var randomNum = ""
    var str = this.data.str
    for (var i = 0; i < 4; i++) {
      var index = Math.round(Math.random() * str.length);
      randomNum += str.charAt(index);
    }
    this.setData({
      letter: randomNum,
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