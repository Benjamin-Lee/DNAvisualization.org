<template>
  <div>
    <textarea v-model="sequences" placeholder="enter sequence"></textarea>
    <button @click="transformSequences">submit</button>
  </div>
</template>
<script>
import { parse as fastaParse } from "biojs-io-fasta"

export default {
  data() {
    return { sequences: ">hi\natgc" }
  },
  methods: {
    transformSequences() {
      for (const sequence of fastaParse(this.sequences)) {
        this.$store.dispatch("transformSequence", {
          description: sequence.name,
          sequence: sequence.seq,
          method: "yau_bp",
        })
      }
    },
  },
}
</script>
