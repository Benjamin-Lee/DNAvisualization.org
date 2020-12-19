<template>
  <div>
    <b-modal
      id="loading-modal"
      v-model="showSpinner"
      hide-footer
      header-close-content=""
      no-close-on-backdrop
      no-close-on-esc
      :title="
        'Visualizing in your browser with ' +
        (useWasm ? 'WebAssembly' : 'JavaScript')
      "
    >
      <div class="text-center">
        <b-spinner
          label="Loading..."
          style="width: 3rem; height: 3rem"
        ></b-spinner>
      </div>
    </b-modal>
    <TheJumbotron></TheJumbotron>
    <b-container class="mt-3">
      <TheVisualization></TheVisualization>
    </b-container>
    <b-container class="my-5 px-md-0 px-lg-5">
      <b-row align-h="between">
        <b-col md="7" xs="12">
          <h1 class="h4">Overview</h1>
          <p style="text-align: justify; text-justify: inter-word" class="mb-0">
            Raw DNA sequences, which consist of long strings of bases, are hard
            for humans to make sense of at a glance. However, there is
            significant biological meaning contained within. To reveal this
            meaning,
            <a href="https://squiggle.readthedocs.io/en/latest/methods.html">
              a number of methods
            </a>
            have been proposed to convert raw DNA sequences into two-dimensional
            visualizations. This website allows you to try several of these
            methods out on your in your browser. No data leaves your computer,
            thanks to the power of WebAssembly!
          </p>
        </b-col>
        <b-col md="5" lg="4" class="d-flex align-items-center flex-wrap">
          <div class="clearfix mt-4 my-md-0">
            <p class="h6 text-center pb-2">Brought to you by</p>
            <a href="https://iqt.org/labs" target="_blank">
              <b-img
                src="images/iqt-Labs-full-color_high-res.png"
                alt="IQT Labs"
                fluid
              ></b-img>
            </a>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <p class="my-4">
            If you use this tool in your research, please cite it as:
          </p>
          <p class="bg-light rounded p-3 border mt-4 mb-0">
            Benjamin D. Lee, Michael A. Timony, Pablo Ruiz,
            DNAvisualization.org: a serverless web tool for DNA sequence
            visualization, <i>Nucleic Acids Research</i>, Volume 47, Issue W1,
            02 July 2019, Pages W20–W25,
            <a href="https://doi.org/10.1093/nar/gkz404">
              https://doi.org/10.1093/nar/gkz404
            </a>
          </p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapState } from "vuex"
export default {
  computed: {
    ...mapState(["useWasm", "showSpinner"]),
  },
  async created() {
    await this.$nextTick()
  },
}
</script>
