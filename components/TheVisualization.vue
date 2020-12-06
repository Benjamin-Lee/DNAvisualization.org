<template>
  <div>
    <!-- eslint-disable vue/attribute-hyphenation-->
    <Plotly
      v-if="data.length > 0"
      :data="data"
      :layout="layout"
      :display-mode-bar="false"
      :showTips="false"
    ></Plotly>
    <!-- eslint-enable vue/attribute-hyphenation-->
  </div>
</template>
<script>
import { mapState } from "vuex"

export default {
  computed: {
    layout() {
      return {
        title:
          this.data.length === 1
            ? `Visualization of ${this.data[0].name} via the ${this.currentMethod} method`
            : `DNA Sequence Visualization via the ${this.currentMethod} method`,
        // the default bootstrap stack font stack
        font: {
          family:
            '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif !default',
        },
      }
    },
    data() {
      const x = []
      for (const key in this.sequences) {
        x.push({
          x: this.sequences[key].visualization[this.currentMethod][0],
          y: this.sequences[key].visualization[this.currentMethod][1],
          name: key,
        })
      }
      return x
    },
    ...mapState(["sequences", "currentMethod"]),
  },
}
</script>
