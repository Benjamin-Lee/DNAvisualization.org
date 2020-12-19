<template>
  <b-container class="mb-4">
    <div>
      <h1 class="mt-4 mb-3">About</h1>
      <p>
        Raw DNA sequences, which consist of long strings of bases, are hard for
        humans to make sense of at a glance. However, there is significant
        biological meaning contained within. To reveal this meaning,
        <a href="https://squiggle.readthedocs.io/en/latest/methods.html">
          a number of methods
        </a>
        have been proposed to convert raw DNA sequences into two-dimensional
        visualizations. This website allows you to try several of these methods
        out on your in your browser. No data leaves your computer, thanks to the
        power of WebAssembly!
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
      <h2 class="mt-4 mb-3">Citations of DNAvisualization.org</h2>
      <p>
        For the most recent list of citations, take a look at
        <a
          href="http://https://scholar.google.com/scholar?um=1&ie=UTF-8&lr&cites=8477964527188943004"
          target="_blank"
          rel="noopener noreferrer"
        >
          our Google Scholar page.
        </a>
        Here are a few:
      </p>
      <ul>
        <li>
          Niu, Xingzhi, et al. "Leveraging 4erverless computing to improve
          performance for sequence comparison."
          <i
            >Proceedings of the 10th ACM International Conference on
            Bioinformatics, Computational Biology and Health Informatics.</i
          >
          2019.
        </li>
        <li>
          Shafiei, Hossein, Ahmad Khonsari, and Payam Mousavi. "Serverless
          computing: A survey of opportunities, challenges and applications."
          (2020).
        </li>
        <li>
          Malla, Sulav, and Ken Christensen. "HPC in the cloud: Performance
          comparison of function as a service (FaaS) vs infrastructure as a
          service (IaaS)." Internet Technology Letters 3.1 (2020): e137.
        </li>
        <li>
          Veldsman, Werner P., et al. "Characterization of the complete
          mitochondrial genome of a coconut crab, Birgus latro (Linnaeus,
          1767)(Decapoda: Anomura: Coenobitidae), from Okinawa, Japan." Journal
          of Crustacean Biology (2020).
        </li>
        <li>
          Khandelwal, Anurag, Arun Kejariwal, and Karthikeyan Ramasamy. "Le
          Taureau: Deconstructing the Serverless Landscape & A Look Forward."
          Proceedings of the 2020 ACM SIGMOD International Conference on
          Management of Data. 2020.
        </li>
        <li>
          Temple, Mark D. "Real-time audio and visual display of the Coronavirus
          genome." (2020).
        </li>
      </ul>
      <h2 class="mt-4 mb-3">Methods Reference</h2>
      <p>For references for the supported methods, please look here:</p>
      <details>
        <summary>Squiggle</summary>
        <p>
          If you use the Squiggle visualization method, please cite the
          following paper
          <a
            href="https://academic.oup.com/bioinformatics/advance-article/doi/10.1093/bioinformatics/bty807/5104938?guestAccessKey=306f0370-1281-428b-aa8a-757d3c49d801"
            >(full text)</a
          >:
        </p>
        <ul>
          <li>
            Lee, B. D. (2018). Squiggle: a user-friendly two-dimensional DNA
            sequence visualization tool.
            <span class="font-italic">Bioinformatics</span>. doi:<a
              href="https://doi.org/10.1093/bioinformatics/bty807"
              >10.1093/bioinformatics/bty807</a
            >.
          </li>
        </ul>
      </details>
      <details>
        <summary>Yau</summary>

        <p>
          If you use the Yau visualization method, please cite the following
          paper
          <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC162336/"
            >(full text)</a
          >:
        </p>
        <ul>
          <li>
            Yau, S. S., Wang, J., Niknejad, A., Lu, C., Jin, N., & Ho, Y. K.
            (2003). DNA sequence representation without degeneracy.
            <span class="font-italic">Nucleic acids research, 31</span>(12),
            3078-80.
          </li>
        </ul>
      </details>
      <details>
        <summary>Randić</summary>
        <p>
          If you use the Randic visualization method, please cite the following
          paper:
        </p>
        <ul>
          <li>
            Randić, M., Vračko, M., Lerš, N., & Plavšić, D. (2003). Novel 2-D
            graphical representation of DNA sequences and their numerical
            characterization.
            <span class="font-italic">Chemical Physics Letters, 368</span>(1–2),
            1–6. doi:<a href="https://doi.org/10.1016/s0009-2614(02)01784-0"
              >10.1016/s0009-2614(02)01784-0</a
            >.
          </li>
        </ul>
      </details>
      <details class="pb-3">
        <summary>Qi</summary>
        <p>
          If you use the Qi visualization method, please cite the following
          paper:
        </p>
        <ul>
          <li>
            Qi, Z., & Qi, X. (2007). Novel 2D graphical representation of DNA
            sequence based on dual nucleotides.
            <span class="font-italic">Chemical Physics Letters, 440</span>(1–3),
            139–144. doi:<a href="https://doi.org/10.1016/j.cplett.2007.03.107"
              >10.1016/j.cplett.2007.03.107</a
            >.
          </li>
        </ul>
      </details>
    </div>
  </b-container>
</template>
