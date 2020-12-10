<template>
  <b-row class="bg-light border rounded">
    <b-col>
      <b-button variant="outline-secondary" @click="confirmClear">
        Clear
      </b-button>
      <b-button v-b-modal.save-modal variant="outline-secondary">Save</b-button>
      <b-modal
        id="save-modal"
        ref="modal"
        title="Save Options"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group label="Choose Download Type" label-for="download-type">
            <b-form-select
              id="download-type"
              v-model="downloadType"
              :options="fileTypeOptions"
              size="sm"
              class="mt-3"
              required
            ></b-form-select>
          </b-form-group>
          <label for="width-range">Choose Width</label>
          <b-form-input
            id="width-range"
            v-model="width"
            type="number"
          ></b-form-input>
          <label for="height-range">Choose Height</label>
          <b-form-input
            id="height-range"
            v-model="height"
            type="number"
          ></b-form-input>
        </form>
      </b-modal>
    </b-col>
    <b-col>
      <b-button-toolbar key-nav aria-label="Toolbar with button groups">
        <b-button-group class="mx-1">
          <div v-for="(description, method) in methods" :key="method">
            <b-tooltip :target="method" triggers="hover">
              {{ description }}
            </b-tooltip>
            <b-button
              :id="method"
              :variant="
                currentMethod == method ? 'secondary' : 'outline-secondary'
              "
              @click="changeMethod({ method: method })"
            >
              {{ method }}
            </b-button>
          </div>
        </b-button-group>
      </b-button-toolbar>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
  data: () => {
    return {
      downloadType: null,
      width: null,
      height: null,
      fileTypeOptions: [
        {
          value: null,
          text: "-- Select a download method --",
          disabled: true,
        },
        { value: "png", text: "Download as PNG" },
        { value: "jpeg", text: "Download as JPEG" },
        { value: "svg", text: "Download as SVG" },
      ],
      methods: {
        squiggle:
          "(Recommended) Shows variations in GC-content and supports non-ATGC bases.",
        yau:
          "Bases plotted along a unit vector. Captures GC skew. <var>x</var>-coordinates do not map to base position. No support for non-ATGC bases.",
        yau_bp:
          "Same as Yau but projected such that all vectors have lengths in the <var>x</var>-axis of 1 (so that <var>x</var>-coordinates are the same as base positions). No support for non-ATGC bases.",
        randic:
          "Like tablature, with As, Ts, Cs, and Gs assigned a <var>y</var>-coordinate. No support for non-ATGC bases. Not recommended.",
        qi:
          "Same as Randic, except with dinucleotides instead of bases. Not recommended.",
        gates:
          "Bases are plotted as 2D walks in which Ts, As, Cs, and Gs are up, down, left, and right, respectively.",
      },
    }
  },
  computed: { ...mapState(["currentMethod"]) },
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
    saveImg(downloadType, width, height) {
      this.$root.$refs.TheVisualization.$refs.plotly.downloadImage({
        format: downloadType,
        width,
        height,
        filename: "dnavisualization-" + new Date().toISOString(),
      })
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      if (
        this.downloadType == null ||
        this.height == null ||
        this.width == null
      ) {
        return
      }
      this.saveImg(this.downloadType, this.width, this.height)
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing")
      })
    },
    resetModal() {
      this.downloadType = null
      this.width = 1000
      this.height = 400
    },
    ...mapActions(["clearState", "changeMethod"]),
  },
}
</script>
