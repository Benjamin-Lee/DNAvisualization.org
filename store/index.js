import Vue from "vue"
import * as dnaviz from "dnaviz"
import { downsample } from "./helpers"
export const state = () => ({
  sequences: {},
  currentMethod: "yau_int",
  legendMode: "sequence",
  useWasm: true,
})

export const mutations = {
  /**
   * Save a sequence and its description.
   * Note that the transformed visualization is *not* included.
   */
  insertSequence(state, { description, sequence, file }) {
    Vue.set(state.sequences, description, {
      sequence,
      file,
      visualization: {},
      overview: {},
    })
  },
  /**
   * Given a sequence already in `state`, save its transformed coordinates for the given method.
   */
  insertTransformedSequence(state, { description, method, xPtr, yPtr, arr }) {
    if (xPtr !== undefined && yPtr !== undefined) {
      state.sequences[description].visualization[method] = { xPtr, yPtr }
    } else if (arr !== undefined) {
      state.sequences[description].visualization[method] = arr
    } else {
      throw new Error("Didn't get ptrs or array")
    }
  },
  removeSequence(state, { description }) {
    Vue.delete(state.sequences, description)
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
  setSequences(state, { sequences }) {
    Vue.set(state, "sequences", sequences)
  },
  setLegendMode(state, mode) {
    state.legendMode = mode
  },
  disableWasm(state) {
    state.useWasm = false
  },
}

export const actions = {
  /**
   * Transform a sequence using the current visualization method and save it.
   * If the sequence already exists in `state` but does not have the current visualization
   * method's data, it will be modified. Otherwise, the sequence will be transformed and added.
   */
  // TODO: add a check to prevent duplicate transformation
  transformSequence(
    { commit, state, dispatch },
    { description, sequence, file }
  ) {
    // We need to check that
    sequence = sequence.toUpperCase()
    if (!Object.prototype.hasOwnProperty.call(state.sequences, description)) {
      commit("insertSequence", { description, sequence, file })
    }
    dispatch(
      state.useWasm && state.currentMethod !== "gates"
        ? "wasm/transform"
        : "dnaviz/transform",
      {
        description,
        sequence,
      }
    )
    dispatch("computeOverview", { description })
  },
  computeOverview({ commit, state }, { description, xMin, xMax }) {
    let visualization =
      state.sequences[description].visualization[state.currentMethod]

    // We're zooming in
    if (xMin !== undefined && xMax !== undefined) {
      // first, we need to find how many points we've already saved in the range
      let inRange = [[], []]
      for (let i = 0; i < visualization[0].length; i++) {
        if (xMin < visualization[0][i] && visualization[0][i] < xMax) {
          inRange[0].push(visualization[0][i])
          inRange[1].push(visualization[1][i])
        } else if (visualization[0][i] > xMax) {
          break
        }
      }

      // if we have more than 1k points, we're good to downsample
      // if not, we need to compute points in the x range
      if (inRange[0].length < 1000) {
        // get the subsequence in the range
        const seqInRange = state.sequences[description].sequence.slice(
          Math.floor(xMin),
          Math.floor(xMax)
        )
        // transform it
        // TODO: downsample to 10k before reading
        if (state.useWasm && state.currentMethod !== "gates") {
          const ptrs = state.wasm[state.currentMethod](seqInRange)
          if (state.currentMethod === "yau_int") {
            inRange[0] = state.wasm.getInt32Array(ptrs[0])
            inRange[1] = state.wasm.getInt32Array(ptrs[1])
          } else {
            inRange[0] = state.wasm.getFloat64Array(ptrs[0])
            inRange[1] = state.wasm.getFloat64Array(ptrs[1])
          }
          // don't forget to free memory!
          ptrs.forEach((ptr) => state.wasm.release(ptr))
        } else {
          inRange = dnaviz[state.currentMethod](seqInRange)
        }

        // fix the x offset
        for (let i = 0; i < inRange[0].length; i++) {
          inRange[0][i] += Math.floor(xMin)
        }
      }
      visualization = inRange
    }
    // if we have too many points, downsample
    const overview =
      visualization[0].length > 1000
        ? downsample(visualization, 1000)
        : visualization

    commit("updateOverview", {
      description,
      method: state.currentMethod,
      overview,
    })
  },
  /** Resets the state of the application to default */
  clearState({ commit }) {
    commit("setSequences", { sequences: {} })
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
  /** On page load, set up WASM */
  nuxtClientInit({ dispatch, commit }) {
    const supported = (() => {
      try {
        if (
          typeof WebAssembly === "object" &&
          typeof WebAssembly.instantiate === "function"
        ) {
          const module = new WebAssembly.Module(
            // eslint-disable-next-line
            Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
          )
          if (module instanceof WebAssembly.Module)
            return (
              new WebAssembly.Instance(module) instanceof WebAssembly.Instance
            )
        }
      } catch (e) {}
      return false
    })()
    if (supported) {
      dispatch("wasm/instantiate")
    } else {
      commit("disableWasm")
    }
  },
}
