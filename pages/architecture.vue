<template>
  <div class="container">
    <div>
      <h1 class="title">
        Architecture
      </h1>
      <p>
        DNAvisualization.org is built on an entirelesly serverless architecture.
        Due to the inherently parallelizable nature of DNA sequence
        transformation (the transformation of one sequence has no effect on the
        transformation of another), this design yields a significant performance
        increase at a lower cost compared to a traditional architecture.
        <br /><br />This website uses
        <a href="https://flask.palletsprojects.com/en/1.1.x/">Flask</a> as a
        lightweight Python web framework and
        <a href="https://www.zappa.io/">Zappa</a> to automate deployment to
        Amazon Web Service's (AWS)
        <a href="https://aws.amazon.com/lambda/">Lambda</a> serverless computing
        platform. Additionally, it takes advantace of
        <a href="https://aws.amazon.com/s3/">AWS S3</a> for serverless data
        storage and querying. All stored data are automatically deleted after 24
        hours.<br /><br />
        For a full overview of the architecture, take a look at the
        <a href="https://en.wikipedia.org/wiki/Sequence_diagram"
          >sequence diagram</a
        >
        below:
      </p>
    </div>
  </div>
</template>
