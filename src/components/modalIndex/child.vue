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
import { api4 } from '../../api'
const modalList = modalMap.index.modalList
import {createModal} from '@/libs/ModalControlClass'
const modalControl = createModal(modalList)


export default {
  data(){
    return {
      visible:false,
      list:[]
    }
  },
  components: {
    Grandson
  },
  created () {
    this.initApi1(api4, modalList[1])
  },
  methods: {
    initApi1 (apiName, modalItem) {
      let that = this
      apiName(modalItem).then(res => {
        console.log('接口数据获取成功:', res)
        // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
        modalControl.addQueue(modalItem, res.backShow).on(modalItem.name,function(list){
          that.visible = true
          that.list = list
          console.log('bbbbbbbbbbb',that.list,that.list.length)
        })
      })
    },
    hideModal(){
      let list = this.list.slice()
      console.log(list, this.list.length,'&&&&&&')
      let index = list.findIndex(item=>item.name==='modalB')
      console.log(index, 'index')
      this.list = list.splice(index,1)
      console.log(list, '********')
      modalControl.repeatCheck(list)
      this.visible=false
    }
  }
}
</script>
