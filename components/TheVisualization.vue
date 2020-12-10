<template>
  <div v-if="transformedData.length > 0">
    <!-- eslint-disable vue/attribute-hyphenation-->
    <VuePlotly
      ref="plotly"
      :data="transformedData"
      :layout="layout"
      :options="{ displayModeBar: false, showTips: false, responsive: true }"
      @relayout="zoom"
      @doubleclick="resetZoom"
    ></VuePlotly>
    <TheToolbar></TheToolbar>
    <!-- eslint-enable vue/attribute-hyphenation-->
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex"
import debounce from "lodash/debounce"

export default {
  data: () => {
    return { zoomed: false, xMin: undefined, xMax: undefined }
  },
  computed: {
    layout() {
      const result = {
        title:
          this.transformedData.length === 1
            ? `Visualization of ${this.transformedData[0].name} via the ${this.currentMethod} method`
            : `DNA Sequence Visualization via the ${this.currentMethod} method`,
        // the default bootstrap stack font stack
        font: {
          family:
            '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif !default',
        },
        // add a watermark in the bottom right
        annotations: [
          {
            text: "BD Lee, et al. (2019). DNAvisualization.org.",
            x: 1.0,
            y: -0.15,
            yref: "paper",
            xref: "paper",
            xanchor: "right",
            showarrow: false,
            font: { size: 10, color: "6c757d" },
          },
        ],
        yaxis: { fixedrange: true },
      }
      if (this.currentMethod === "randic") {
        result.yaxis = {
          tickmode: "array", // If "array", the placement of the ticks is set via `tickvals` and the tick text is `ticktext`.
          tickvals: [0, 1, 2, 3],
          ticktext: ["A", "T", "G", "C"],
        }
      } else if (this.currentMethod === "qi") {
        result.yaxis = {
          tickmode: "array", // If "array", the placement of the ticks is set via `tickvals` and the tick text is `ticktext`.
          tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          ticktext: [
            "AG",
            "GA",
            "CT",
            "TC",
            "AC",
            "CA",
            "GT",
            "TG",
            "AT",
            "TA",
            "CG",
            "GC",
            "AA",
            "CC",
            "GG",
            "TT",
          ],
          ...result.yaxis,
        }
      } else result.yaxis = { ...result.yaxis }
      return result
    },
    transformedData() {
      const x = []
      for (const key in this.sequences) {
        x.push({
          x: this.sequences[key].overview[this.currentMethod][0],
          y: this.sequences[key].overview[this.currentMethod][1],
          name: key,
        })
      }
      return x
    },
    ...mapState(["sequences", "currentMethod"]),
  },
  created() {
    // Allow TheToolbar to talk directly to Plotly
    this.$root.$refs.TheVisualization = this
    this.debouncedZoom = debounce((e) => {
      if (
        e["xaxis.range[0]"] !== undefined &&
        e["xaxis.range[1]"] !== undefined
      ) {
        if (
          e["xaxis.range[0]"] === this.xMin &&
          e["xaxis.range[1]"] === this.xMax
        ) {
          return
        }
        this.zoomed = true

        for (const description in this.sequences) {
          this.computeOverview({
            description,
            xMin: e["xaxis.range[0]"],
            xMax: e["xaxis.range[1]"],
          })
        }
        this.xMin = e["xaxis.range[0]"]
        this.xMax = e["xaxis.range[1]"]
      }
    }, 50)
  },
  methods: {
    zoom(e) {
      this.debouncedZoom(e)
    },
    resetZoom() {
      this.zoomed = false
      this.xMin = undefined
      this.xMax = undefined
      for (const description in this.sequences) {
        this.computeOverview({
          description,
        })
      }
    },
    ...mapActions(["computeOverview"]),
  },
}
</script>
