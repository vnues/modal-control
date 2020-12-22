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

const getModalItemByCondition = (condition, mapObj) => {
  let mapItem = null
  // 首先查找 modalList
  const isExist = (mapObj.modalList || []).some(item => {
    if (item.condition === condition || (Array.isArray(item.condition) && item.condition.includes(condition))) {
      mapItem = item
    }
    return mapItem
  })
  // modalList没找到，继续找 children
  if (!isExist) {
    Object.values(mapObj.children || []).some(mo => {
      mapItem = getModalItemByCondition(condition, mo)
      return mapItem
    })
  }
  return mapItem
}

// index_condition_1 这种形式防止重复
class ModalManage {
  constructor (type) {
    this.type = type // 页面类型
    this.modalFlatMap = {} // 缓存所有已经订阅的弹窗的信息
    this.conditionList = getAllModalList(modalMap[this.type]) // 这个参数其实就是刚进入页面时，页面上所有可能展示的弹窗(包括子组件的弹窗)的 id集合
    this.hasAddConditionList = [] // 用于缓存当前已经进行订阅操作的 condition
    console.log('conditionList:', this.conditionList)
  }

  add1(modalItem,infoObj){
    this.modalFlatMap[modalItem.id] = {
      level: modalItem.level,
      feShow: modalItem.frontShow,
      rdShow: infoObj.backShow,
      handler: infoObj.handler
    }
    this.notify()
  }
  add (condition, infoObj) {
    console.log('add condition:', condition)
    if (!this.conditionList.includes(condition)) return console.log('无效订阅:', condition)
    if (this.hasAddConditionList.includes(condition)) return console.log('重复订阅:', condition)
    this.hasAddConditionList.push(condition)
    const modalItem = getModalItemByCondition(condition, modalMap[this.type])
    const existMap = this.modalFlatMap[modalItem.id]
    if (existMap) {
      console.log('existMap:', condition, existMap)
      // 说明当前弹窗由多个逻辑字段控制
      const handler = existMap.handler
      this.modalFlatMap[modalItem.id].rdShow=existMap.rdShow
      // 包多一层 其实也可以把多个handler放在一个字段控制
      existMap.handler = () => {
        handler && handler()
        infoObj.handler && infoObj.handler()
      }
    } else {
      this.modalFlatMap[modalItem.id] = {
        level: modalItem.level,
        feShow: modalItem.feShow,
        rdShow: infoObj.rdShow,
        handler: infoObj.handler
      }
    }
    this.notify()
  }
  preCheck(){
    if(this.modalList.length === Object.values(this.modalFlatMap)){
      this.notify()
    }
  }
  notify () {
    console.log('this.hasAddConditionList:', this.hasAddConditionList.length)
    if (this.hasAddConditionList.length === this.conditionList.length) {
      console.log('弹窗状态全部初始化完毕', this.modalFlatMap)
      const highLevelModal = Object.values(this.modalFlatMap).filter(item => item.rdShow && item.feShow).reduce((t, c) => {
        return c.level > t.level ? c : t
      }, { level: -1 })
      console.log('highLevelModal:', highLevelModal, highLevelModal.handler.toString())
      highLevelModal.handler && highLevelModal.handler()
    }
  }
  notify1 () {
      const highLevelModal = Object.values(this.modalFlatMap).filter(item => item.rdShow && item.feShow).reduce((t, c) => {
        return c.level > t.level ? c : t
      }, { level: -1 })
      highLevelModal.handler && highLevelModal.handler()
  }
}

// // 单例管理
// const controlTypeMap = {}
// // 获取单例
// function createModalManage (type) {
//   if (!controlTypeMap[type]) {
//     controlTypeMap[type] = new ModalManage(type)
//   }
//   console.log('controlTypeMap[type]',controlTypeMap[type])
//   return controlTypeMap[type]

// }

// export default createModalManage


// eslint-disable-next-line no-unused-vars
class ModalControl {
    constructor (type) {
      this.type = type
      this.modalFlatMap = {} // 用于缓存所有已经订阅的弹窗的信息
      this.modalList =  getAllModalList(modalMap[this.type]) // 该页面下所有需要订阅的弹框列表，数组长度就是n值
    }
    add(modalItem,infoObj){
      this.modalFlatMap[modalItem.id] = {
        level: modalItem.level,
        name:modalItem.name,
        frontShow: modalItem.frontShow,
        backShow: infoObj.backShow,
        handler: infoObj.handler // 
      }
      this.preCheck()
    }
    preCheck(){
      console.log('this.modalList.length',this.modalList.length)
      console.log(Object.values(this.modalFlatMap))
      console.log(Object.values(this.modalFlatMap).length)
      if(this.modalList.length === Object.values(this.modalFlatMap).length){
        this.notify()
      }
    }
    notify () {
      console.log('notify')
      const highLevelModal = Object.values(this.modalFlatMap).filter(item => item.backShow && item.frontShow).reduce((t, c) => {
        return c.level > t.level ? c : t
      }, { level: -1 })
      console.log("highLevelModal",highLevelModal)
      highLevelModal.handler && highLevelModal.handler()
  }
}


const controlTypeMap = {}
// 获取单例
function createModalControl (type) {
  if (!controlTypeMap[type]) {
    controlTypeMap[type] = new ModalControl(type)
  }
  console.log('controlTypeMap[type]',controlTypeMap[type])
  return controlTypeMap[type]

}

export default createModalControl

