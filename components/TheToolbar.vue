<template>
  <b-row class="bg-light border rounded">
    <b-col>
      <b-button variant="outline-secondary" @click="confirmClear">
        Clear
      </b-button>
      <b-button variant="outline-secondary" @click="saveImg">Save</b-button>
    </b-col>
    <b-col>
      <b-button-toolbar key-nav aria-label="Toolbar with button groups">
        <b-button-group class="mx-1">
          <b-button
            v-for="method in methods"
            :key="method"
            :variant="
              currentMethod == method ? 'secondary' : 'outline-secondary'
            "
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

export default {
  data: () => {
    return {
      methods: ["squiggle", "yau", "yau_bp", "randic", "qi", "gates"],
    }
  },
  computed: { ...mapState(["currentMethod"]) },
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
    saveImg() {
      this.$root.$refs.TheVisualization.$refs.plotly.downloadImage({
        format: "svg",
        filename: "dnavisualization-" + new Date().toISOString(),
      })
    },
    ...mapActions(["clearState", "changeMethod"]),
  },
}
</script>
