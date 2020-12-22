// 实际开发中，接口的数据定义和返回肯定是不一样的
// 这里只是为了更形象地模拟多个接口
export const api1 = (item) =>
  new Promise(resolve => {
  // 通过 setTimeout模拟接口的异步请求
    setTimeout(() => {
      resolve({
        backShow: true,
        item,
        msg: '我是Api1 显示弹框'
      })
    }, Math.random() * 3000)
  })

export const api2 = (item) =>
  new Promise(resolve => {
  // 通过 setTimeout模拟接口的异步请求
    setTimeout(() => {
      resolve({
        backShow: false,
        item,
        msg: '我是Api2 不显示弹框'
      })
    }, Math.random() * 3000)
  })

export const api4 = (item) =>
  new Promise(resolve => {
  // 通过 setTimeout模拟接口的异步请求
    setTimeout(() => {
      resolve({
        backShow: false,
        item,
        msg: '我是Api4 显示弹框'
      })
    }, Math.random() * 3000)
  })
