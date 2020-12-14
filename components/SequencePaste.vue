<template>
  <div>
    <b-form-textarea
      id="paste-sequence"
      v-model="pastedSequences"
      :placeholder="`>Description line goes here${' '.repeat(
        250
      )}ATGCAGA...${' '.repeat(
        250
      )}>Optionally, another sequence can follow${' '.repeat(250)}GACGTTT...`"
      rows="4"
      class="my-3"
    ></b-form-textarea>
    <!-- The disabled state does the most basic FASTA validation -->
    <b-button
      variant="outline-secondary"
      :disabled="
        !pastedSequences.includes('>') || !pastedSequences.includes('\n')
      "
      @click="transformPastedSequences"
    >
      submit
    </b-button>
  </div>
</template>

<script>
import { parse as fastaParse } from "biojs-io-fasta"
export default {
  data() {
    return {
      pastedSequences: "",
    }
  },
  methods: {
    transformPastedSequences() {
      for (const sequence of fastaParse(this.pastedSequences)) {
        this.$store.dispatch("transformSequence", {
          description: sequence.name,
          sequence: sequence.seq,
          file: "Pasted Sequences",
        })
      }
    },
  },
}
</script>

<style></style>
