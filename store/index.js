import Vue from "vue"
// import * as dnaviz from "dnaviz"

export const state = () => ({
  sequences: {},
  currentMethod: "yau_int",
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
  insertTransformedSequence(state, { description, method, xPtr, yPtr, arr }) {
    if (xPtr !== undefined && yPtr !== undefined) {
      state.sequences[description].visualization[method] = { xPtr, yPtr }
    } else if (arr !== undefined) {
      state.sequences[description].visualization[method] = arr
    } else {
      throw new Error("Didn't get ptrs or array")
    }
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
    sequence = sequence.toUpperCase()
    if (!Object.prototype.hasOwnProperty.call(state.sequences, description)) {
      commit("insertSequence", { description, sequence })
    }
    dispatch("wasm/transform", { description, sequence })
    dispatch("computeOverview", { description })
  },
  computeOverview({ commit, state }, { description, xMin, xMax }) {
    const visualization =
      state.sequences[description].visualization[state.currentMethod]
    const overview = [
      state.wasm.getOverview(
        visualization.xPtr,
        xMin,
        xMax,
        state.currentMethod === "squiggle" ? 2 : 1,
        state.currentMethod
      ),
      state.wasm.getOverview(
        visualization.yPtr,
        xMin,
        xMax,
        state.currentMethod === "squiggle" ? 2 : 1,
        state.currentMethod
      ),
    ]
    commit("updateOverview", {
      description,
      method: state.currentMethod,
      overview,
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
}
