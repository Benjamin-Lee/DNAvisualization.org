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
  savewasm(state, { wasm }) {
    state.wasm = wasm
  },
}

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
    const ptrs = state.wasm[state.currentMethod](sequence)
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
          state.wasm.getOverview(visualization.xPtr, xMin, xMax, 2),
          state.wasm.getOverview(visualization.yPtr, xMin, xMax, 2),
        ]
      }
      // These are a one-to-one mapping from bp to coordinate
      else if (["yau_bp", "qi", "randic"].includes(state.currentMethod)) {
        inRange = [
          state.wasm.getOverview(visualization.xPtr, xMin, xMax, 1),
          state.wasm.getOverview(visualization.yPtr, xMin, xMax, 1),
        ]
      }
      visualization = inRange
    } else {
      visualization = [
        state.wasm.getOverview(visualization.xPtr),
        state.wasm.getOverview(visualization.yPtr),
      ]
    }
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
      const wasm = {}
      wasm.asYau = function asYau(seq) {
        const inStrPtr = __retain(__newString(seq))
        const outArrPtr = response.exports.yau(inStrPtr, seq.length)
        const resultArr = __getFloat64Array(outArrPtr)
        // __release(outArrPtr)
        __release(inStrPtr)
        return resultArr
      }
      wasm.qi = function asQi(seq) {
        const inStrPtr = __retain(__newString(seq))
        const xPtr = response.exports.x_qi(seq.length)
        const yPtr = response.exports.y_qi(inStrPtr, seq.length)
        __release(inStrPtr)
        return [xPtr, yPtr]
      }
      wasm.yau_bp = function asYauBp(seq) {
        const inStrPtr = __retain(__newString(seq))
        const xPtr = response.exports.x_yau_bp(seq.length)
        const yPtr = response.exports.y_yau_bp(inStrPtr, seq.length)
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
      wasm.downsample = function downsample(arrPtr) {
        const downsampledArrPtr = response.exports.downsample(arrPtr)
        const resultArr = __getFloat64Array(downsampledArrPtr)
        __release(downsampledArrPtr)
        return resultArr
      }
      wasm.getOverview = function getOverview(
        arrPtr,
        xMin,
        xMax,
        coordsPerBase
      ) {
        const overviewArrPtr =
          xMin !== undefined && xMax !== undefined
            ? response.exports.getOverviewInRange(
                arrPtr,
                xMin,
                xMax,
                coordsPerBase
              )
            : response.exports.getOverview(arrPtr)

        const resultArr = __getFloat64Array(overviewArrPtr)
        __release(overviewArrPtr)
        return resultArr
      }
      commit("savewasm", { wasm })
    })
  },
}
