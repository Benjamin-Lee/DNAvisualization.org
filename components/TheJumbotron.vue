<template>
  <b-jumbotron v-if="sequenceCount === 0" fluid bg-variant="light">
    <template #header>Turn DNA into graphs.</template>

    <template #lead>
      This is a simple hero unit, a simple jumbotron-style component for calling
      extra attention to featured content or information.
    </template>
    <hr class="my-4" />

    <p>
      It uses utility classes for typography and spacing to space content out
      within the larger container.
    </p>

    <b-row>
      <b-col cols="2">
        <b-dropdown
          split
          text="Load Example"
          variant="outline-secondary"
          @click="transformExampleSequences"
        >
          <b-dropdown-item href="#">Sars-Cov-2</b-dropdown-item>
          <b-dropdown-item href="#">HDV</b-dropdown-item>
          <b-dropdown-item href="#">HCV</b-dropdown-item>
        </b-dropdown>
      </b-col>
      <b-col class="pl-0">
        <b-form-file
          v-model="uploadedFile"
          class="w-50"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
          accept=".fasta, .fa, .fna, .fas, .frn, .ffn, .txt"
        ></b-form-file>
      </b-col>
    </b-row>

    <p class="mt-3">Or paste a FASTA-formatted sequence:</p>
    <b-form-textarea
      v-model="pastedSequences"
      placeholder="enter sequence"
      rows="4"
      class="my-3"
    ></b-form-textarea>
    <b-button variant="outline-secondary" @click="transformPastedSequences">
      submit
    </b-button>
  </b-jumbotron>
</template>
<script>
import { parse as fastaParse } from "biojs-io-fasta"
import { mapState } from "vuex"

export default {
  data() {
    return {
      uploadedFile: null,
      pastedSequences: "",
      exampleSequences:
        ">HumanB-globin\nATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTGGTCTACCCTTGGACCCAGAGGTTCTTTGAGTCCTTTGGGGATCTGTCCACTCCTGATGCTGTTATGGGCAACCCTAAGGTGAAGGCTCATGGCAAGAAAGTGCTCGGTGCCTTTAGTGATGGCCTGGCTCACCTGGACAACCTCAAGGGCACCTTTGCCACACTGAGTGAGCTGCACTGTGACAAGCTGCACGTGGATCCTGAGAACTTCAGGCTCCTGGGCAACGTGCTGGTCTGTGTGCTGGCCCATCACTTTGGCAAAGAATTCACCCCACCAGTGCAGGCTGCCTATCAGAAAGTGGTGGCTGGTGTGGCTAATGCCCTGGCCCACAAGTATCACTAA",
    }
  },
  computed: {
    sequenceCount() {
      return Object.keys(this.sequences).length
    },
    ...mapState(["sequences"]),
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
    transformPastedSequences() {
      for (const sequence of fastaParse(this.pastedSequences)) {
        this.$store.dispatch("transformSequence", {
          description: sequence.name,
          sequence: sequence.seq,
        })
      }
    },
    transformExampleSequences() {
      for (const sequence of fastaParse(this.exampleSequences)) {
        this.$store.dispatch("transformSequence", {
          description: sequence.name,
          sequence: sequence.seq,
        })
      }
    },
  },
}
</script>
<style>
.custom-file-label,
.custom-file-label::after {
  border-color: #6c757d;
  background-color: initial;
}
.btn-outline-secondary {
  color: #495057;
}
</style>
