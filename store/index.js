import Vue from "vue"
import * as dnaviz from "dnaviz"
export const state = () => ({
  sequences: {},
  currentMethod: "squiggle",
})

export const mutations = {
  insertTransformedSequence(
    state,
    { description, sequence, method, visualization }
  ) {
    Vue.set(state.sequences, description, {
      sequence,
      visualization: { [method]: visualization },
    })
  },
  setCurrentMethod(state, method) {
    state.currentMethod = method
  },
  /** Overwrite the entire `sequences` object in `state` */
  setSequences(state, sequences) {
    Vue.set(state, "sequences", sequences)
  },
}

export const actions = {
  /** Transform a sequence using the current visualization method and save it */
  // TODO: add a check to prevent duplicate transformation
  transformSequence({ commit, state }, { description, sequence }) {
    commit("insertTransformedSequence", {
      description,
      sequence,
      method: state.currentMethod,
      visualization: dnaviz[state.currentMethod](sequence),
    })
  },
  /** Resets the state of the application to default */
  clearState({ commit }) {
    commit("setSequences", {})
  },
}
