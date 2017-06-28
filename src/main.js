// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueMoment from 'vue-moment'
import App from './App'
import router from './router'

import '../theme/index.css'

Vue.config.productionTip = false

Vue.use(VueMoment)
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
