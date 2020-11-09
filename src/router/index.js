import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import loadCSV from '@/components/loadCSV'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'loadCSV',
      component: loadCSV
    }
  ]
})
