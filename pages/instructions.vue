<template>
  <div class="container">
    <div>
      <h1 class="title">
        Instructions
      </h1>

      <ol>
        <li>
          Using this website is easy: Choose a visualization method. For full
          information about the visualization methods, take a look here.
        </li>
        <li>
          Upload a sequence by:
          <ul>
            <li>Clicking the "browse" button</li>
            <li>Dragging a file anywhere on the pagev</li>
            <li>Loading an example file</li>
            <li>Pasting a file while anywhere on the page</li>
            <li>Pasting the contents of a FASTA file into a textbox</li>
          </ul>
        </li>
      </ol>

      <h2>That's it.</h2>
      <p>Optionally, after plotting a sequence, you can:</p>
      <ul>
        <li>
          Remove files from the visualization by clicking the icon and selecting
          files
        </li>
        <li>Modify the graph's title and subtitle by clicking the icon</li>
        <li>
          Export the content of the graph in .png, .jpeg, .svg, or .pdf format
          by clicking on the icon
        </li>
        <li>
          Zoom in on a region of interest by clicking and dragging over it, zoom
          out via the icon, or reset the zoom.
        </li>
      </ul>
      <p>
        When you plot your data using this website, there are a few things to
        remember. By default, each DNA sequence you wish to display will be
        rendered in a different color unless there are more sequences than there
        are availible colors, in which case each file will be shown in its own
        color. This may be overridden at any time using the "legend mode"
        selector that becomes visible after plotting. Although the website can
        display up to thirty sequences of up to 4.5 Mbp each simultaneously, you
        may find that the resulting graph becomes very cluttered.<br /><br />
        On the "visualization method" click-box, you choose how to display your
        data using the three different display methods currently supported. We
        are actively investigating adding more methods. <br /><br />As you look
        at an output graph with several overlaid sequences, you will see that
        when the sequences completely mirror one another, that the sequences are
        essentially identical. When you see the plot lines begin to diverge, you
        will instantly be able to see where the sequences have begun to differ.
        You can zoom in for a closer view, then reset the zoom to enable a
        return the original (unzoomed) view. When the sequences are parallel on
        the plot, that tells you that the sequences are once again identical
        after a period of divergence. <br /><br />Try visualizing your data with
        each of the visualization techniques; each method shows your data from a
        slightly different perspective, but be aware of each method’s strengths
        or weaknesses so that you use the right tool for the right job.
        <br /><br />When you finish using the site, you can output your data
        using the .png, .pdf, or .jpg formats in a publication-ready graph. Your
        data will be retained for 24 hours, but after that time has elapsed, you
        will need to re-upload your data if you wish to continue using this
        tool.
      </p>
    </div>
  </div>
</template>
