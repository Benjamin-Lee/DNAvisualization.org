<template>
  <div>{{ message }}</div>
</template>
<script>
// const dna = require("dnaviz")
import * as dna from "dnaviz"
export default {
  data() {
    return { message: dna.squiggle("ATGCCG") }
  },
}
</script>
