<template>
  <b-form-file
    v-model="uploadedFiles"
    :placeholder="placeholderText()"
    drop-placeholder="Drop file(s) here..."
    accept=".fasta, .fa, .fna, .fas, .frn, .ffn, .txt"
    :file-name-formatter="placeholderText"
    multiple
  ></b-form-file>
</template>

<script>
import { parse as fastaParse } from "biojs-io-fasta"
import { mapMutations } from "vuex"

export default {
  data() {
    return {
      uploadedFiles: null,
    }
  },
  watch: {
    uploadedFiles(files) {
      if (!files) {
        return
      }
      this.showSpinner()
      this.$root.$on("bv::modal::shown", (bvEvent, modalId) => {
        if (modalId !== "loading-modal") {
          return
        }
        for (const file of files) {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target.result.length === 0) {
              this.$bvModal.msgBoxOk("This file is empty. Please try again.")
              this.uploadedFiles = null
            }
            for (const sequence of fastaParse(e.target.result)) {
              this.$store.dispatch("transformSequence", {
                description: sequence.name,
                sequence: sequence.seq,
                file: file.name,
              })
            }
            this.$store.dispatch("wasm/instantiate")
            this.$nextTick(() => {
              if (
                this.$root.$refs.TheVisualization.$refs.plotly !== undefined
              ) {
                this.$root.$refs.TheVisualization.$refs.plotly.newPlot()
              }
            })
          }
          reader.readAsText(file)
        }
        this.hideSpinner()
      })
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
