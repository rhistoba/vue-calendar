import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import '@/assets/scss/application.scss'

Vue.config.productionTip = false

Vue.use(Vuex)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
