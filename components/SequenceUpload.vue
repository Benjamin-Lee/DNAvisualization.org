<template>
  <b-form-file
    v-model="uploadedFiles"
    :placeholder="placeholderText()"
    drop-placeholder="Drop file(s) here..."
    accept=".fasta, .fa, .fna, .fas, .frn, .ffn, .txt, .gbk, .gb"
    :file-name-formatter="placeholderText"
    multiple
  ></b-form-file>
</template>

<script>
import { mapMutations } from "vuex"

export default {
  data() {
    return {
      uploadedFiles: null,
    }
  },
  watch: {
    async uploadedFiles(files) {
      // don't do anything afterr resetting to null
      if (!files) {
        return
      }

      // read each file and dispatch the parser, which in turn dispatches transformation
      for (const file of files) {
        await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target.result.length === 0) {
              this.$bvModal.msgBoxOk("This file is empty. Please try again.")
              this.uploadedFiles = null
            }
            // console.log(file.name, e.target.result)
            this.$store.dispatch("parseSequence", {
              unparsed: e.target.result,
              file: file.name,
            })
            this.$store.dispatch("wasm/instantiate")
            resolve()
          }
          reader.readAsText(file)
        })
      }

      this.uploadedFiles = null
      this.$emit("sequenceAdded")
      if (this.$root.$refs.TheVisualization.$refs.plotly !== undefined) {
        this.$root.$refs.TheVisualization.$refs.plotly.newPlot()
      }
    },
  },
  methods: {
    placeholderText(files) {
      return `Choose files or drop them here...`
    },
    ...mapMutations(["showSpinner", "hideSpinner"]),
  },
}
</script>

<style></style>
