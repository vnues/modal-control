<template>
  <div class="child">
    <p>child子组件</p>
    <a-modal v-model="visible" title="Modal" ok-text="确认" cancel-text="取消" @ok="hideModal" name="modalB">
        <p>要展示在首页的弹框B</p>
    </a-modal>
    <Grandson />
  </div>
</template>

<script>
/* eslint-disable no-console */
import Grandson from './grandson'
import modalMap from './modalConfig'
import createModalControl from './ModalControl'
import { api4 } from '../../api'

const modalControl =  createModalControl('index')


export default {
  data(){
    return {
      visible:false
    }
  },
  components: {
    Grandson
  },
  created () {
    const modalList = modalMap.index.modalList
    // 实际开发中，每个接口的数据逻辑应该都是不一样的，这里只是为了更直观地模拟多接口获取数据，只是一个占位表达
    this.initApi1(api4, modalList[1])
  },
  methods: {
    initApi1 (apiName, modalItem) {
      apiName(modalItem).then(res => {
        console.log('接口数据获取成功:', res)
        // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
        modalControl.add(modalItem, {
          backShow: res.backShow,
          handler: () => {
            console.log('弹窗展示：', modalItem)
            this.visible=true
          }
        })
      })
    },
    hideModal(){
      this.visible=false
    }
    // initApi2 (apiName, modalItem) {
    //   apiName(modalItem).then(res => {
    //     console.log('接口数据获取成功:', res)
    //     // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
    //     modalManage.add(modalItem.condition[0], {
    //       backShow: res.backShow,
    //       handler: () => {
    //         console.log('弹窗展示：', modalItem)
    //         showModal(modalItem.condition)
    //       }
    //     })
    //   })
    // },
    // initApi3 (apiName, modalItem) {
    //   apiName(modalItem).then(res => {
    //     console.log('接口数据获取成功:', res)
    //     // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
    //     // 这个接口控制弹框显示 我们订阅就行 其它显不显示 他来告诉我们就行
    //     modalManage.add(modalItem.condition[1], {
    //       backShow: res.backShow,
    //       handler: () => {
    //         console.log('弹窗展示：', modalItem)
    //         showModal(modalItem.condition)
    //       }
    //     })
    //   })
    // },
    // initApi4 (apiName, modalItem) {
    //   modalItem.forceTrue = false
    //   apiName(modalItem).then(res => {
    //     console.log('接口数据获取成功:', res)
    //     // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
    //     modalManage.add(modalItem.condition[2], {
    //       backShow: res.backShow,
    //       handler: () => {
    //         console.log('弹窗展示：', modalItem)
    //         showModal(modalItem.condition)
    //       }
    //     })
    //   })
    // }
  }
}
</script>
