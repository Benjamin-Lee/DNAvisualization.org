var seqs = {};

function getSeries(seq_id, x_min = null, x_max = null) {
  return axios.get(route + "/seq_query", {
    params: {
      seq_hash: seqs[seq_id]["hash"],
      seq_id: seq_id,
      x_min: x_min,
      x_max: x_max
    }
  });
};

function transform(seq_id, seq) {
  var bodyFormData = new FormData();
  bodyFormData.set('seq_id', seq_id);
  bodyFormData.set('seq', seq);
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
  var chart = Highcharts.charts[Highcharts.charts.length - 1];
  chart.showLoading('Loading data...');
  axios.all(Object.keys(seqs).map(x => getSeries(x, e.min, e.max)))
    .then(function (results) {
      chart.series[0].setData(results[0].data.data);
      chart.hideLoading();
    }); // handle response.

}

function renderChart() {
  let x = [];
  for (seq_id of Object.keys(seqs)) {
    x.push({
      name: seq_id,
      data: seqs[seq_id]["data"]
    })
  }
  var myChart = Highcharts.chart('container', {
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
      title: {
        text: 'Base'
      },
      events: {
        afterSetExtremes: afterSetExtremes
      }
    },
    yAxis: {
      title: {
        text: ''
      }
    },
    series: x
  });
  document.getElementById("container").style.display = "block"; // after dropping, show chart div
};


window.onload = function () {

  var options = {
    // CSS Class to add to the drop element when a drag is active
    readAsDefault: 'Text',

    // A string to match MIME types, for instance
    // accept: ".fasta",
    on: {
      load: function (e, file) {

        // load all the parsed seq_ids and seq_hashes into the seqs variable
        var parsed = window.parse_fasta(e.target.result);
        for (seq of parsed) {
          seqs[seq["name"]] = {
            filename: file.name,
            hash: XXH.h64(seq["sequence"], 0).toString(10)
          };
        }

        // then, transform the seqs, get the downsampled data, and render the viz
        axios.all(parsed.map(x => transform(x.name, x.sequence)))
          .then(function (results) {
            axios.all(Object.keys(seqs).map(k => getSeries(k)))
              .then(function (results) {
                for (result of results) {
                  seqs[result.data.name]["data"] = result.data.data;
                };
                renderChart();
              })
          });
      }
    }
  }

  // support for drag-and-drop, copy-pasting, and a file upload button
  FileReaderJS.setupClipboard(document.body, options);
  FileReaderJS.setupInput(document.getElementById('file-input'), options);
  FileReaderJS.setupDrop(document.getElementById('dropzone'), options);
}