import Vue from "vue"
import * as dnaviz from "dnaviz"
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
  insertTransformedSequence(state, { description, method, visualization }) {
    Vue.set(state.sequences[description].visualization, [method], visualization)
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

/**
 * Downsample the array to hold 1,000 points
 */
function downsample(transformed) {
  const downsampleFactor = transformed[0].length / 1000
  const overview = [new Array(1000), new Array(1000)]
  for (let index = 0; index < 1000; index++) {
    overview[0][index] = transformed[0][Math.floor(index * downsampleFactor)]
    overview[1][index] = transformed[1][Math.floor(index * downsampleFactor)]
  }
  return overview
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
    commit("insertTransformedSequence", {
      description,
      method: state.currentMethod,
      visualization: dnaviz[state.currentMethod](sequence),
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
          visualization[0].slice(xMin * 2, xMax * 2 + 1),
          visualization[1].slice(xMin * 2, xMax * 2 + 1),
        ]
      }
      // These are a one-to-one mapping from bp to coordinate
      else if (["yau_bp", "qi", "randic"].includes(state.currentMethod)) {
        inRange = [
          visualization[0].slice(xMin, xMax + 1),
          visualization[1].slice(xMin, xMax + 1),
        ]
      }
      // For these, the x-range does tell you how many points to expect
      else {
        inRange = [[], []]
        for (let index = 0; index < visualization[0].length; index++) {
          if (
            xMin < visualization[0][index] &&
            visualization[0][index] < xMax
          ) {
            inRange[0].push(visualization[0][index])
            inRange[1].push(visualization[1][index])
          }

          // For Gates, we don't even know if that's the last x coord to expect
          if (visualization[0][index] > xMax && state.currentMethod === "yau") {
            break
          }
        }
      }
      visualization = inRange
    }

    // If there are still too many data points, downsample
    const overview =
      visualization[0].length < 1000 || state.currentMethod === "gates"
        ? visualization
        : downsample(visualization)

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
