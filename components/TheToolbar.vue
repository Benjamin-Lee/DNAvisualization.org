<template>
  <b-row class="bg-light border rounded">
    <b-col cols="7">
      <b-button variant="outline-secondary" @click="confirmClear">
        Clear
      </b-button>
      <b-button v-b-modal.del-modal variant="outline-secondary"
        >Remove Files</b-button
      >
      <b-modal id="del-modal" title="Remove Files" variant="outline-secondary">
        <b-form-checkbox-group
          id="deletion-checkbox-group"
          v-model="deleteFiles"
        >
          <b-form-checkbox
            v-for="(sequence, index) in sequences"
            :key="index"
            :value="index"
          >
            {{ index }}
          </b-form-checkbox>
        </b-form-checkbox-group>
      </b-modal>

      <b-button v-b-modal.save-modal variant="outline-secondary">
        Save <TheSaveModal></TheSaveModal>
      </b-button>

      <SequenceUpload></SequenceUpload>
    </b-col>
    <b-col>
      <b-button-toolbar key-nav aria-label="Toolbar with button groups">
        <b-button-group class="mx-1">
          <b-button
            v-for="(description, method) in methods"
            :id="method"
            :key="method"
            v-b-tooltip.hover
            :variant="
              currentMethod == method ? 'secondary' : 'outline-secondary'
            "
            :title="description"
            @click="changeMethod({ method: method })"
          >
            {{ method }}
          </b-button>
        </b-button-group>
      </b-button-toolbar>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapActions } from "vuex"
import SequenceUpload from "./SequenceUpload"
export default {
  components: { SequenceUpload },
  data: () => {
    return {
      methods: {
        squiggle:
          "(Recommended) Shows variations in GC-content and supports non-ATGC bases.",
        yau:
          "Bases plotted along a unit vector. Captures GC skew. x-coordinates do not map to base position. No support for non-ATGC bases.",
        yau_bp:
          "Same as Yau but projected such that all vectors have lengths in the x-axis of 1 (so that x-coordinates are the same as base positions). No support for non-ATGC bases.",
        randic:
          "Like tablature, with As, Ts, Cs, and Gs assigned a y-coordinate. No support for non-ATGC bases. Not recommended.",
        qi:
          "Same as Randic, except with dinucleotides instead of bases. Not recommended.",
        gates:
          "Bases are plotted as 2D walks in which Ts, As, Cs, and Gs are up, down, left, and right, respectively.",
        yau_int: "experimental",
      },
      deleteFiles: [],
    }
  },
  computed: { ...mapState(["sequences", "currentMethod"]) },
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
    ...mapActions(["clearState", "changeMethod"]),
  },
}
</script>
