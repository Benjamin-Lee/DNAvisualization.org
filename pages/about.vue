<template>
  <b-container class="my-3">
    <div>
      <h1 class="title">About</h1>
      <p>
        Raw DNA sequences, which consist of long strings of letters, are hard
        for humans to make sense of at a glance. However, there is significant
        biological meaning contained within them. To reveal this meaning,
        <a href="https://squiggle.readthedocs.io/en/latest/methods.html"
          >a number of methods</a
        >
        have been proposed to convert raw DNA sequences into two-dimensional
        visualizations. This website allows you to try several of these methods
        out on your data with a high-performance parallel-computing backend
        enabling genome-scale visualization.
      </p>
      <p>If you use this tool in your research, please cite it as:</p>
      <p class="bg-light rounded p-3 border">
        Benjamin D. Lee, Michael A. Timony, Pablo Ruiz, DNAvisualization.org: a
        serverless web tool for DNA sequence visualization,
        <i>Nucleic Acids Research</i>, Volume 47, Issue W1, 02 July 2019, Pages
        W20–W25,
        <a href="https://doi.org/10.1093/nar/gkz404">
          https://doi.org/10.1093/nar/gkz404
        </a>
      </p>
      <p>Alternatively, if BibTeX is your style:</p>
      <div class="bg-light rounded p-3 border">
        <pre class="mb-0">
@article{10.1093/nar/gkz404,
    author = {Lee, Benjamin D and Timony, Michael A and Ruiz, Pablo},
    title = "{DNAvisualization.org: a serverless web tool for DNA sequence visualization}",
    journal = {Nucleic Acids Research},
    volume = {47},
    number = {W1},
    pages = {W20-W25},
    year = {2019},
    month = {06},
    issn = {0305-1048},
    doi = {10.1093/nar/gkz404},
    url = {https://doi.org/10.1093/nar/gkz404},
    eprint = {https://academic.oup.com/nar/article-pdf/47/W1/W20/28879727/gkz404.pdf},
}</pre
        >
      </div>
    </div>
  </b-container>
</template>
