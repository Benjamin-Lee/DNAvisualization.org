/* eslint-disable */
import Vuex from "vuex"
import { downsample } from "./helpers"
function getOverview(arr) {
  if (arr.length <= 10000) {
    return arr
  } else {
    return downsample(arr, 10000)
  }
}

import SessionWorker from "./session.worker.js"
let worker = new SessionWorker()
let _this
worker.onmessage = (e) => {
  let result = getOverview(e.data.result)
  console.log(_this)
  _this.commit(
    "insertTransformedSequence",
    {
      description: e.data.description,
      method: e.data.method,
      arr: result,
    },
    { root: true }
  )
  _this.dispatch("computeOverview", { description: e.data.description }, { root: true })

}



export const actions = {
  transform({ commit, dispatch, rootState }, { description }) {
    // perform the transformation
    // const result = dnaviz[rootState.currentMethod](
    //   rootState.sequences[description].sequence
    // )
    // post seq and method to worker
    _this = this
    console.log("posting message")
    worker.postMessage({
      method: rootState.currentMethod,
      sequence: rootState.sequences[description].sequence,
      description,
      useWasm: true,
    })

  }
}
  // waits for worker to post back
  // const promise1 = new Promise((resolve, reject) => {
  //   worker.addEventListener("message", (e) => {
  //     console.log("It worked somehow??")
  //     resolve(e.data.result)
  //   })
  // })
  // promise1.then((resObj) => {
  //   let result = getOverview(resObj.result)
  //   commit(
  //     "insertTransformedSequence",
  //     {
  //       description,
  //       method: rootState.currentMethod,
  //       arr: result,
  //     },
  //     { root: true }
  //   )
  // })


