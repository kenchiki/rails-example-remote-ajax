import TurbolinksAdapter from 'vue-turbolinks'
import Vue from 'vue/dist/vue.esm'

Vue.use(TurbolinksAdapter)

document.addEventListener('turbolinks:load', () => {
  function allRequire(context) {
    context.keys().forEach(function (value) {
      let obj = context(value);
      obj.default(Vue)
    });
  }
  allRequire(require.context('./modules/', false, /\.js$/))
})
