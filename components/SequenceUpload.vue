<template>
  <div>
    <b-form-file
      v-model="uploadedFile"
      class="w-50"
      placeholder="Choose File"
      drop-placeholder="Drop file here..."
      accept=".fasta, .fa, .fna, .fas, .frn, .ffn, .txt"
    ></b-form-file>
  </div>
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
}
</script>

<style></style>
