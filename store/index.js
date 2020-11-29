import Vue from "vue"
import * as dnaviz from "dnaviz"
export const state = () => ({
  sequences: {},
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
}

export const actions = {
  // TODO: add a check to prevent duplicate transformation
  transformSequence({ commit }, { description, sequence, method }) {
    commit("insertTransformedSequence", {
      description,
      sequence,
      method,
      visualization: dnaviz[method](sequence),
    })
  },
}
