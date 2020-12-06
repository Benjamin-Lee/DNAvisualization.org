<template>
  <div v-if="transformedData.length > 0">
    <!-- eslint-disable vue/attribute-hyphenation-->
    <Plotly
      ref="plotly"
      :data="transformedData"
      :layout="layout"
      :display-mode-bar="false"
      :showTips="false"
    ></Plotly>
    <!-- eslint-enable vue/attribute-hyphenation-->
    <b-row class="bg-light border rounded">
      <b-col>
        <b-button variant="outline-secondary" @click="confirmClear">
          Clear
        </b-button>
        <b-button variant="outline-secondary" @click="saveImg">Save</b-button>
      </b-col>
      <b-col>
        <b-button-toolbar key-nav aria-label="Toolbar with button groups">
          <b-button-group class="mx-1">
            <b-button
              v-for="method in methods"
              :key="method"
              :variant="
                currentMethod == method ? 'secondary' : 'outline-secondary'
              "
              @click="changeMethod({ method: method })"
            >
              {{ method }}
            </b-button>
          </b-button-group>
        </b-button-toolbar>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex"
// import Plotly from "plotly.js/dist/plotly-basic"

export default {
  data: () => {
    return {
      methods: ["squiggle", "yau", "yau_bp", "randic", "qi", "gates"],
    }
  },
  computed: {
    layout() {
      return {
        title:
          this.transformedData.length === 1
            ? `Visualization of ${this.transformedData[0].name} via the ${this.currentMethod} method`
            : `DNA Sequence Visualization via the ${this.currentMethod} method`,
        // the default bootstrap stack font stack
        font: {
          family:
            '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif !default',
        },
      }
    },
    transformedData() {
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
    saveImg() {
      this.$refs.plotly.downloadImage({ format: "svg" })
    },
    ...mapActions(["clearState", "changeMethod"]),
  },
}
</script>
