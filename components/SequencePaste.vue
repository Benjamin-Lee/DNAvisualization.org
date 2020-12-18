<template>
  <div>
    <b-form-textarea
      id="paste-sequence"
      v-model="pastedSequences"
      rows="4"
      class="my-3"
      placeholder="Paste DNA sequences in FASTA or GenBank format here!"
    ></b-form-textarea>
    <!-- The disabled state does the most basic FASTA validation -->
    <b-button
      variant="outline-secondary"
      :disabled="
        (!pastedSequences.includes('>') || !pastedSequences.includes('\n')) &&
        !pastedSequences.includes('LOCUS')
      "
      @click="transformPastedSequences"
    >
      submit
    </b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pastedSequences: "",
    }
  },
  methods: {
    transformPastedSequences() {
      this.$store.dispatch("parseSequence", {
        unparsed: this.pastedSequences,
        file: "Pasted Sequences",
      })
      this.$nextTick(() => {
        if (this.$root.$refs.TheVisualization.$refs.plotly !== undefined) {
          this.$root.$refs.TheVisualization.$refs.plotly.newPlot()
        }
      })
    },
  },
}
</script>

<style></style>
