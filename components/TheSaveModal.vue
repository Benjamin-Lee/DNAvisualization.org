<template>
  <b-modal
    id="save-modal"
    title="Save Options"
    cancel-variant="outline-secondary"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group label="Choose format" label-for="download-type">
        <b-form-select
          id="download-type"
          v-model="downloadType"
          :options="fileTypeOptions"
          required
        ></b-form-select>
      </b-form-group>
      <div v-if="downloadType !== 'full-json' && downloadType !== null">
        <b-form-group label="Width" label-for="width">
          <b-form-input id="width" v-model="width" type="number"></b-form-input>
        </b-form-group>
        <b-form-group label="Height" label-for="height">
          <b-form-input
            id="height"
            v-model="height"
            type="number"
          ></b-form-input>
        </b-form-group>
        <p v-if="downloadType !== 'svg'" class="mb-0">
          To control the pixel density of your output image (not just the size),
          <a href="#" @click="downloadType = 'svg'">select "SVG"</a> and then
          convert it at your desired resolution using a tool such as
          <a href="https://cloudconvert.com/svg-to-jpg">CloudConvert</a> or
          <a href="https://cairosvg.org/">Cairo</a>.
        </p>
      </div>
    </form>
  </b-modal>
</template>
<script>
export default {
  data: () => {
    return {
      downloadType: null,
      width: null,
      height: null,
      fileTypeOptions: [
        {
          value: null,
          text: "",
          disabled: true,
        },
        { value: "png", text: "Download as PNG image" },
        { value: "jpeg", text: "Download as JPEG image" },
        { value: "svg", text: "Download as SVG image" },
        { value: "full-json", text: "Download as JSON data" },
      ],
    }
  },
  methods: {
    save(downloadType, width, height) {
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
      this.save(this.downloadType, this.width, this.height)
      this.$nextTick(() => {
        this.$bvModal.hide("save-modal")
      })
    },
    resetModal() {
      this.downloadType = null
      this.width = 1000
      this.height = 400
    },
  },
}
</script>
