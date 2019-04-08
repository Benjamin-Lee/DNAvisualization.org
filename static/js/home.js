const SEQ_NUMBER_LIMIT = 30
const SEQ_LENGTH_LIMIT = 4500000

// to match the bootstrap look
Highcharts.setOptions({
  chart: {
    style: {
      'fontFamily': '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !default'
    }
  }
})

let seqs = {}
let chart = Highcharts.chart('hg-container', {
  credits: {
    text: 'BD Lee, et al. (2019). DNAvisualization.org',
    href: 'http://DNAvisualization.org'
  },
  chart: {
    type: 'line',
    zoomType: 'xy',
    resetZoomButton: {
      theme: {
        display: 'none'
      }
    },
    panKey: 'shift',
    panning: true
  },
  // boost: {
  //   useGPUTranslations: true
  // },
  title: {
    text: 'vis'
  },
  xAxis: {
    events: {
      afterSetExtremes: afterSetExtremes
    }
  },
  series: [],
  navigation: {
    buttonOptions: {
      enabled: false
    }
  }
})
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
  },
  'randic': {
    'x': 'position (BP)',
    'y': 'nucleotide'
  },
  'qi': {
    'x': 'position (BP)',
    'y': 'dinucleotide'
  }
}
let methods = {
  squiggle: 'Squiggle',
  gates: 'Gates',
  yau: 'Yau',
  'yau-bp': 'Yau-BP',
  randic: 'Randic',
  qi: 'Qi'
}
let method = 'squiggle' // default method is squiggle
let method_name = 'Squiggle'
let selectedMethods = ['squiggle'] // to hold the list of selected viz methods
let user_title = ''
let user_subtitle = ''
let default_zoom = true
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
})
let dropModal = bootbox.dialog({
  message: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col text-center pad-top">
          <span class="fa-layers fa-4x">
            <i class="fas fa-file"></i>
            <i class="fa-inverse fas fa-dna" data-fa-transform="shrink-10 down-2"></i>
          </span>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col text-center pad-top">
          <p>Drop your FASTA file anywhere on the page!</p>
        </div>
      </div>
    </div>
  `,
  closeButton: false,
  backdrop: true,
  show: false,
  size: 'large'
})
let titleModal = bootbox.dialog({
  message: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col pad-top">
          <div class="form-label-group">
            <input type="text" id="title" class="form-control" placeholder="Title" required autofocus>
            <label for="title">Title</label>
          </div>
          <div class="form-label-group">
            <input type="text" id="subtitle" class="form-control" placeholder="Subtitle" required autofocus>
            <label for="subtitle">Subtitle</label>
          </div>
        </div>
      </div>
    </div>
  `,
  title: 'Plot options',
  closeButton: true,
  backdrop: true,
  show: false,
  buttons: {
    cancel: {
      className: 'btn-outline-secondary'
    },
    confirm: {
      className: 'btn-secondary'
    }
  }
})
let pastedFASTACount = 0 // so that we can individually remove pasted FASTA seqs
let mode = 'auto' // default to auto legend labeling mode

/* nomenclature
seq_name = the identifying string of the sequence
seq = the sequence
seq_hash = the xx64 hash with seed(0) in base10
*/

