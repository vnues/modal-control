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
import { api1 } from '../../api'

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
    // 实际开发中，每个接口的数据逻辑应该都是不一样的，这里只是为了更直观地模拟多接口获取数据，只是一个占位表达
    this.initApi(api1, modalList[0])
  },
  methods: {
    initApi (apiName, modalItem) {
      apiName(modalItem).then(res => {
      console.log('接口数据获取成功:', res)
        // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
        console.log('modalItem.id',modalItem.id)
        modalControl.add(modalItem, {
          backShow: res.backShow,
          name:modalItem.name,
          handler: () => {
            console.log('弹窗展示：', modalItem)
            this.visible=true
            // showModal(modalItem.condition)
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
