<template>
  <div>
    <textarea v-model="sequence" placeholder="enter sequence"></textarea>
    <br />Coordinates: {{ coordinates }}
  </div>
</template>
<script>
// const dna = require("dnaviz")
import * as dna from "dnaviz"
export default {
  data() {
    return {
      sequence: "",
    }
  },
  computed: {
    coordinates() {
      return dna.squiggle(this.sequence)
    },
  },
}
</script>
