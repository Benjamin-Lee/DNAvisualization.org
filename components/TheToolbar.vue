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
              >
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
                  <b-button variant="outline-secondary" @click="confirmClear">
                    Clear
                  </b-button>
                </b-form-checkbox-group>
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
              <b-icon-gear></b-icon-gear>
            </b-button>
            <b-modal
              id="title-modal"
              title="Change Title"
              variant="outline-secondary"
              @ok="editTitle"
            >
              <b-form-input
                v-model="title"
                placeholder="Enter your new title"
              ></b-form-input>
            </b-modal>
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
import { mapState, mapActions } from "vuex"
import SequenceUpload from "./SequenceUpload"
export default {
  components: { SequenceUpload },
  data: () => {
    return {
      title: "",
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
    editTitle(bvModalEvt) {
      this.changeTitle({
        title: this.title,
      })
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing")
      })
    },
    ...mapActions(["clearState", "changeMethod", "changeTitle"]),
  },
}
</script>
