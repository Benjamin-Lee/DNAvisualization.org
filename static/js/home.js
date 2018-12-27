var seqs = {};
var chart = Highcharts.chart('hg-container', {
  credits: {
    text: "BD Lee, et al. (2019). SquiggleDNA.org",
    href: "http://squiggledna.org"
  },
  chart: {
    type: 'line',
    zoomType: 'x'
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

var axis_labels = {
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

/* nomenclature
seq_name = the identifying string of the sequence
seq = the sequence
seq_hash = the xx64 hash with seed(0) in base10
*/

function seqQuery(seq_hash, method, x_min = null, x_max = null) {
  return axios.get(route + "/seq_query", {
    params: {
      seq_hash: seq_hash,
      method: method,
      x_min: x_min,
      x_max: x_max
    }
  });
};

function transform(seq_name, seq, method) {
  var bodyFormData = new FormData();
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
  axios.all(Object.keys(seqs).map(x => seqQuery(seqs[x]["hash"], $("#method").val(), e.min, e.max)))
    .then(function (results) {
      for (result of results) {
        chart.get(result.data[0]).setData(result.data[1]);
      }
      chart.hideLoading();
    }); // handle response.

}


window.onload = function () {

  var options = {
    // CSS Class to add to the drop element when a drag is active
    readAsDefault: 'Text',

    on: {
      load: function (e, file) {
        if (!validateFasta(e.target.result)) {
          bootbox.alert({
            size: "large",
            title: "Bad FASTA file",
            message: `<pre style="display: inline;">${file.name}</pre> doesn't appear to be a valid FASTA file. Proceeding without parsing it.`,
          })
          return false
        }
        // load all the parsed seqs_names and seq_hashes into the seqs variable
        // TODO: only perform this procedure on new seqs (don't allow redragging of files already present)
        var parsed = window.parse_fasta(e.target.result);
        for (seq of parsed) {
          seqs[seq["name"]] = {
            filename: file.name,
            hash: XXH.h64(seq["sequence"], 0).toString(10),
            length: seq["sequence"].length
          };
        }

        // set the axis labels to reflect the viz method
        chart.xAxis[0].setTitle({
          text: axis_labels[$("#method").val()]["x"]
        })
        chart.yAxis[0].setTitle({
          text: axis_labels[$("#method").val()]["y"]
        })

        // hide the method selector
        document.getElementById("method").style.display = "none";
        document.getElementById("method-label").style.display = "none";

        // then, transform the seqs, get the downsampled data, and render the viz
        axios.all(parsed.map(x => transform(x.name, x.sequence, $("#method").val())))
          .then(function () {
            axios.all(parsed.map(k => seqQuery(seqs[k["name"]]["hash"], $("#method").val())))
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
                }
              })
          })
        document.getElementById("hide-when-plotting").style.display = "none"; // get rid of the jumbotron
        document.getElementById("hg-container").style.display = "block"; // after dropping, show chart div
      }
    }
  }

  // support for drag-and-drop, copy-pasting, and a file upload button
  FileReaderJS.setupClipboard(document.body, options);
  FileReaderJS.setupInput(document.getElementById('file-input'), options);
  FileReaderJS.setupDrop(document.getElementById('dropzone'), options);
  FileReaderJS.setupDrop(document.body, options);

  $('[data-toggle="tooltip"]').tooltip()

  // warn before leaving
  window.onbeforeunload = function (event) {
    if (document.getElementById("hg-container").style.display == "block") {
      return "Are you sure you want to leave the page? Your visualization will be lost.";
    } else {
      return "";
    }
  };

}