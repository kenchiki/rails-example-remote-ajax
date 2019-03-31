export default (Vue) => {
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
}
