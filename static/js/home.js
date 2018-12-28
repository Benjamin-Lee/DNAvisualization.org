let seqs = {};
let chart = Highcharts.chart('hg-container', {
  credits: {
    text: "BD Lee, et al. (2019). SquiggleDNA.org",
    href: "http://squiggledna.org"
  },
  chart: {
    type: 'line',
    zoomType: 'x',
  },
  // boost: {
  //   useGPUTranslations: true
  // },
  title: {
    text: 'Title will go here'
  },
  xAxis: {
    events: {
      // afterSetExtremes: afterSetExtremes
    }
  },
  series: []
});

let axis_labels = {
  'squiggle': {
    'x': 'position (BP)',
    'y': null
  },
  'gates': {
    'x': 'C-G axis',
    'y': 'A-T axis'
  },
  'yau': {
    'x': null,
    'y': null
  },
  'yau-bp': {
    'x': 'position (BP)',
    'y': null
  }
};
let method = "squiggle"; // default method is squiggle
let method_name = "Squiggle"
let dialog = bootbox.dialog({
  message: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col text-center pad-top">
          <i class="fa fa-spin fa-circle-notch fa-3x"></i>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col text-center pad-top">
          <p id="loading-modal-message">Getting things ready...</p>
        </div>
      </div>
    </div>
  `,
  closeButton: false,
  show: false
});

/* nomenclature
seq_name = the identifying string of the sequence
seq = the sequence
seq_hash = the xx64 hash with seed(0) in base10
*/

function plotSequence(fastaString, filename) {
  dialog.modal("show");
  if (!validateFasta(fastaString)) {
    bootbox.alert({
      size: "large",
      title: filename ? "Bad FASTA file" : "Invalid submission.",
      message: filename ? `<pre style="display: inline;">${filename}</pre> doesn't appear to be a valid FASTA file.` : `This doesn't appear to be a valid FASTA-formatted sequence.`,
      buttons: {
        ok: {
          className: 'btn-secondary',
        }
      }
    });
    setTimeout(function () {
      dialog.modal("hide");
    }, 500);
    return false
  }
  // load all the parsed seqs_names and seq_hashes into the seqs iable
  // TODO: only perform this procedure on new seqs (don't allow redragging of files already present)
  let parsed = fasta2json(fastaString);
  if (method != "squiggle") {
    if (!validateDNA(parsed)) {
      bootbox.alert({
        size: "large",
        title: "Incompatible method",
        message: filename ? `<pre style="display: inline;">${filename}</pre> appears to have non-ATGC bases in it. The ${method_name} method doesn't support non-ATGC bases, so plotting using Squiggle instead.` : `This sequences has non-ATGC bases in it. The ${method_name} method doesn't support non-ATGC bases, so plotting using Squiggle instead.`,
        buttons: {
          ok: {
            className: 'btn-secondary',
          }
        }
      });
      method = "squiggle";
      method_name = "Squiggle"
    }
  }

  for (seq of parsed) {
    seqs[seq["name"]] = {
      filename: filename,
      hash: XXH.h64(seq["seq"], 0).toString(10),
      length: seq["seq"].length
    };
  }

  // set the axis labels to reflect the viz method
  chart.xAxis[0].setTitle({
    text: axis_labels[method]["x"]
  })
  chart.yAxis[0].setTitle({
    text: axis_labels[method]["y"]
  })

  // then, transform the seqs, get the downsampled data, and render the viz
  $("#loading-modal-message").text("Visualizing your data...");
  axios.all(parsed.map(x => transform(x.name, x.seq)))
    .then(function () {
      $("#loading-modal-message").text("Retrieving your data..."); // update the status message
      axios.all(parsed.map(k => seqQuery(seqs[k["name"]]["hash"])))
        .then(function (results) {
          for (result of results) {

            // determine the name associated with the hash
            resultName = _.invertBy(seqs, (x) => {
              return [x.hash]
            })[result.data[0]][0];

            // add the series to chart (with animation!)
            chart.addSeries({
              name: resultName,
              id: result.data[0],
              data: result.data[1]
            });
          };
          document.getElementById("hg-container").style.display = "block"; // after dropping, show chart div
          document.querySelector(".hide-before-plot-shown").style.display = "block"; // after dropping, show chart div
          $(".hide-when-plotting").hide();
          setTimeout(function () {
            dialog.modal("hide");
          }, 750);
        })
    })

  // make the subtitle reflect the plotting method
  chart.setTitle(null, {
    text: `Plotted using the ${method_name} method.`
  });
}

function seqQuery(seq_hash, x_min = null, x_max = null) {
  return axios.get(route + "/seq_query", {
    params: {
      seq_hash: seq_hash,
      method: method,
      x_min: x_min,
      x_max: x_max
    }
  });
};

function transform(seq_name, seq) {
  let bodyFormData = new FormData();
  bodyFormData.set('seq_name', seq_name);
  bodyFormData.set('seq', seq);
  bodyFormData.set('method', method);
  return axios({
    method: 'post',
    url: route + '/transform',
    data: bodyFormData,
    config: {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  })
}

function afterSetExtremes(e) {
  // upon setting the x range of the graph, get the data for that region
  chart.showLoading('Loading data...');
  axios.all(Object.keys(seqs).map(x => seqQuery(seqs[x]["hash"], e.min, e.max)))
    .then(function (results) {
      for (result of results) {
        chart.get(result.data[0]).setData(result.data[1]);
      }
      chart.hideLoading();
    }); // handle response.

}


window.onload = function () {

  let options = {
    // CSS Class to add to the drop element when a drag is active
    readAsDefault: 'Text',

    on: {
      load: function (e, file) {
        plotSequence(e.target.result, file.name);
      }
    }
  }

  // support for drag-and-drop, copy-pasting, and a file upload button
  FileReaderJS.setupClipboard(document.body, options);
  FileReaderJS.setupInput(document.getElementById('file-input'), options);
  FileReaderJS.setupDrop(document.getElementById('dropzone'), options);
  FileReaderJS.setupDrop(document.body, options);

  // render all tooltips
  $('[data-toggle="tooltip"]').tooltip()

  // bind the viz method button to the method iable
  $('input[name=method]').change(function () {
    let methods = {
      squiggle: "Squiggle",
      gates: "Gates",
      yau: "Yau",
      "yau-bp": "Yau-BP"
    }
    method = $(this).attr('id');
    method_name = methods[method];
  });

  // once the user has clicked a control, hide the tooltip
  $('#controls').click(function () {
    $('[data-toggle="tooltip"]').tooltip("hide");
  })

  $("#paste-sequence").click(function () {
    bootbox.prompt({
      title: "Paste a FASTA-formatted sequence",
      inputType: 'textarea',
      backdrop: true,
      callback: function (result) {
        if (!result) {
          return
        }
        plotSequence(result, "");
      },
      size: "large",
      buttons: {
        cancel: {
          className: 'btn-outline-secondary',
        },
        confirm: {
          className: 'btn-secondary',
        }
      }
    });

  })

  $("#load-example").click(function () {
    plotSequence(hbb, "hbb.fasta")
  });


  // warn before leaving
  // window.onbeforeunload = function (event) {
  //   if (document.getElementById("hg-container").style.display == "block") {
  //     return "Are you sure you want to leave the page? Your visualization will be lost.";
  //   } else {
  //     return "";
  //   }
  // };

}