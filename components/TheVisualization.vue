<template>
  <div>Sequences: {{ stringified }}</div>
</template>
<script>
// const dna = require("dnaviz")
import { mapState } from "vuex"

export default {
  computed: {
    stringified() {
      return JSON.stringify(this.sequences)
    },
    ...mapState(["sequences"]),
  },
}
</script>
