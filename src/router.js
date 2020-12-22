import Vue from 'vue'
import VueRouter from 'vue-router'

import ModalIndex from './components/modalIndex'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    component: ModalIndex
  }]
})

export default router
