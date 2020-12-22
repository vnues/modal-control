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

const getModalItemByApiFlag = (apiFlag, mapObj) => {
  let mapItem = null
  // 首先查找 modalList
  const isExist = (mapObj.modalList || []).some(item => {
    if (item.apiFlag === apiFlag || (Array.isArray(item.apiFlag) && item.apiFlag.includes(apiFlag))) {
      mapItem = item
    }
    return mapItem
  })
  // modalList没找到，继续找 children
  if (!isExist) {
    Object.values(mapObj.children || []).some(mo => {
      mapItem = getModalItemByApiFlag(apiFlag, mo)
      return mapItem
    })
  }
  return mapItem
}
class ModalControl {
  constructor (type) {
    this.type = type
    this.modalFlatMap = {} // 用于缓存所有已经订阅的弹窗的信息
    this.modalList = getAllModalList(modalMap[this.type]) // 该页面下所有需要订阅的弹框列表，数组长度就是n值
  }

  add (apiFlag, infoObj) {
    const modalItem = getModalItemByApiFlag(apiFlag, modalMap[this.type])
    console.log('modalItem', modalItem)
    this.modalFlatMap[apiFlag] = {
      level: modalItem.level,
      name: modalItem.name,
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