function plotSequence (fastaString, filename) {
  dialog.modal('show')

  if (!selectedMethods.length) {
    bootbox.alert({
      message: 'At least one method must be selected.',
      backdrop: true,
      buttons: {
        ok: {
          className: 'btn-secondary'
        }
      } })
    setTimeout(function () {
      dialog.modal('hide')
    }, 500)
    return false
  }

  if (!validateFasta(fastaString)) {
    bootbox.alert({
      title: filename ? 'Error: Bad FASTA file' : 'Error: Invalid submission.',
      message: filename ? `<span class="text-monospace"">${filename}</span> doesn't appear to be a valid FASTA file.` : `This doesn't appear to be a valid FASTA-formatted sequence.`,
      backdrop: true,
      buttons: {
        ok: {
          className: 'btn-secondary'
        }
      }
    })
    setTimeout(function () {
      dialog.modal('hide')
    }, 500)
    return false
  }
  // load all the parsed seqs_names and seq_hashes into the seqs iable
  // TODO: only perform this procedure on new seqs (don't allow redragging of files already present)
  let parsed = fasta2json(fastaString)

  let addedCount = 0
  for (seq of parsed) {
    if (seq['seq'].length <= SEQ_LENGTH_LIMIT) {
      seqs[seq['name']] = {
        filename: filename,
        hash: XXH.h64(seq['seq'], 0).toString(10),
        length: seq['seq'].length,
        overviewData: {}
      }
      addedCount++
    } else {
      bootbox.alert({
        title: 'Error: Sequence is too long',
        message: `We were unable to visualize <span class="text-monospace"">${seq['name']}</span> because its length (${seq['seq'].length} bp) is greater than our limit of ${SEQ_LENGTH_LIMIT} bp. If this is a feature your require, use the downloadable <a href="https://github.com/Lab41/squiggle">Squiggle software package.`,
        backdrop: true,
        buttons: {
          ok: {
            className: 'btn-secondary'
          }
        }
      })
    }
  }

  // if all the seqs are too long, give up
  if (!addedCount) {
    setTimeout(function () {
      dialog.modal('hide')
    }, 500)
    return false
  }

  // don't allow users to overload Highcharts
  // https://github.com/highcharts/highcharts/issues/9766
  if (_.keys(seqs).length > SEQ_NUMBER_LIMIT) {
    for (seq of parsed) {
      delete seqs[seq['name']]
    };
    bootbox.alert({
      title: 'Error: Too many sequences',
      message: `Currently, this website is unable to visualize more than ${SEQ_NUMBER_LIMIT} sequences at a time. We are aware of this issue and actively working on fixing it. To see the status of this issue, click <a href="https://github.com/highcharts/highcharts/issues/9766">here</a>. If this is a feature your require, use the downloadable <a href="https://github.com/Lab41/squiggle">Squiggle software package.`,
      backdrop: true,
      buttons: {
        ok: {
          className: 'btn-secondary'
        }
      }
    })
    setTimeout(function () {
      dialog.modal('hide')
    }, 500)
    return false
  };

  if (method != 'squiggle') {
    if (!validateDNA(parsed)) {
      bootbox.alert({
        size: 'large',
        title: 'Error: Incompatible method',
        backdrop: true,
        message: filename ? `<span class="text-monospace">${filename}</span> appears to have non-ATGC bases in it. The ${method_name} method doesn't support non-ATGC bases, so plotting using Squiggle instead.` : `This sequences has non-ATGC bases in it. The ${method_name} method doesn't support non-ATGC bases, so plotting using Squiggle instead.`,
        buttons: {
          ok: {
            className: 'btn-secondary'
          }
        }
      })
      method = 'squiggle'
      method_name = 'Squiggle'
    }
  }

  // make sure the axes match the viz method
  updateAxes()

  // then, transform the seqs, get the downsampled data, and render the viz
  $('#loading-modal-message').text('Visualizing your data...')
  axios.all(parsed.map(x => transform(x.name, x.seq, method)))
    .then(function (results) {
      for (result of results) {
        // determine the name associated with the hash
        resultName = _.invertBy(seqs, (x) => {
          return [x.hash]
        })[result.data[0]][0]

        // store the downsampled shape
        seqs[resultName]['overviewData'][method] = result.data[1]
      };

      $('.show-when-plotting').show()
      $('.hide-when-plotting').hide()
      setTimeout(function () {
        dialog.modal('hide')
      }, 750)
      changeMode() // this is what actually does the plotting
    })

  // set the intital chart name
  updateChartName()

  // render all tooltips
  $('[data-toggle="tooltip"]').tooltip()

  // after visualizing and plotting the main method, transform secondary methods
  if (selectedMethods.length > 1) {
    for (let selectedMethod of selectedMethods.slice(1)) {
      axios.all(parsed.map(x => transform(x.name, x.seq, selectedMethod)))
        .then(function (results) {
          for (result of results) {
            // determine the name associated with the hash
            resultName = _.invertBy(seqs, (x) => {
              return [x.hash]
            })[result.data[0]][0]

            // store the downsampled shape
            seqs[resultName]['overviewData'][selectedMethod] = result.data[1]
          }
        })
    }
  }
}

