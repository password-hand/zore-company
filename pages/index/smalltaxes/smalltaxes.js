var openapi = require('../../../utils/openapi.js');
var util = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mun: 0,
    stage: '',
    page:2,
    changes: true,
    ind: '',
    arrMsg: [],
    chooseCompany: []
  },
  allChoose: function (e) {
    var changes = e.currentTarget.dataset.changes
    var self = this
    var arr = [];
    for (let i = 0; i < self.data.arrMsg.length; i++) {
      if (changes === false) {
        self.data.arrMsg[i].change = true
        self.setData({
          changes: true
        })
      } else {
        self.data.arrMsg[i].change = false
        self.setData({
          changes: false
        })
      }
      self.setData({
        arrMsg: self.data.arrMsg
      })
      if (self.data.arrMsg[i].change === false) {
        arr.push(self.data.arrMsg[i].change)
      }
      self.setData({
        mun: arr.length
      })
    }
  },
  showIco: function (e) {
    var arr = [];
    var self = this;
    var ind = e.currentTarget.dataset.id
    self.data.arrMsg[ind].change = !self.data.arrMsg[ind].change
    self.setData({
      arrMsg: self.data.arrMsg
    })
    for (let i = 0; i < self.data.arrMsg.length; i++) {
      if (self.data.arrMsg[i].change === false) {
        arr.push(self.data.arrMsg[i])
      }
      self.setData({
        mun: arr.length,
        chooseCompany: arr
      })
    }
  },
  confirmDeclareM: function () {
    var that = this
    //调零申报接口 看成功还是失败
    if (that.data.chooseCompany.length == 0) {
      openapi.showTost('请选择申报的企业', 2000)
    } else {
      //判断选中企业的enterprise_id
      for (var i = 0; i < that.data.chooseCompany.length; i++) {
        if (that.data.chooseCompany[i].declareType == '月报') {
          that.data.chooseCompany[i].declareType = '00'
        }
        if (that.data.chooseCompany[i].declareType == '季报') {
          that.data.chooseCompany[i].declareType = '01'
        }
        //添加申报记录接口
        var arrAdd = []
        var arrAddJ = []
        var arrAddY = []
        var parmaer = new Array
        parmaer['uid'] = "456789"
        parmaer['skssqz'] = that.data.sssq_z
        parmaer['declare_way'] = that.data.chooseCompany[i].declareType
        parmaer['failure_reason'] = "企业XXXXX有问题"
        parmaer['declare_state'] = "01"
        parmaer['declare_result'] = "失败"
        parmaer['skssqq'] = that.data.sssq_q
        parmaer['enterprise_id'] = that.data.chooseCompany[i].enterpriseId

        //调零申报接口 看成功还是失败
        // var parmaers = new Array
        // parmaers['djxh'] = this.data.chooseCompany[i].djxh
        // parmaers['sssq_q'] = this.data.sssq_q
        // parmaers['sssq_z'] = this.data.sssq_z
        // openapi.dorequest(parmaers, 'sjt.tax.zzsxgm0sb',  (res) => {
        //成功之后执行
        //console.log(res)
        openapi.dorequest(parmaer, 'applet.declare.add.record', (res) => {
          console.log(res)
          for (var i = 0; i < that.data.arrMsg.length; i++) {
            if (that.data.arrMsg[i].change == false) {
              arrAdd.push(that.data.arrMsg[i])
            }
          }
          for (var j = 0; j < arrAdd.length; j++) {
            if (arrAdd[j].declareType == '月报') {
              arrAddY.push(arrAdd[j])
            }
            if (arrAdd[j].declareType == '季报') {
              arrAddJ.push(arrAdd[j])
            }
          }
          let companyL = arrAdd.length
          let yuebao = arrAddY.length
          let jibao = arrAddJ.length
          wx.redirectTo({
            url: 'successfail/successfail?' + "&arrAdd=" + companyL + "&arrAddy=" + yuebao + "&arrAddj=" + jibao
          })
        })
        //})
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    //查询纳税人接口(一般纳税人)
    var parmaer = new Array
    var that = this
    var arrW = []
    parmaer["ps"] = '10'
    parmaer["nsrlx"] = '01'
    parmaer["pn"] = '1'
    openapi.dorequest(parmaer, 'applet.declare.state.list', (res) => {
      //添加判断图标显隐状态
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].change = true
        //处理申报状态
        switch (res.data.data[i].declareState) {
          case '00': res.data.data[i].declareState = '已申报'
            break;
          case '01': res.data.data[i].declareState = '未申报'
            break;
          case null: res.data.data[i].declareState = '未申报'
            break;
          case '02': res.data.data[i].declareState = '逾期未申报'
            break;
          case '03': res.data.data[i].declareState = '已提交'
            break;
        }
        //处理月报状态
        switch (res.data.data[i].declareType) {
          case '00': res.data.data[i].declareType = '月报'
            break;
          case '01': res.data.data[i].declareType = '季报'
            break;
        }
        //挑出未申报
        if (res.data.data[i].declareState == '未申报') {
          arrW.push(res.data.data[i])
        }
      }
      that.setData({
        arrMsg: arrW
      })
    })
    //获取本地时间
    var time = util.formatTime(new Date())
    var sssq_q = ''
    var sssq_z = ''
    //判断月份天数
    //闰年
    if (time.split('/')[0] % 4 == 0 && time.split('/')[0] % 100 != 0) {
      if (time.split('/')[1] == '02') {
        sssq_z = time.split('/')[0] + '-' + time.split('/')[1] + '-' + '29'
      }
      else if (time.split('/')[1] == '04' || time.split('/')[1] == '06' || time.split('/')[1] == '09' | time.split('/')[1] == '11') {
        sssq_z = time.split('/')[0] + '-' + time.split('/')[1] + '-' + '30'
      }
      else {
        sssq_z = time.split('/')[0] + '-' + time.split('/')[1] + '-' + '31'
      }
    }
    else {
      if (time.split('/')[1] == '02') {
        sssq_z = time.split('/')[0] + '-' + time.split('/')[1] + '-' + '28'
      }
      else if (time.split('/')[1] == '04' || time.split('/')[1] == '06' || time.split('/')[1] == '09' | time.split('/')[1] == '11') {
        sssq_z = time.split('/')[0] + '-' + time.split('/')[1] + '-' + '30'
      }
      else {
        sssq_z = time.split('/')[0] + '-' + time.split('/')[1] + '-' + '31'
      }
    }
    sssq_q = time.split('/')[0] + '-' + time.split('/')[1] + '-' + '01'
    that.setData({
      sssq_q: sssq_q,
      sssq_z: sssq_z
    })

    //添加判断选中图标显隐属性
    var msg = this.data.arrMsg
    for (var i = 0; i < this.data.arrMsg.length; i++) {
      msg[i].change = true
    }
    this.setData({
      arrMsg: msg
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    //查询纳税人接口(一般纳税人)
    var parmaer = new Array
    var that = this
    var arrW = []
    parmaer["ps"] = '10'
    parmaer["nsrlx"] = '00'
    parmaer["pn"] = '1'
    openapi.dorequest(parmaer, 'applet.declare.state.list', (res) => {
      console.log(res)
      //添加判断图标显隐状态
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].change = true
        //处理申报状态
        switch (res.data.data[i].declareState) {
          case '00': res.data.data[i].declareState = '已申报'
            break;
          case '01': res.data.data[i].declareState = '未申报'
            break;
          case null: res.data.data[i].declareState = '未申报'
            break;
          case '02': res.data.data[i].declareState = '逾期未申报'
            break;
          case '03': res.data.data[i].declareState = '已提交'
            break;
        }
        //处理月报状态
        switch (res.data.data[i].declareType) {
          case '00': res.data.data[i].declareType = '月报'
            break;
          case '01': res.data.data[i].declareType = '季报'
            break;
        }
        //挑出未申报
        if (res.data.data[i].declareState == '未申报') {
          arrW.push(res.data.data[i])
        }
      }
      that.setData({
        arrMsg: arrW,
        page: 2
      })
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
    //查询纳税人接口(一般纳税人)
    var parmaer = new Array
    var that = this
    var arrW = []
    parmaer["ps"] = '10'
    parmaer["nsrlx"] = '00'
    parmaer["pn"] = that.data.page
    openapi.dorequest(parmaer, 'applet.declare.state.list', (res) => {
      //console.log(res)
      //添加判断图标显隐状态
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].change = true
        //处理申报状态
        switch (res.data.data[i].declareState) {
          case '00': res.data.data[i].declareState = '已申报'
            break;
          case '01': res.data.data[i].declareState = '未申报'
            break;
          case null: res.data.data[i].declareState = '未申报'
            break;
          case '02': res.data.data[i].declareState = '逾期未申报'
            break;
          case '03': res.data.data[i].declareState = '已提交'
            break;
        }
        //处理月报状态
        switch (res.data.data[i].declareType) {
          case '00': res.data.data[i].declareType = '月报'
            break;
          case '01': res.data.data[i].declareType = '季报'
            break;
        }
        //挑出 未申报
        if (res.data.data[i].declareState == '未申报') {
          that.data.arrMsg.push(res.data.data[i])
        }
      }
      that.setData({
        arrMsg: that.data.arrMsg
      })
    })
    that.data.page++
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {

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
})