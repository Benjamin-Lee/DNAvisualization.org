<template>
  <b-container class="mb-4">
    <div>
      <h1 class="mt-4 mb-3">Instructions</h1>

      <ol>
        <li>
          Using this website is easy - First, upload a sequence by:
          <ul>
            <li>Clicking the "browse" button</li>
            <li>Loading an example file</li>
            <li>
              Pasting the contents of a FASTA or Genbank file into a textbox
            </li>
          </ul>
        </li>
        <li>Choose a visualization method</li>
      </ol>

      <h2>That's it.</h2>
      <p>Optionally, after plotting a sequence, you can:</p>
      <ul>
        <li>
          Remove files or sequences from the visualization by clicking the
          <b-icon-trash></b-icon-trash>
        </li>
        <li>
          Add files or sequences to the visualization by clicking the
          <b-icon-file-earmark-plus></b-icon-file-earmark-plus>
        </li>
        <li>
          Modify the graph's title by clicking the
          <b-icon-gear></b-icon-gear>
          icon
        </li>
        <li>
          Export the content of the graph in .png, .jpeg, .svg, format, or as
          JSON data, by clicking on the
          <b-icon-download></b-icon-download>
          icon
        </li>
        <li>
          Zoom in on a region of interest by clicking and dragging over it, or
          zoom in and out using the buttons on the graph's toolbar. Reset the
          zoom by double-clicking on the graph.
        </li>
      </ul>
      <p>
        When you plot your data using this website, there are a few things to
        remember. By default, each DNA sequence you wish to display will be
        rendered in a different color unless there are more sequences than there
        are available colors, in which case each file will be shown in its own
        color. This may be overridden at any time using the "legend mode"
        selector that becomes visible after plotting. <br /><br />For each
        sequence, the website can display a maximum of 175 Mbp. While there is
        no limit on the total number of sequences which can be displayed
        simultaneously, a maximum of 525 Mbp can be displayed at once.
        <br /><br />
        On the "visualization method" click-box, you choose how to display your
        data using the five different display methods currently supported. As
        you look at an output graph with several overlaid sequences, you will
        see that when the sequences completely mirror one another, that the
        sequences are essentially identical. When you see the plot lines begin
        to diverge, you will instantly be able to see where the sequences have
        begun to differ. You can zoom in for a closer view, then reset the zoom
        to enable a return the original (unzoomed) view. When the sequences are
        parallel on the plot, that tells you that the sequences are once again
        identical after a period of divergence. <br /><br />Try visualizing your
        data with each of the visualization techniques; each method shows your
        data from a slightly different perspective, but be aware of each
        method’s strengths or weaknesses so that you use the right tool for the
        right job. When you finish using the site, you can output your data
        using the png, .jpeg, .svg, or as JSON data, formats in a
        publication-ready graph.
      </p>
    </div>
  </b-container>
</template>
