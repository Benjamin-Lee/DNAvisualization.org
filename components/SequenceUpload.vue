<template>
  <b-form-file
    v-model="uploadedFile"
    :placeholder="placeholderText()"
    drop-placeholder="Drop file here..."
    accept=".fasta, .fa, .fna, .fas, .frn, .ffn, .txt"
    :file-name-formatter="placeholderText"
  ></b-form-file>
</template>

<script>
import { parse as fastaParse } from "biojs-io-fasta"
export default {
  data() {
    return {
      uploadedFile: null,
    }
  },
  watch: {
    uploadedFile(val) {
      if (!val) {
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target.result.length === 0) {
          this.$bvModal.msgBoxOk("This file is empty. Please try again.")
          this.uploadedFile = null
        }
        for (const sequence of fastaParse(e.target.result)) {
          this.$store.dispatch("transformSequence", {
            description: sequence.name,
            sequence: sequence.seq,
          })
        }
      }
      reader.readAsText(val)
    },
  },
  methods: {
    placeholderText(files) {
      return `Choose a file or drop it here...`
    },
  },
}
</script>

<style></style>
