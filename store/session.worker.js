/* eslint-disable*/
importScripts("https://unpkg.com/dnaviz/dist/dnaviz.min.js")
let wasmExports = {}

function initWasm() {
  importScripts("https://unpkg.com/@assemblyscript/loader@0.17.13/umd/index.js")
  request = new XMLHttpRequest();
  request.open('GET', "/wasm/optimized.wasm", false);
  request.responseType = 'arraybuffer';
  request.send(null);
  console.log(request.response)

  response = loader.instantiateSync(request.response, {})
  const {
    __retain,
    __newString,
    __getFloat64Array,
    __getInt32Array,
    __release,
  } = response.exports
  const wasm = {}
  wasm.qi = function asQi(seq) {
    const inStrPtr = __retain(__newString(seq))
    const xPtr = response.exports.x_qi(seq.length)
    const yPtr = response.exports.y_qi(inStrPtr, seq.length)
    __release(inStrPtr)
    return [xPtr, yPtr]
  }
  wasm.randic = function asRandic(seq) {
    const inStrPtr = __retain(__newString(seq))
    const xPtr = response.exports.x_randic(seq.length)
    const yPtr = response.exports.y_randic(inStrPtr, seq.length)
    __release(inStrPtr)
    return [xPtr, yPtr]
  }
  wasm.squiggle = function asSquiggle(seq) {
    const inStrPtr = __retain(__newString(seq))
    const xPtr = response.exports.x_squiggle(seq.length)
    const yPtr = response.exports.y_squiggle(inStrPtr, seq.length)
    __release(inStrPtr)
    return [xPtr, yPtr]
  }
  wasm.yau_int = function yauInt(seq, xMin, xMax) {
    const inStrPtr = __retain(__newString(seq))
    const xPtr = response.exports.x_yau_int(seq.length)
    const yPtr = response.exports.y_yau_int(inStrPtr, seq.length)
    __release(inStrPtr)
    return [xPtr, yPtr]
  }
  wasm.gc_content = function gcContent(seq, gap) {
    const inStrPtr = __retain(__newString(seq))
    const xPtr = response.exports.x_gc_content(seq.length, gap)
    const yPtr = response.exports.y_gc_content(inStrPtr, seq.length, gap)
    __release(inStrPtr)
    return [xPtr, yPtr]
  }
  wasm.getOverview = function getOverview(arrPtr, xMin, xMax, method) {
    if (method === "yau_int") {
      const overviewArrPtr =
        xMin !== undefined && xMax !== undefined
          ? response.exports.getOverviewInRange_i32(
            arrPtr,
            xMin,
            xMax,
            method === "squiggle" ? 2 : 1
          )
          : response.exports.getOverview_i32(arrPtr)

      const resultArr = __getInt32Array(overviewArrPtr)
      __release(overviewArrPtr)
      return resultArr
    }
    const overviewArrPtr =
      xMin !== undefined && xMax !== undefined
        ? response.exports.getOverviewInRange(
          arrPtr,
          xMin,
          xMax,
          method === "squiggle" ? 2 : 1
        )
        : response.exports.getOverview(arrPtr)

    const resultArr = __getFloat64Array(overviewArrPtr)
    __release(overviewArrPtr)
    return resultArr
  }
  wasm.getFloat64Array = __getFloat64Array
  wasm.getInt32Array = __getInt32Array

  wasm.release = __release
  return wasm
}

self.onmessage = (e) => {

  // check if we're going to use wasm
  // if the command type == reinit, reinit
  // if not, and we haven't inited, init
  // transform
  // getOverview
  // return

  // otherwise, use dnaviz.js
  // return
  const sequence = e.data.sequence
  const method = e.data.method
  if (!e.data.useWasm) {
    console.log("using dnaviz.js")
    postMessage({ result: dnaviz[method](sequence), method, description: e.data.description })
    return
  }
  if (e.data.reinitWasm === true || (Object.keys(wasmExports).length === 0 && wasmExports.constructor === Object)) {
    console.log("initing wasm")
    wasmExports = initWasm()
  }

  console.log(wasmExports)

  console.log("transforming using wasm")
  // perform the transformation
  const ptrs = wasmExports[method](sequence)
  // // get a 10k element overview of the sequence

  const result = [
    wasmExports.getOverview(ptrs[0], undefined, undefined, method),
    wasmExports.getOverview(ptrs[1], undefined, undefined, method),
  ]
  // const result = dnaviz[method](sequence)
  ptrs.forEach((ptr) => wasmExports.release(ptr))
  postMessage({ result, method, description: e.data.description })
}