// reset the chart back to its original zoom
function resetChart (preserveX = false) {
  for (let i = 0; i < chart.series.length; i++) {
    let name = chart.series[i].userOptions.name
    try {
      if (preserveX) {
        console.log('preserving x range')
        if (!afterSetExtremes({min: chart.xAxis[0].min, max: chart.xAxis[0].max})) {
          chart.series[i].setData(seqs[name].overviewData[method].slice())
        }
        chart.yAxis[0].setExtremes(null, null)
      } else {
        chart.series[i].setData(seqs[name].overviewData[method].slice())
        // let highcharts recalculate the axis ranges
        chart.zoom()
      }
    } catch (e) {
    }
  }

  // sets the chart name when changing viz methods
  updateChartName()

  // re call this method since the axes may have changed
  updateAxes()
}

function updateAxes () {
  // set the axis labels to reflect the viz method
  chart.xAxis[0].setTitle({
    text: axis_labels[method]['x']
  })
  chart.yAxis[0].setTitle({
    text: axis_labels[method]['y']
  })

  if (method == 'randic') {
    chart.yAxis[0].setCategories(['A', 'T', 'G', 'C'])
    chart.yAxis[0].options.tickInterval = 1
  } else if (method == 'qi') {
    chart.yAxis[0].setCategories(['AG', 'GA', 'CT', 'TC', 'AC', 'CA', 'GT', 'TG', 'AT', 'TA', 'CG', 'GC', 'AA', 'CC', 'GG', 'TT'])
    chart.yAxis[0].options.tickInterval = 1
  } else {
    chart.yAxis[0].setCategories()
  }

  chart.redraw()
}

// updates the chart title and subtitle if user has not manually set
function updateChartName () {
  // decide on a name for the plot based on how many files there are
  if (user_title || user_subtitle) {
    return
  }
  let filenames = _.uniq(Object.values(seqs).map(x => x.filename))
  if (filenames.length != 1) {
    var title = `${methods[method]} DNA Visualization`
    var subtitle = null
  } else if (filenames.length == 1) {
    var title = filenames[0] != 'Pasted Sequence #1' ? `Visualization of ${filenames[0]}` : 'DNA Sequence Visualization'
    var subtitle = `Via the ${methods[method]} method`
  }

  // make the subtitle reflect the plotting method
  chart.setTitle({
    text: title
  }, {
    text: subtitle
  })
}

// for manually controlling the zoom
function zoom (factor) {
  xRange = chart.xAxis[0].getExtremes().max - chart.xAxis[0].getExtremes().min
  yRange = chart.yAxis[0].getExtremes().max - chart.yAxis[0].getExtremes().min
  chart.xAxis[0].setExtremes(chart.xAxis[0].getExtremes().min - (xRange * factor), chart.xAxis[0].getExtremes().max + (xRange * factor))
  chart.yAxis[0].setExtremes(chart.yAxis[0].getExtremes().min - (yRange * factor), chart.yAxis[0].getExtremes().max + (yRange * factor))
  default_zoom = false
}

function seqQuery (seq_hash, x_min = null, x_max = null) {
  return axios.get(route + '/seq_query', {
    params: {
      seq_hash: seq_hash,
      method: method,
      x_min: x_min,
      x_max: x_max
    }
  })
};

