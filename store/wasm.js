export const state = () => ({})

export const mutations = {
  saveFunctions(state, { wasm }) {
    for (const key in wasm) {
      state[key] = wasm[key]
    }
  },
}

export const actions = {
  instantiate({ commit }) {
    if (!process.browser) {
      return
    }
    const imports = {}

    const loader = require("@assemblyscript/loader")

    loader
      .instantiate(fetch("/wasm/optimized.wasm"), imports)
      .then((response) => {
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
        commit("saveFunctions", { wasm })
      })
  },
  transform({ commit, dispatch, rootState, state }, { description }) {
    // perform the transformation
    const ptrs = state[rootState.currentMethod](
      rootState.sequences[description].sequence
    )
    // get a 10k element overview of the sequence
    const downsampled = [
      state.getOverview(ptrs[0], undefined, undefined, rootState.currentMethod),
      state.getOverview(ptrs[1], undefined, undefined, rootState.currentMethod),
    ]
    ptrs.forEach((ptr) => state.release(ptr))
    commit(
      "insertTransformedSequence",
      {
        description,
        method: rootState.currentMethod,
        arr: downsampled,
      },
      { root: true }
    )
  },
}
