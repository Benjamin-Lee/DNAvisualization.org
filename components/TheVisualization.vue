<template>
  <div v-if="transformedData.length > 0">
    <b-alert show variant="warning" class="d-sm-none" dismissible>
      This web app is best used on a larger device.
    </b-alert>
    <VuePlotly
      ref="plotly"
      :data="transformedData"
      :layout="layout"
      :options="{
        showTips: false,
        responsive: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['toImage', 'autoScale2d', 'toggleSpikelines'],
      }"
      @relayout="zoom"
      @doubleclick="resetZoom"
    ></VuePlotly>
    <TheToolbar></TheToolbar>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex"
import debounce from "lodash/debounce"
const ColorHash = require("color-hash")

export default {
  data: () => {
    return {
      zoomed: false,
      xMin: undefined,
      xMax: undefined,
      graphTitle: "",
    }
  },
  computed: {
    currentMethodDisplayName() {
      return (
        this.currentMethod.charAt(0).toUpperCase() + this.currentMethod.slice(1)
      )
        .replace("_int", "")
        .replace("dic", "dić")
    },
    layout() {
      const result = {
        title: this.graphTitle
          ? this.graphTitle
          : this.transformedData.length === 1
          ? `Visualization of ${this.transformedData[0].name} via the ${this.currentMethodDisplayName} method`
          : `DNA sequence visualization via the ${this.currentMethodDisplayName} method`,
        // the default bootstrap stack font stack
        font: {
          family:
            '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif !default',
        },
        yaxis: { fixedrange: true },
        xaxis: {
          title: {
            text: this.currentMethod !== "gates" ? "Position (bp)" : "C-G axis",
          },
        },
        legend: { orientation: "h" },
      }
      if (this.currentMethod === "randic") {
        result.yaxis = {
          tickmode: "array", // If "array", the placement of the ticks is set via `tickvals` and the tick text is `ticktext`.
          tickvals: [0, 1, 2, 3],
          ticktext: ["C", "G", "T", "A"],
          ...result.yaxis,
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
      } else if (this.currentMethod === "gates") {
        result.yaxis = {
          title: {
            text: "A-T axis",
          },
          ...result.yaxis,
        }
      } else {
        result.yaxis = { ticks: "", showticklabels: false, ...result.yaxis }
      }
      return result
    },
    transformedData() {
      const x = []
      const seenLegendGroups = []
      /** We need a little hash function to ensure similar filenames don't come too close.
       *
       * Taken from: https://stackoverflow.com/a/8831937
       */
      function tinyHash(x) {
        let hash = 0
        let chr
        for (let i = 0; i < x.length; i++) {
          chr = x.charCodeAt(i)
          hash = (hash << 5) - hash + chr
          hash |= 0 // Convert to 32bit integer
        }
        return hash
      }
      // In file mode, we use ColorHash to create a mapping from a filename to a color
      const colorHash = new ColorHash({ saturation: [0.75, 0.85] })
      for (const key in this.sequences) {
        const keyData = {
          x: this.sequences[key].overview[this.currentMethod][0],
          y: this.sequences[key].overview[this.currentMethod][1],
          name: this.legendMode === "file" ? this.sequences[key].file : key,
        }
        if (this.legendMode === "file") {
          keyData.showlegend = !seenLegendGroups.includes(
            this.sequences[key].file
          )
          keyData.legendgroup = this.sequences[key].file

          keyData.line = {
            color: colorHash.hex(tinyHash(this.sequences[key].file)),
          }
        }
        x.push(keyData)
        if (!seenLegendGroups.includes(this.sequences[key].file)) {
          seenLegendGroups.push(this.sequences[key].file)
        }
      }
      return x
    },
    ...mapState(["sequences", "currentMethod", "legendMode"]),
  },
  created() {
    // Allow TheToolbar to talk directly to Plotly
    this.$root.$refs.TheVisualization = this
    this.debouncedZoom = debounce((e) => {
      if (e["xaxis.autorange"] === true) {
        this.resetZoom()
        return
      }
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
        this.xMin =
          this.currentMethod !== "gates"
            ? Math.max(e["xaxis.range[0]"], 0)
            : e["xaxis.range[0]"]
        this.xMax =
          this.currentMethod !== "gates"
            ? Math.max(e["xaxis.range[1]"], 1)
            : e["xaxis.range[1]"]

        for (const description in this.sequences) {
          this.computeOverview({
            description,
            xMin: this.xMin,
            xMax: this.xMax,
          })
        }
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
    setGraphTitle(newTitle) {
      this.graphTitle = newTitle

      this.$nextTick(() => {
        this.$refs.plotly.newPlot()
      })
    },
    ...mapActions(["computeOverview"]),
  },
}
</script>
