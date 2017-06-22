import Vue from 'vue'
import ElementUI from 'element-ui'
import Router from 'vue-router'
import Home from '@/components/Home'

Vue.use(ElementUI)
Vue.use(Router)

import Search from '@/components/Search'
import SearchForm from '@/components/search/form'

Vue.component(SearchForm.name, SearchForm)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
})
