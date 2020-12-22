<template>
  <div class="main">
    <p>弹框首页modalIndex</p>
    <a-modal v-model="visible" title="Modal" ok-text="确认" cancel-text="取消" @ok="hideModal" name="modalA">
        <p>要展示在首页的弹框A</p>
    </a-modal>
    <Child />
  </div>
</template>

<script>
/* eslint-disable no-console */
import Child from './child'
import modalMap from './modalConfig'
import createModalControl from './ModalControl'
import { api1,api2 } from '../../api'

const modalControl =  createModalControl('index')

export default {
  data(){
    return {
      visible:false
    }
  },
  components: {
  Child
  },
  created () {
    const modalList = modalMap.index.modalList
    // 多对一
    this.initApi1(api1, modalList[0])
    this.initApi2(api2, modalList[0])
  },
  methods: {
    initApi1 (apiName, modalItem) {
      apiName(modalItem).then(res => {
        // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
        modalControl.add('mockA_1', {
          backShow: res.backShow,
          handler: () => {
            console.log(res)
            this.visible=true
          }
        })
      })
    },
    initApi2 (apiName, modalItem) {
      apiName(modalItem).then(res => {
        // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
        modalControl.add('mockA_2', {
          backShow: res.backShow,
          handler: () => {
            console.log(res)
            this.visible=true
          }
        })
      })
    },
    hideModal(){
      this.visible=false
    }
  }
}
</script>
