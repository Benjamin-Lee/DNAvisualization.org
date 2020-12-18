<template>
  <b-row class="bg-light border rounded py-3" align-h="around">
    <b-col cols="12" sm="6" lg="3" class="text-center pb-2 pb-lg-0">
      <b-row>
        <b-col class="pb-1">Options</b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button-group class="w-100">
            <b-button
              v-b-modal.del-modal
              v-b-tooltip.hover
              variant="outline-secondary"
              title="Delete sequences"
            >
              <b-icon-trash></b-icon-trash>
              <b-modal
                id="del-modal"
                title="Remove Files"
                variant="outline-secondary"
                @ok="handleDelete"
              >
                <b-tabs content-class="mt-3">
                  <b-tab title="Files">
                    <b-form-checkbox-group
                      id="deletion-checkbox-group"
                      v-model="deleteFiles"
                    >
                      <b-form-checkbox
                        v-for="(value, file) in files"
                        :key="file"
                        :value="file"
                      >
                        {{ file }}
                      </b-form-checkbox>
                    </b-form-checkbox-group>
                  </b-tab>
                  <b-tab title="Sequences">
                    <b-form-checkbox-group
                      id="deletion-checkbox-group"
                      v-model="deleteSequences"
                    >
                      <div
                        v-for="(value, file) in files"
                        :key="file"
                        :value="file"
                      >
                        <b-form-checkbox
                          v-for="sequence in value"
                          :key="sequence"
                          :value="sequence"
                        >
                          {{ sequence }}
                        </b-form-checkbox>
                      </div>
                    </b-form-checkbox-group>
                  </b-tab>
                </b-tabs>
                <b-button variant="outline-secondary" @click="confirmClear">
                  Delete All
                </b-button>
              </b-modal></b-button
            >
            <b-button
              v-b-modal.save-modal
              v-b-tooltip.hover
              title="Save Image or Data"
              variant="outline-secondary"
            >
              <b-icon-download></b-icon-download> <TheSaveModal></TheSaveModal>
            </b-button>
            <b-button
              v-b-tooltip.hover
              v-b-modal.title-modal
              variant="outline-secondary"
              title="Change title"
            >
              <b-modal
                id="title-modal"
                title="Change Title"
                variant="outline-secondary"
                @ok="editTitle"
              >
                <b-form-input
                  v-model="newGraphTitle"
                  placeholder="Enter your new title"
                ></b-form-input>
              </b-modal>
              <b-icon-gear></b-icon-gear>
            </b-button>
            <b-button
              v-b-tooltip.hover
              v-b-modal.add-modal
              variant="outline-secondary"
              title="Add sequence or file"
            >
              <b-icon-file-earmark-plus></b-icon-file-earmark-plus>
            </b-button>
          </b-button-group>
          <b-modal id="add-modal" title="Add Files" variant="outline-secondary">
            <SequenceUpload></SequenceUpload>
            <SequencePaste></SequencePaste>
          </b-modal>
        </b-col>
      </b-row>
    </b-col>

    <b-col cols="12" sm="6" lg="2" class="text-center" order-lg="3">
      <b-row>
        <b-col class="pb-1">Legend Mode</b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button-group class="w-100">
            <b-button
              v-b-tooltip.hover
              title="Plot each sequence in its own color with its own legend entry."
              variant="outline-secondary"
            >
              <b-icon-text-indent-left></b-icon-text-indent-left>
            </b-button>
            <b-button
              v-b-tooltip.hover
              title="Plot each file in its own color with its own legend entry."
              variant="outline-secondary"
            >
              <b-icon-file-earmark-text></b-icon-file-earmark-text>
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="12" lg="6" xl="5" class="text-center">
      <b-row>
        <b-col class="pb-1">Visualization Method</b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button-group class="w-100">
            <b-button
              v-for="(description, method) in methods"
              :id="method"
              :key="method"
              v-b-tooltip.hover
              class="text-capitalize"
              :variant="
                currentMethod == method ? 'secondary' : 'outline-secondary'
              "
              :title="description"
              @click="changeMethod({ method: method })"
            >
              {{ method.replace("_", "-") }}
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex"
import SequenceUpload from "./SequenceUpload"
import SequencePaste from "./SequencePaste"
export default {
  components: { SequenceUpload, SequencePaste },
  data: () => {
    return {
      methods: {
        squiggle:
          "(Recommended) Shows variations in GC-content and supports non-ATGC bases.",
        yau_int: "experimental",
        randic:
          "Like tablature, with As, Ts, Cs, and Gs assigned a y-coordinate. No support for non-ATGC bases. Not recommended.",
        qi:
          "Same as Randic, except with dinucleotides instead of bases. Not recommended.",
        gates:
          "Bases are plotted as 2D walks in which Ts, As, Cs, and Gs are up, down, left, and right, respectively.",
      },
      deleteSequences: [],
      deleteFiles: [],
      newGraphTitle: "",
    }
  },
  computed: {
    files() {
      const results = {}
      for (const description in this.sequences) {
        const file = this.sequences[description].file
        if (Object.prototype.hasOwnProperty.call(results, file)) {
          results[file].push(description)
        } else {
          results[file] = [description]
        }
      }
      return results
    },
    ...mapState(["sequences", "currentMethod"]),
  },
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
    editTitle(bvModalEvt) {
      this.$root.$refs.TheVisualization.setGraphTitle(this.newGraphTitle)
      this.$bvModal.hide("modal-prevent-closing")
    },
    handleDelete(bvModalEvt) {
      for (const description of this.deleteSequences) {
        console.log(description)
        this.removeSequence({
          description,
        })
      }
      for (const file of this.deleteFiles) {
        for (const description of this.files[file]) {
          this.removeSequence({
            description,
          })
        }
      }
      this.deleteSequences = []
      this.deleteFiles = []
      this.$bvModal.hide("modal-prevent-closing")
    },
    ...mapActions(["clearState", "changeMethod"]),
    ...mapMutations(["removeSequence"]),
  },
}
</script>
