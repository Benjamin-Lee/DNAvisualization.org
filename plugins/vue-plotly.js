import Vue from "vue"
import vPlotly from "@statnett/vue-plotly"

const VuePlotly = {
  install(Vue) {
    Vue.component("VuePlotly", vPlotly)
  },
}
Vue.use(VuePlotly)
export default VuePlotly
