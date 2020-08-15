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
          Remove files from the visualization by clicking the
          <svg
            class="svg-inline--fa fa-trash fa-w-14"
            width="15px"
            aria-hidden="true"
            data-prefix="fas"
            data-icon="trash"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm415.2 56.7L394.8 467c-1.6 25.3-22.6 45-47.9 45H101.1c-25.3 0-46.3-19.7-47.9-45L32.8 140.7c-.4-6.9 5.1-12.7 12-12.7h358.5c6.8 0 12.3 5.8 11.9 12.7z"
            ></path>
          </svg>
          icon and selecting files
        </li>
        <li>
          Modify the graph's title and subtitle by clicking the
          <svg
            class="svg-inline--fa fa-bars fa-w-14"
            width="15px"
            aria-hidden="true"
            data-prefix="fas"
            data-icon="bars"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
            ></path>
          </svg>
          icon
        </li>
        <li>
          Export the content of the graph in .png, .jpeg, .svg, or .pdf format
          by clicking on the
          <svg
            class="svg-inline--fa fa-file-export fa-w-18"
            width="15px"
            aria-hidden="true"
            data-prefix="fas"
            data-icon="file-export"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M384 121.9c0-6.3-2.5-12.4-7-16.9L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1zM192 336v-32c0-8.84 7.16-16 16-16h176V160H248c-13.2 0-24-10.8-24-24V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V352H208c-8.84 0-16-7.16-16-16zm379.05-28.02l-95.7-96.43c-10.06-10.14-27.36-3.01-27.36 11.27V288H384v64h63.99v65.18c0 14.28 17.29 21.41 27.36 11.27l95.7-96.42c6.6-6.66 6.6-17.4 0-24.05z"
            ></path>
          </svg>
          icon
        </li>
        <li>
          Zoom in on a region of interest by clicking and dragging over it, zoom
          out via the
          <svg
            class="svg-inline--fa fa-search-minus fa-w-16"
            width="15px"
            aria-hidden="true"
            data-prefix="fas"
            data-icon="search-minus"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M304 192v32c0 6.6-5.4 12-12 12H124c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm201 284.7L476.7 505c-9.4 9.4-24.6 9.4-33.9 0L343 405.3c-4.5-4.5-7-10.6-7-17V372c-35.3 27.6-79.7 44-128 44C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208c0 48.3-16.4 92.7-44 128h16.3c6.4 0 12.5 2.5 17 7l99.7 99.7c9.3 9.4 9.3 24.6 0 34zM344 208c0-75.2-60.8-136-136-136S72 132.8 72 208s60.8 136 136 136 136-60.8 136-136z"
            ></path>
          </svg>
          icon, or reset the zoom.
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
