<template>
  <div>
    <Plotly
      v-if="data.length > 0"
      :data="data"
      :layout="layout"
      :display-mode-bar="false"
    ></Plotly>
  </div>
</template>
<script>
import { mapState } from "vuex"

export default {
  computed: {
    stringified() {
      return JSON.stringify(this.sequences)
    },
    layout() {
      return {
        title: "My graph",
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
          x: this.sequences[key].visualization.yau_bp[0],
          y: this.sequences[key].visualization.yau_bp[1],
          name: key,
        })
      }
      return x
    },
    ...mapState(["sequences"]),
  },
}
</script>
