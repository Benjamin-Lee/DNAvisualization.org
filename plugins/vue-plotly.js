import Vue from "vue"
import { Plotly } from "vue-plotly"

const VuePlotly = {
  install(Vue) {
    Vue.component("Plotly", Plotly)
  },
}
Vue.use(VuePlotly)
export default VuePlotly
