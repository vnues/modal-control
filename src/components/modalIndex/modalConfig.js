export default {
  // 首页
  index: {
    // 弹框列表
    modalList: [{
      id: 1, // 弹框的id
      name: 'modalA',
      level: 100,
      // 弹框的优先级
      // 由前端控制弹框是否显示
      // 当我们一个活动过去了废弃一个弹框时候，可以不需要通过后端去更改
      frontShow: true
    }, {
      id: 2,
      name: 'modalB',
      level: 122,
      frontShow: true
    }, {
      id: 3,
      name: 'modalC',
      level: 70,
      frontShow: true
    }]
  }
}
