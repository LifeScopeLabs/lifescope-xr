// Define a new component called wall_image
Vue.component('xrtext', {
    data: function () {
        return {
            atext: "Hello, XR!"
        }
    },
    template: '<a-entity scale="2 2 1" text="width: 1.5; color: white; value: Lorem ipsum dolor sit amet"></a-entity>'
  })