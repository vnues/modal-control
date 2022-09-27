/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import modalMap from './modalConfig'

const getAllModalList = mapObj => {
  let currentList = []
  if (mapObj.modalList) {
    currentList = currentList.concat(
      mapObj.modalList.reduce((t, c) => t.concat(c.id), [])
    )
  }
  if (mapObj.children) {
    currentList = currentList.concat(
      Object.values(mapObj.children).reduce((t, c) => {
        return t.concat(getAllModalList(c))
      }, [])
    )
  }
  return currentList
}

class ModalControl {
  constructor (type) {
    this.type = type // 页面
    this.modalFlatMap = {} // 收集所有弹框
    this.clientList = {} // callback队列
    this.showModalList = [] // 要展示弹框队列
    this.highestLevelModal = {} // 最高层级弹框
    this.modalList = getAllModalList(modalMap[this.type])
  }
  on(modalName,fn){
    if(!this.clientList[modalName]){
      this.clientList[modalName] = []
    }
    this.clientList[modalName].push(fn)
    this.preCheck()
  }
  emit () {
    let key = Array.prototype.shift.call(arguments)
    if(!this.clientList[key]){
      return false
    }
    for (let i = 0;i<this.clientList[key].length; i++) {
      let fn = this.clientList[key][i]
      fn.apply(this,arguments)
    }
  }
  add (modalItem, infoObj) {
    this.modalFlatMap[modalItem.name] = {
      id: modalItem.id,
      level: modalItem.level,
      frontShow: modalItem.frontShow,
      backShow: infoObj.backShow,
      handler: infoObj.handler
    }
    this.preCheck()
  }

  preCheck () {
    if (this.modalList.length === Object.values(this.modalFlatMap).length) {
      this.notify()
    }
  }

  notify () {
    const highLevelModal = Object.values(this.modalFlatMap).filter(item => item.backShow && item.frontShow).reduce((t, c) => {
      return c.level > t.level ? c : t
    }, { level: -1 })
    highLevelModal.handler && highLevelModal.handler()
  }
}

const controlTypeMap = {}
// 获取单例
function createModalControl (type) {
  if (!controlTypeMap[type]) {
    controlTypeMap[type] = new ModalControl(type)
  }
  console.log('controlTypeMap[type]', controlTypeMap[type])
  return controlTypeMap[type]
}

export default createModalControl