function transform (seq_name, seq, viz_method) {
  let bodyFormData = new FormData()
  bodyFormData.set('seq_name', seq_name)
  bodyFormData.set('seq', seq)
  bodyFormData.set('method', viz_method)
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

function afterSetExtremes (e) {
  // upon setting the x range of the graph, get the data for that region
  // returns true if successful in changing the data
  chart.showLoading('Loading data...')

  for (key of Object.keys(seqs)) {
    if (seqs[key].overviewData[method] == null) {
      continue
    }
    if ((e.max < seqs[key].overviewData[method][seqs[key].overviewData[method].length - 1][0]) &&
      (e.min > seqs[key].overviewData[method][0][0])) {
      console.log('executing seq query for ' + key)
      seqQuery(seqs[key]['hash'], e.min, e.max)
        .then(function (results) {
          chart.get(results.data[0]).setData(results.data[1].slice())
          default_zoom = false
          chart.hideLoading()
        })
    } else {
      chart.hideLoading()
      return false
    }
  }
  return true
}

function showTitleModal () {
  titleModal.modal('show')
  setTimeout(function () {
    $('.bootbox-cancel').click(function () {
      titleModal.modal('hide')
    })
    $('.bootbox-accept').click(function () {
      chart.setTitle({
        text: $('#title').val()
      }, {
        text: $('#subtitle').val()
      })
      titleModal.modal('hide')

      // ensure that updateChartName doesn't override the user title
      user_title = $('#title').val()
      user_subtitle = $('#subtitle').val()
    })
  }, 200)
}

function activateFileMode () {
  let state = []
  let filenames = _.keys(_.invertBy(seqs, seq => seq.filename))
  for (let i = 0; i < filenames.length; i++) {
    state.push({
      name: filenames[i],
      id: filenames[i],
      color: Highcharts.getOptions().colors[i % Highcharts.getOptions().colors.length],
      marker: {
        enabled: false
      }
    })
  }

  _.map(seqs, (v, k) => { // k = key, v = value
    state.push({
      name: k,
      id: v.hash,
      data: v.overviewData[method].slice(),
      marker: {
        enabled: false
      },
      linkedTo: v.filename,
      color: Highcharts.getOptions().colors[filenames.indexOf(v.filename) % Highcharts.getOptions().colors.length]
    })
  })

  updateChartFromArray(state)
}

function updateChartFromArray (seriesArray) {
  while (chart.series.length > 0) {
    chart.series[0].remove(false, false)
  };
  for (let seq of seriesArray) {
    chart.addSeries(seq, false)
  };
  chart.redraw()
}

function activateSequenceMode () {
  updateChartFromArray(
    _.map(seqs, (v, k) => { // k = key, v = value
      {
        return {
          name: k,
          id: v.hash,
          data: v.overviewData[method].slice(),
          marker: {
            enabled: false
          }
        }
      }
    })
  )
}

// decides whether file or sequence mode is warranted based on how many sequences there are
// todo: if all files are single seqs, plot sequence-wise
function chooseMode () {
  if (_.keys(seqs).length > Highcharts.getOptions().colors.length) {
    return 'file'
  } else {
    return 'sequence'
  }
}

function changeMode () {
  let chosenMode = mode

  if (chosenMode == 'auto') {
    chosenMode = chooseMode()
  };

  if (chosenMode == 'file') {
    activateFileMode()
  } else if (chosenMode == 'sequence') {
    activateSequenceMode()
  }
}

function resizeMethodBtnGroup () {
  var ww = document.body.clientWidth
  if (ww >= 374) {
    $('#method').removeClass('btn-group-sm')
  } else {
    $('#method').addClass('btn-group-sm')
  };
};

// returns an array of checked visualization methods
function getCheckedMethods () {
  let checkedMethods = []
  $('input[name=method]').each(function () {
    var $this = $(this)
    if ($this.is(':checked')) {
      checkedMethods.push($this.attr('id'))
    }
  })
  return checkedMethods
}

$(window).resize(function () {
  resizeMethodBtnGroup()
})

window.onload = function () {
  let options = {
    // CSS Class to add to the drop element when a drag is active
    readAsDefault: 'Text',

    on: {
      load: function (e, file) {
        // setTimeout(function () {
        //   dropModal.modal("hide");
        // }, 175);
        plotSequence(e.target.result, file.name)
      }
    }
  }

  // check that the File API is present. If not, display an alert to the user with a suggestion.
  if (!Modernizr.filereader) {
    bootbox.alert({
      title: 'Unsupported browser',
      message: `This browser is not supported due to the lack of support for the <a href=https://developer.mozilla.org/en-US/docs/Web/API/File"
          ">File API</a>. Please use IE 10+, Firefox 10+, Chrome 13+, Opera 12+, or Safari 12+ to use this site.`,
      backdrop: true,
      buttons: {
        ok: {
          className: 'btn-secondary'
        }
      }
    })
  }

  // support for drag-and-drop, copy-pasting, and a file upload button
  FileReaderJS.setupClipboard(document.body, options)
  FileReaderJS.setupInput(document.getElementById('file-input'), options)
  FileReaderJS.setupDrop(document.getElementById('dropzone'), options)
  FileReaderJS.setupDrop(document.body, options)

  // bind the viz method button to the method lable
  $('input[name=method]').change(function () {
    selectedMethods = getCheckedMethods()

    method = selectedMethods[0]
    method_name = methods[method]

    // only show the viz control panel if it will do something
    if (selectedMethods.length == 1) {
      $('#plotting_method_col').hide()
      return
    } else {
      $('#plotting_method_col').show()
    }

    // hide all currently rendered viz control buttons
    for (let key of Object.keys(methods)) {
      $(`#${key}_plotting_control_label`).hide()
    }

    // remove any edges on the viz method control panel
    for (let selectedMethod of selectedMethods) {
      $(`#${selectedMethod}_plotting_control_label`).removeClass('rounded-left rounded-right')
    }

    // render the viz method control panel
    $(`#${selectedMethods[0]}_plotting_control_label`).addClass('rounded-left')
    $(`#${selectedMethods[selectedMethods.length - 1]}_plotting_control_label`).addClass('rounded-right')
    for (let selectedMethod of selectedMethods) {
      $(`#${selectedMethod}_plotting_control_label`).show()
    }

    // set the viz control button to match the current active method
    $(`#${method}_plotting_control_label`).addClass('active')
  })

  // bind the viz control panel to the chart
  $('input[name=plotting_method]').change(function () {
    for (let selectedMethod of selectedMethods) {
      $(`#${selectedMethod}_plotting_control_label`).removeClass('active')
    }
    method = $('input[name=plotting_method]:checked').val()
    resetChart(!default_zoom)
  })

  // once the user has clicked a control, hide the tooltip
  $('#controls').click(function () {
    $('[data-toggle="tooltip"]').tooltip('hide')
  })

  $('#paste-sequence').click(function () {
    pastedFASTACount += 1
    bootbox.prompt({
      title: 'Paste a FASTA-formatted sequence',
      inputType: 'textarea',
      backdrop: true,
      callback: function (result) {
        if (!result) {
          return
        }
        plotSequence(result, `Pasted Sequence #${pastedFASTACount}`)
      },
      size: 'large',
      buttons: {
        cancel: {
          className: 'btn-outline-secondary'
        },
        confirm: {
          className: 'btn-secondary'
        }
      }
    })
  })

  // make the demo button show HBB
  $('#load-example').click(function () {
    plotSequence(hbb, 'hbb.fasta')
  })

  // Show modal when dragging
  // new Dragster(document.body);
  // document.addEventListener("dragster:enter", function (e) {
  //   dropModal.modal("show");
  // }, false);
  // document.addEventListener("dragster:leave", function (e) {
  //   dropModal.modal("hide");
  // }, false);

  // render all tooltips
  $('[data-toggle="tooltip"]').tooltip()

  // support for exporting
  $('#png').click(function () {
    chart.exportChart({
      type: 'image/png'
    })
  })
  $('#jpeg').click(function () {
    chart.exportChart({
      type: 'image/jpeg'
    })
  })
  $('#svg').click(function () {
    chart.exportChart({
      type: 'image/svg+xml'
    })
  })
  $('#pdf').click(function () {
    chart.exportChart({
      type: 'application/pdf'
    })
  })

  // control the remove sequence button
  $('#remove').click(function () {
    let filenames = _.uniq(Object.values(seqs).map(x => x.filename)).sort()
    filenames = filenames.map(function (filename) {
      return {
        text: `<span class="text-monospace">${filename}</span>`,
        value: filename
      }
    })
    bootbox.prompt({
      title: 'Remove FASTA files',
      inputType: 'checkbox',
      inputOptions: filenames,
      callback: function (result) {
        if (!result) {
          this.modal('hide')
          return
        }

        // remove from the graph
        let seqHashesToRemove = Object.values(seqs).filter(x => result.includes(x.filename)).map(x => x.hash)
        for (seqHash of seqHashesToRemove) {
          chart.get(seqHash).remove()
        }
        // remove from the seqs object
        let seqNamesToRemove = Object.entries(seqs).filter(x => result.includes(x[1].filename)).map(x => x[0])
        for (seqName of seqNamesToRemove) {
          delete seqs[seqName]
        }

        // reset the vie
        if (!Object.entries(seqs).length) {
          $('.hide-when-plotting').show()
          $('.show-when-plotting').hide()
        }
      },
      buttons: {
        confirm: {
          className: 'btn-secondary'
        },
        cancel: {
          className: 'btn-outline-secondary'
        }
      },
      backdrop: true,
      closeButton: true
    })
  })

  // bind the mode button to the mode variable
  $('input[name=mode]').change(function () {
    mode = $(this).attr('id')
    changeMode()
  })

  // Ensure that the method button group fits on the page (fix for small screens):
  resizeMethodBtnGroup()

  // warn before leaving
  // window.onbeforeunload = function (event) {
  //   if (document.getElementById("hg-container").style.display == "block") {
  //     return "Are you sure you want to leave the page? Your visualization will be lost.";
  //   } else {
  //     return "";
  //   }
  // };
}
