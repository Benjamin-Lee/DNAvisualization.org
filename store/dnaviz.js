import * as dnaviz from "dnaviz"
import { downsample } from "./helpers"
function getOverview(arr) {
  if (arr.length <= 10000) {
    return arr
  } else {
    return downsample(arr, 10000)
  }
}

export const actions = {
  transform({ commit, dispatch, rootState }, { description }) {
    // perform the transformation
    let result = dnaviz[rootState.currentMethod](
      rootState.sequences[description].sequence
    )
    // get a 10k element overview of the sequence
    result = getOverview(result)
    commit(
      "insertTransformedSequence",
      {
        description,
        method: rootState.currentMethod,
        arr: result,
      },
      { root: true }
    )
  },
}
