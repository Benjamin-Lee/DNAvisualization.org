var seqs = [];


function getSeries(seq, x_min = null, x_max = null) {
  return axios.get('/seq_query', {
    params: {
      seq_hash: seq.seq_hash,
      seq_id: seq.seq_id,
      x_min: x_min,
      x_max: x_max
    }
  })
};

function afterSetExtremes(e) {

  var chart = Highcharts.charts[0];
  chart.showLoading('Loading data...');
  axios.all(seqs.map(x => getSeries(x, e.min, e.max)))
    .then(function (results) {
      console.log(results[0].data)
      chart.series[0].setData(results[0].data.data);
      chart.hideLoading();
    }); // handle response.

}

function renderChart(x) {
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
};

function sendFile(file) {
  var uri = "/fasta";
  var xhr = new XMLHttpRequest();
  var fd = new FormData();

  xhr.open("POST", uri, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      seqs = JSON.parse(xhr.responseText);
      axios.all(seqs.map(x => getSeries(x)))
        .then(function (results) {
          renderChart(results.map(x => x.data));
        }); // handle response.


    }
  };
  fd.append('sequence', file);
  // Initiate a multipart/form-data upload
  xhr.send(fd);
}

window.onload = function () {
  var dropzone = document.getElementById("dropzone");
  dropzone.ondragover = dropzone.ondragenter = function (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  dropzone.ondrop = function (event) {
    document.getElementById("container").style.display = "block";
    event.stopPropagation();
    event.preventDefault();

    var filesArray = event.dataTransfer.files;
    for (var i = 0; i < filesArray.length; i++) {
      sendFile(filesArray[i]);
    }
  }
}