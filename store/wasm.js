// const MAX_MEMORY_BITS = 1 * 10 ** 8 * 2 * 64 + 1 * 10 ** 8 * 16 // determined by 100M base sequence working with 2 f64s per base

export const state = () => ({
  // bitsStored: 0,
})

export const mutations = {
  saveFunctions(state, { wasm }) {
    for (const key in wasm) {
      state[key] = wasm[key]
    }
  },
  // incBits(state, { bits }) {
  //   state.bitsStored += bits
  // },
  // decBits(state, { bits }) {
  //   state.bitsStored -= bits
  // },
}

export const actions = {
  instantiate({ commit, dispatch }) {
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
        __getInt32Array,
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
      wasm.yau_int = function yauInt(seq, xMin, xMax) {
        console.log(
          __getInt32Array(response.exports.x_yau_int(1000, xMin, xMax))
        )
        const inStrPtr = __retain(__newString(seq))

        console.log(
          __getInt32Array(
            response.exports.y_yau_int(
              inStrPtr,
              seq.length,
              1000,
              xMin,
              xMax,
              0,
              0
            )
          )
        )
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
      wasm.getFloat64Array = __getFloat64Array
      wasm.release = __release
      commit("saveFunctions", { wasm })
    })
  },
  moveFromLinearMemory({ rootState, commit }, { description, method }) {
    const ptrs = rootState.sequences[description].visualization[method]
    const arr = [
      rootState.wasm.getFloat64Array(ptrs.xPtr),
      rootState.wasm.getFloat64Array(ptrs.yPtr),
    ]
    commit(
      "insertTransformedSequence",
      { description, method, arr },
      { root: true }
    )
    rootState.wasm.release(ptrs.xPtr)
    rootState.wasm.release(ptrs.yPtr)
  },
  // collect({ rootState, commit, dispatch }, { bitsNeeded }) {
  //   let bitsFreed = 0

  //   // first, try to remove all of the visualizations for methods not in use
  //   for (const description in rootState.sequences) {
  //     for (const method in rootState.sequences[description].visualization) {
  //       if (method !== rootState.currentMethod) {
  //         console.log("evicting", description, method)
  //         dispatch("moveFromLinearMemory", { description, method })

  //         bitsFreed += rootState.sequences[description].sequence.length * 2 * 64
  //         if (bitsFreed >= bitsNeeded) {
  //           return
  //         }
  //       }
  //     }
  //   }
  // },
  transform({ commit, dispatch, rootState, state }, { description, sequence }) {
    // if (
    //   state.bitsStored + 2 * sequence.length * 64 + sequence.length * 16 >
    //   MAX_MEMORY_BITS
    // ) {
    //   console.log("collecting")
    //   dispatch("collect", {
    //     bitsNeeded: 2 * sequence.length * 64 + sequence.length * 16,
    //   })
    // }
    // commit("incBits", { bits: 2 * sequence.length * 64 })
    const ptrs = state[rootState.currentMethod](sequence)
    commit(
      "insertTransformedSequence",
      {
        description,
        method: rootState.currentMethod,
        xPtr: ptrs[0],
        yPtr: ptrs[1],
      },
      { root: true }
    )
    // state.yau_int(sequence, 0, sequence.length)
  },
}
