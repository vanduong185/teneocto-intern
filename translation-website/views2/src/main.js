import Vue from "vue";
import App from "./App.vue";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueResource from "vue-resource";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

//import JsonExcel from "vue-json-excel";
//import 'vue-resource'

library.add(faVolumeUp);

Vue.use(BootstrapVue);
Vue.use(VueResource);
Vue.component("font-awesome-icon", FontAwesomeIcon);
//Vue.component("downloadExcel", JsonExcel);

new Vue({
  el: "#app",
  render: h => h(App)
});
