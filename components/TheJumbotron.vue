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
    <!-- Choose which sequence you want to download -->
    <b-modal id="my-modal" title="Download Example Sequences" hide-footer>
      <ul>
        <li><a href="/examples/hbb.fasta">Hemoglobin &beta; (444 bp)</a></li>
        <li><a href="/examples/sars-cov-2.fasta">SARS-CoV-2 (29,903 bp)</a></li>
        <li><a href="/examples/titin.fasta">Titin (104,301 bp)</a></li>
        <li>
          <a href="/examples/GCA_000293765.1_ASM29376v1_genomic.fasta">
            <i>Bacillus subtilis</i> (4,146,839 bp)
          </a>
        </li>
      </ul>
    </b-modal>
    <b-row>
      <b-col sm="4" lg="3">
        <b-dropdown
          split
          text="Use example"
          variant="outline-secondary"
          block
          @click="transformExample('hbb')"
        >
          <b-dropdown-item @click="transformExample('hbb')">
            Hemoglobin &beta; (444 bp)
          </b-dropdown-item>
          <b-dropdown-item @click="transformExample('sars-cov-2')">
            SARS-CoV-2 (29,903 bp)
          </b-dropdown-item>
          <b-dropdown-item @click="transformExample('titin')">
            Titin (104,301 bp)
          </b-dropdown-item>
          <b-dropdown-item @click="transformExample('bsub')">
            <i>Bacillus subtilis</i> (4,146,839 bp)
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>

          <b-dropdown-item v-b-modal.my-modal>
            <b-icon-download></b-icon-download>
            Download examples
          </b-dropdown-item>
        </b-dropdown>
      </b-col>
      <b-col sm="8" lg="9" class="mt-3 mt-sm-0">
        <SequenceUpload></SequenceUpload>
      </b-col>
    </b-row>

    <p class="mt-3">Or paste a FASTA-formatted sequence:</p>
    <label for="paste-sequence" class="sr-only">Paste sequence:</label>
    <SequencePaste id="paste-sequence"></SequencePaste>
  </b-jumbotron>
</template>
<script>
import { parse as fastaParse } from "biojs-io-fasta"
import { mapState } from "vuex"
import SequenceUpload from "./SequenceUpload"
import SequencePaste from "./SequencePaste"
export default {
  components: { SequenceUpload, SequencePaste },
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
        if (e.target.result.length === 0 && e.target.result.total === 0) {
          this.$bvModal.msgBoxOk("This file is empty. Please try again.")
          this.uploadedFile = null
        } else if (e.target.result.length === 0) {
          this.$bvModal.msgBoxOk("This file is too large to be parsed.")
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
    transformExample(example) {
      fetch(`/examples/${example}.fasta`)
        .then((x) => x.text())
        .then((text) => {
          for (const sequence of fastaParse(text)) {
            this.$store.dispatch("transformSequence", {
              description: sequence.name,
              sequence: sequence.seq,
              file: "Example Sequences",
            })
          }
        })
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
