<template>
  <div v-if="data.length > 0">
    <!-- eslint-disable vue/attribute-hyphenation-->
    <Plotly
      :data="data"
      :layout="layout"
      :display-mode-bar="false"
      :showTips="false"
    ></Plotly>
    <!-- eslint-enable vue/attribute-hyphenation-->
    <b-row class="bg-light border rounded">
      <b-col
        ><b-btn variant="outline-secondary" @click="confirmClear"
          >Clear</b-btn
        ></b-col
      >
    </b-row>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex"

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
  methods: {
    /** Confirm with the user that they want to reset the state to default */
    confirmClear() {
      this.$bvModal
        .msgBoxConfirm('Clicking "OK" will delete all transformed sequences.', {
          title: "Are you sure?",
          okVariant: "outline-danger",
          cancelVariant: "outline-secondary",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value === true) {
            this.clearState()
          }
        })
    },
    ...mapActions(["clearState"]),
  },
}
</script>
