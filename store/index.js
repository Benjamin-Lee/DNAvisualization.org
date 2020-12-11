import Vue from "vue"
// import * as dnaviz from "dnaviz"

export const state = () => ({
  sequences: {},
  currentMethod: "squiggle",
})

export const mutations = {
  /**
   * Save a sequence and its description.
   * Note that the transformed visualization is *not* included.
   */
  insertSequence(state, { description, sequence }) {
    Vue.set(state.sequences, description, {
      sequence,
      visualization: {},
      overview: {},
    })
  },
  /**
   * Given a sequence already in `state`, save its transformed coordinates for the given method.
   */
  insertTransformedSequence(state, { description, method, xPtr, yPtr }) {
    Vue.set(state.sequences[description].visualization, [method], {
      xPtr,
      yPtr,
    })
  },
  updateOverview(state, { description, method, overview }) {
    Vue.set(state.sequences[description].overview, [method], overview)
  },
  setCurrentMethod(state, { method }) {
    state.currentMethod = method
  },
  /**
   * Overwrite the entire `sequences` object in `state`
   */
  setSequences(state, sequences) {
    Vue.set(state, "sequences", sequences)
  },
  saveFunctions(state, { functions }) {
    state.functions = functions
  },
}

/**
 * Downsample the array to hold 1,000 points
 */
// function downsample(transformed) {
//   const downsampleFactor = transformed[0].length / 1000
//   const overview = [new Array(1000), new Array(1000)]
//   for (let index = 0; index < 1000; index++) {
//     overview[0][index] = transformed[0][Math.floor(index * downsampleFactor)]
//     overview[1][index] = transformed[1][Math.floor(index * downsampleFactor)]
//   }
//   console.log(overview)
//   return overview
// }

