import TurbolinksAdapter from 'vue-turbolinks'
import Vue from 'vue/dist/vue.esm'
Vue.use(TurbolinksAdapter)

document.addEventListener('turbolinks:load', () => {
  new Vue({
    el: '#new_article',
    data: {
      errors: []
    },
    methods: {
      errors_show: function (event) {
        this.errors = event.detail[0];
      }
    }
  })
})
