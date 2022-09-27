<template>
  <div class="main">
    <p>弹框首页modalIndex</p>
    <a-modal v-model="visible" title="Modal" ok-text="确认" cancel-text="取消" @ok="hideModal" name="modalA">
        <p>要展示在首页的弹框A</p>
    </a-modal>
    <Child />
    <div @click="add">234</div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import Child from './child'
import modalMap from './modalConfig'

import { api1 } from '../../api'

const modalList = modalMap.index.modalList
import {createModal} from '@/libs/ModalControlClass'
const modalControl = createModal(modalList)

export default {
  data(){
    return {
      visible:false,
      arr :[1,2,3]
    }
  },
  components: {
  Child
  },
  created () {
    // 实际开发中，每个接口的数据逻辑应该都是不一样的，这里只是为了更直观地模拟多接口获取数据，只是一个占位表达
    this.initApi(api1, modalList[0])
  },
  methods: {
    initApi (apiName, modalItem) {
      let that = this
      apiName(modalItem).then(res => {
        console.log('接口数据获取成功:', res)
        // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
        modalControl.addQueue(modalItem, res.backShow).on(modalItem.name,function(list){
          that.list = list
          that.visible = true
          console.log('aaaaaaaaaaa',list,list.length)
        })
      })
    },
    hideModal(){
       //  操作，数组，一定要复制一份，不要在原数组操作，否则很容易出现漏洞
      let list = this.list.slice()
      console.log(list, this.list.length,'&&&&&&')
      let index = list.findIndex(item=>item.name==='modalA')
      console.log(index, 'index')
      this.list = list.splice(index,1)
      console.log(list, '********')
      modalControl.repeatCheck(list)
      this.visible=false
    },
    a(){
      console.log(111)
    },
    add(){
      this.arr.push(5)
      console.log(this.arr)
    }
  }
}
</script>
