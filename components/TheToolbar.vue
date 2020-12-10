<template>
  <b-row class="bg-light border rounded">
    <b-col>
      <b-button variant="outline-secondary" @click="confirmClear">
        Clear
      </b-button>
      <b-button v-b-modal.save-modal variant="outline-secondary">Save</b-button>
      <b-modal
        id="save-modal"
        title="Save Options"
        ref="modal"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            label="Choose Download Type"
            label-for="download-type"
            invalid-feedback="Download Type is Required"
          >
            <b-form-select
              v-model="downloadType"
              id="download-type"
              :options="fileTypeOptions"
              size="sm"
              class="mt-3"
              :state="Boolean(downloadType)"
              required
            ></b-form-select>
          </b-form-group>
          <label for="width-range">Choose Width</label>
          <b-form-input
            id="width-range"
            v-model="width"
            type="range"
            min="0"
            max="1000"
          ></b-form-input>
          <div class="mt-2">Width: {{ width }}</div>
          <label for="height-range">Choose Height</label>
          <b-form-input
            id="height-range"
            v-model="height"
            type="range"
            min="0"
            max="1000"
          ></b-form-input>
          <div class="mt-2">Width: {{ height }}</div>
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
      width: 800,
      height: 600,
      fileTypeOptions: [
        {
          value: null,
          text: "-- Select a download method --",
          disabled: true,
        },
        { value: "png", text: "Download as PNG" },
        { value: "jpg", text: "Download as JPEG" },
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
        width: width,
        height: height,
        filename: "dnavisualization-" + new Date().toISOString(),
      })
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      if (this.downloadType == null) {
        return
      }
      this.saveImg(this.downloadType, this.width, this.height)
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing")
      })
    },
    resetModal() {
      this.downloadType = null
      this.width = 800
      this.height = 600
    },
    ...mapActions(["clearState", "changeMethod"]),
  },
}
</script>
