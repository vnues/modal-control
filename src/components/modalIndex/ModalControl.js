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
    this.type = type
    this.modalFlatMap = {}
    this.modalList = getAllModalList(modalMap[this.type])
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
