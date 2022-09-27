<template>
  <div class="main">
    <p>grandson孙组件</p>
    <a-modal v-model="visible" title="Modal" ok-text="确认" cancel-text="取消" @ok="hideModal" name="modalC">
        <p>要展示在首页的弹框C</p>
    </a-modal>
  </div>
</template>

<script>
/* eslint-disable no-console */
import modalMap from './modalConfig'
import { api1 } from '../../api'
const modalList = modalMap.index.modalList
import {createModal} from '@/libs/ModalControlClass'
const modalControl = createModal(modalList)
export default {
  data(){
    return {
      visible:false,
      list: []
    }
  },
  components: {

  },
  created () {
    this.initApi(api1, modalList[2])
  },
  methods: {
    initApi (apiName, modalItem) {
      let that = this
      apiName(modalItem).then(res => {
      console.log('接口数据获取成功:', res)
        // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
        modalControl.addQueue(modalItem, res.backShow).on(modalItem.name,function(list){
          that.visible = true
          that.list = list
          console.log('cccccccccccccc',list,list.length)
        })
      })
    },
    hideModal(){
      let list = this.list.slice()
      console.log(list, this.list.length,'&&&&&&')
      let index = list.findIndex(item=>item.name==='modalC')
      console.log(index, 'index')
      this.list = list.splice(index,1)
      console.log(list, '********')
      modalControl.repeatCheck(list)
      this.visible=false
    }
  }
}
</script>
