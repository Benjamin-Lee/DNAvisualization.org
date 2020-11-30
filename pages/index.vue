<template>
  <div>
    <b-jumbotron fluid bg-variant="light">
      <template #header>Turn DNA into graphs.</template>

      <template #lead>
        This is a simple hero unit, a simple jumbotron-style component for
        calling extra attention to featured content or information.
      </template>

      <hr class="my-4" />

      <p>
        It uses utility classes for typography and spacing to space content out
        within the larger container.
      </p>

      <b-button variant="outline-primary" href="#">Load Example</b-button>
      <b-button variant="outline-success" href="#">Upload File</b-button>
      <p class="mt-3">Or paste a FASTA-formatted sequence:</p>
      <TheControlPanel></TheControlPanel>
    </b-jumbotron>
    <b-container class="mt-3">
      <TheVisualization></TheVisualization>
    </b-container>
  </div>
</template>