export const actions = {
  /**
   * Transform a sequence using the current visualization method and save it.
   * If the sequence already exists in `state` but does not have the current visualization
   * method's data, it will be modified. Otherwise, the sequence will be transformed and added.
   */
  // TODO: add a check to prevent duplicate transformation
  transformSequence({ commit, state, dispatch }, { description, sequence }) {
    // We need to check that
    if (!Object.prototype.hasOwnProperty.call(state.sequences, description)) {
      commit("insertSequence", { description, sequence })
    }
    // console.log("transformed with wasm", state.functions.asSquiggle(sequence))
    const ptrs = state.functions[state.currentMethod](sequence)
    commit("insertTransformedSequence", {
      description,
      method: state.currentMethod,
      xPtr: ptrs[0],
      yPtr: ptrs[1],
    })
    dispatch("computeOverview", { description })
  },
  computeOverview({ commit, state }, { description, xMin, xMax }) {
    let visualization =
      state.sequences[description].visualization[state.currentMethod]
    // In this case, we're trying to compute the overview of the sequence in a given range
    if (xMin !== undefined && xMax !== undefined) {
      let inRange

      // squiggle uses two points per base pair
      if (state.currentMethod === "squiggle") {
        inRange = [
          state.functions.getOverview(visualization.xPtr, xMin, xMax, 2),
          state.functions.getOverview(visualization.yPtr, xMin, xMax, 2),
        ]
      }
      // These are a one-to-one mapping from bp to coordinate
      else if (["yau_bp", "qi", "randic"].includes(state.currentMethod)) {
        inRange = [
          state.functions.getOverview(visualization.xPtr, xMin, xMax, 1),
          state.functions.getOverview(visualization.yPtr, xMin, xMax, 1),
        ]
      }
      // For these, the x-range does tell you how many points to expect
      // else {
      //   inRange = [[], []]
      //   for (let index = 0; index < visualization[0].length; index++) {
      //     if (
      //       xMin < visualization[0][index] &&
      //       visualization[0][index] < xMax
      //     ) {
      //       inRange[0].push(visualization[0][index])
      //       inRange[1].push(visualization[1][index])
      //     }

      //     // For Gates, we don't even know if that's the last x coord to expect
      //     if (visualization[0][index] > xMax && state.currentMethod === "yau") {
      //       break
      //     }
      //   }
      // }
      visualization = inRange
    } else {
      // console.log(visualization[0])
      visualization = [
        state.functions.downsample(visualization.xPtr),
        state.functions.downsample(visualization.yPtr),
      ]
    }
    // If there are still too many data points, downsample
    // const overview =
    //   visualization[0].length < 1000 || state.currentMethod === "gates"
    //     ? visualization
    //     : downsample(visualization)

    commit("updateOverview", {
      description,
      method: state.currentMethod,
      overview: visualization,
    })
  },
  /** Resets the state of the application to default */
  clearState({ commit }) {
    commit("setSequences", {})
  },
  /**
   * Change the current visualization method.
   * If not a sequence doesn't have the current visualization method stored, it will be computed.
   */
  changeMethod({ commit, state, dispatch }, { method }) {
    commit("setCurrentMethod", { method })
    for (const description in state.sequences) {
      // check whether we need to transform the sequence
      if (
        !Object.prototype.hasOwnProperty.call(
          state.sequences[description].visualization,
          method
        )
      ) {
        dispatch("transformSequence", {
          description,
          sequence: state.sequences[description].sequence,
        })
      }
    }
  },
  initializeWasm({ commit }) {
    if (!process.browser) {
      return
    }
    const imports = {}

    const loader = require("@assemblyscript/loader")

    loader.instantiate(fetch("/optimized.wasm"), imports).then((response) => {
      const {
        __retain,
        __newString,
        __getFloat64Array,
        __release,
      } = response.exports
      const toSave = {}
      toSave.asYau = function asYau(seq) {
        const inStrPtr = __retain(__newString(seq))
        const outArrPtr = response.exports.yau(inStrPtr, seq.length)
        const resultArr = __getFloat64Array(outArrPtr)
        // __release(outArrPtr)
        __release(inStrPtr)
        return resultArr
      }

      toSave.qi = function asQi(seq) {
        const inStrPtr = __retain(__newString(seq))
        const xPtr = response.exports.x_qi(seq.length)
        const yPtr = response.exports.y_qi(inStrPtr, seq.length)
        // const x = __getFloat64Array(xPtr)
        // const y = __getFloat64Array(yPtr)
        // console.log(y);
        // __release(xPtr)
        // __release(yPtr)
        __release(inStrPtr)
        return [xPtr, yPtr]
      }

      toSave.yau_bp = function asYauBp(seq) {
        const inStrPtr = __retain(__newString(seq))
        const xPtr = response.exports.x_yau_bp(seq.length)
        const yPtr = response.exports.y_yau_bp(inStrPtr, seq.length)
        // const x = __getFloat64Array(xPtr)
        // const y = __getFloat64Array(yPtr)
        // __release(xPtr)
        // __release(yPtr)
        __release(inStrPtr)
        return [xPtr, yPtr]
      }

      toSave.randic = function asRandic(seq) {
        const inStrPtr = __retain(__newString(seq))
        const xPtr = response.exports.x_randic(seq.length)
        const yPtr = response.exports.y_randic(inStrPtr, seq.length)
        // const x = __getFloat64Array(xPtr)
        // const y = __getFloat64Array(yPtr)
        // __release(xPtr)
        // __release(yPtr)
        __release(inStrPtr)
        return [xPtr, yPtr]
      }

      toSave.squiggle = function asSquiggle(seq) {
        const inStrPtr = __retain(__newString(seq))
        const xPtr = response.exports.x_squiggle(seq.length)
        const yPtr = response.exports.y_squiggle(inStrPtr, seq.length)
        // const x = __getFloat64Array(xPtr)
        // const y = __getFloat64Array(yPtr)
        // __release(xPtr)
        // __release(yPtr)
        __release(inStrPtr)
        return [xPtr, yPtr]
      }

      // toSave.asSquiggle = function asSquiggle(seq) {
      //   const inStrPtr = __retain(__newString(seq))
      //   const outArrPtr = response.exports.squiggle(inStrPtr, seq.length)
      //   const resultArr = __getFloat64Array(outArrPtr)
      //   __release(outArrPtr)
      //   __release(inStrPtr)
      //   return resultArr
      // }

      // toSave.asGates = function asGates(seq) {
      //   const inStrPtr = __retain(__newString(seq))
      //   const outArrPtr = response.exports.gates(inStrPtr, seq.length)
      //   const resultArr = __getFloat64Array(outArrPtr)
      //   __release(outArrPtr)
      //   __release(inStrPtr)
      //   return resultArr
      // }

      toSave.downsample = function downsample(arrPtr) {
        console.log(arrPtr, __getFloat64Array(arrPtr))
        const downsampledArrPtr = response.exports.downsample(arrPtr)
        const resultArr = __getFloat64Array(downsampledArrPtr)
        __release(downsampledArrPtr)
        return resultArr
      }

      toSave.getOverview = function getOverview(
        arrPtr,
        xMin,
        xMax,
        coordsPerBase
      ) {
        const overviewArrPtr = response.exports.getOverview(
          arrPtr,
          Math.floor(xMin),
          Math.floor(xMax),
          coordsPerBase
        )
        const resultArr = __getFloat64Array(overviewArrPtr)
        __release(overviewArrPtr)
        return resultArr
      }
      commit("saveFunctions", { functions: toSave })
    })
  },
  testWasm({ state }, { sequence }) {
    // const res = state.functions.yau_bp(sequence)
    // console.log(state.functions.getOverview(res[0], 1000, 3000, 1))
  },
}
