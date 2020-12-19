// squiggle nested array return
export function x_squiggle(length: i32): Float64Array {
  let x_vals = new Float64Array(2 * length + 1)
  let xCoord: f64 = 0

  for (let i = 1; i <= 2 * length; i++) {
    unchecked((x_vals[i] = xCoord + 0.5))
    xCoord += 0.5
  }

  return x_vals
}

export function y_squiggle(sequence: string, length: i32): Float64Array {
  sequence = sequence.toUpperCase()

  let y_vals = new Float64Array(2 * length + 1)

  for (let i = 0; i < 2 * length; i += 2) {
    switch (sequence.charCodeAt(i >>> 1)) {
      case 0x41: // "A"
        unchecked((y_vals[i + 1] = y_vals[i] + 0.5))
        unchecked((y_vals[i + 2] = y_vals[i]))
        break
      case 0x43: // "C"
        unchecked((y_vals[i + 1] = y_vals[i] - 0.5))
        unchecked((y_vals[i + 2] = y_vals[i]))
        break
      case 0x54:
      case 0x55: // "T" && "U"
        unchecked((y_vals[i + 1] = y_vals[i] - 0.5))
        unchecked((y_vals[i + 2] = y_vals[i] - 1))
        break
      case 0x47: // "G"
        unchecked((y_vals[i + 1] = y_vals[i] + 0.5))
        unchecked((y_vals[i + 2] = y_vals[i] + 1))
        break
      default:
        unchecked((y_vals[i + 1] = y_vals[i]))
        unchecked((y_vals[i + 2] = y_vals[i]))
        break
    }
  }

  return y_vals
}

// gates single array return
export function gates(sequence: string, length: i32): Float64Array {
  sequence = sequence.toUpperCase()

  let result = new Float64Array(2 * length + 2)

  let xCoord: f64 = 0.0
  let yCoord: f64 = 0.0

  for (let i = 0; i < length; i++) {
    switch (sequence.charCodeAt(i)) {
      case 0x41: // "A"
        yCoord--
        break
      case 0x43: // "C"
        xCoord--
        break
      case 0x54:
      case 0x55: // "T" && "U"
        yCoord++
        break
      case 0x47: // "G"
        xCoord++
        break
      default:
        throw new Error("non-atgcu base")
        break
    }

    unchecked((result[i + 1] = xCoord))
    unchecked((result[length + i + 2] = yCoord))
  }

  return result
}

export let key = new Map<string, i32>()
key.set("AA", 12)
key.set("AC", 4)
key.set("GT", 6)
key.set("AG", 0)
key.set("CC", 13)
key.set("CA", 5)
key.set("CG", 10)
key.set("TT", 15)
key.set("GG", 14)
key.set("GC", 11)
key.set("AT", 8)
key.set("GA", 1)
key.set("TG", 7)
key.set("TA", 9)
key.set("TC", 3)
key.set("CT", 2)
//qi nested array return
export function y_qi(sequence: string, length: i32): Float64Array {
  sequence = sequence.toUpperCase()

  const result = new Float64Array(length - 1)

  for (let i = 0; i < length - 1; i++) {
    let Ch_1 = sequence.charCodeAt(i + 0)
    let Ch_2 = sequence.charCodeAt(i + 1)
    switch (Ch_1) {
      case 0x41:
        switch (Ch_2) {
          case 0x41: // AA
            unchecked((result[i] = 12))
            break
          case 0x43: // AC
            unchecked((result[i] = 4))
            break
          case 0x54: // AT
          case 0x55: // AU
            unchecked((result[i] = 8))
            break
          case 0x47: // AG
            unchecked((result[i] = 0))
        }
        break
      case 0x43:
        switch (Ch_2) {
          case 0x41: // CA
            unchecked((result[i] = 5))
            break
          case 0x43: // CC
            unchecked((result[i] = 13))
            break
          case 0x54: // CT
          case 0x55: // CU
            unchecked((result[i] = 2))
            break
          case 0x47: // CG
            unchecked((result[i] = 10))
        }
        break
      case 0x54:
      case 0x55:
        switch (Ch_2) {
          case 0x41: // TA, UA
            unchecked((result[i] = 9))
            break
          case 0x43: // TC, UC
            unchecked((result[i] = 3))
            break
          case 0x54: // TT
          case 0x55: // UU
            unchecked((result[i] = 15))
            break
          case 0x47: // TG, UG
            unchecked((result[i] = 7))
        }
        break
      case 0x47:
        switch (Ch_2) {
          case 0x41: // GA
            unchecked((result[i] = 1))
            break
          case 0x43: // GC
            unchecked((result[i] = 11))
            break
          case 0x54: // GT
          case 0x55: // GU
            unchecked((result[i] = 6))
            break
          case 0x47: // GG
            unchecked((result[i] = 14))
        }
    }
  }

  return result
}

export function x_qi(length: i32): Float64Array {
  let x_vals = new Float64Array(length - 1)
  let xCoord: f64 = 0

  for (let i = 0; i < length - 1; i++) {
    unchecked((x_vals[i] = xCoord))
    xCoord += 1.0
  }

  return x_vals
}

// randic nested array return
export function y_randic(sequence: string, length: i32): Float64Array {
  sequence = sequence.toUpperCase()

  let y_vals = new Float64Array(length)

  for (let i = 0; i < length; i++) {
    switch (sequence.charCodeAt(i)) {
      case 0x41: // "A"
        unchecked((y_vals[i] = 3))
        break
      case 0x43: // "C"
        unchecked((y_vals[i] = 0))
        break
      case 0x54:
      case 0x55: // "T" && "U"
        unchecked((y_vals[i] = 2))
        break
      case 0x47: // "G"
        unchecked((y_vals[i] = 1))
        break
      default:
        throw new Error("non-atgcu base")
        break
    }
  }

  return y_vals
}

export function x_randic(length: i32): Float64Array {
  let x_vals = new Float64Array(length)
  let xCoord: f64 = 0

  for (let i = 0; i < length; i++) {
    unchecked((x_vals[i] = xCoord))
    xCoord++
  }

  return x_vals
}

export function x_yau_int(length: i32): Int32Array {
  let x_vals = new Int32Array(length + 1)
  let xCoord: i32 = 0

  for (let i = 0; i < length + 1; i++) {
    unchecked((x_vals[i] = xCoord))
    xCoord++
  }

  return x_vals
}

export function y_yau_int(sequence: string, length: i32): Int32Array {
  const result = new Int32Array(length + 1)
  let runningValue = 0

  for (let i = 0; i < length; i++) {
    switch (sequence.charCodeAt(i)) {
      case 0x41: // "A"
        runningValue -= 2
        break
      case 0x43: // "C"
        runningValue += 1
        break
      case 0x54:
      case 0x55: // "T" && "U"
        runningValue += 2
        break
      case 0x47: // "G"
        runningValue -= 1
        break
    }
    unchecked((result[i + 1] = runningValue))
  }
  return result
}

// //calculates the compositional difference between right and left segments
// export function compositionalDifference(sequence: string, start: i32, end: i32, segPoint: i32) {
//   // weight coefficients
//   const w1 = Math.floor(segPoint / end)
//   const w2 = Math.floor((end - segPoint) / end)
//   let al = 0
//   let tl = 0
//   let gl = 0
//   let cl = 0
//   let ar = 0
//   let tr = 0
//   let gr = 0
//   let cr = 0

//   for (let i = start; i < segPoint; i++) {
//     switch (sequence.charCodeAt(i)) {
//       case 0x41: // "A"
//         al++
//         break
//       case 0x43: // "C"
//         runningValue += 1
//         break
//       case 0x54:
//       case 0x55: // "T" && "U"
//         runningValue += 2
//         break
//       case 0x47: // "G"
//         runningValue -= 1
//         break
//     }
//     unchecked((result[i + 1] = runningValue))
//   }

// }
// export function gc_segments(length: i32) {
//   let start = 0
//   let end = length
//   let iter = 5
//   let phi = 0.618

// }

export function x_gc_content(length: i32, gap: i32): Int32Array {
  gap = 100
  const result = new Int32Array(i32((length / gap) + 1))
  for (let i = 1; i <= i32(length / gap); i++) {
    unchecked(result[i] = i * gap)
  }
  return result
}

//? maybe use regex
export function y_gc_content(sequence: String, length: i32, gap: i32): Float64Array {
  gap = 100
  const result = new Float64Array(i32((length / gap) + 1))
  let gc_count = 0;
  for (let i = 0; i < i32(length / gap); i++) {
    for (let j = i * gap; j < (i + 1) * gap; j++) {
      switch (sequence.charCodeAt(i)) {
        case 0x43: // "C"
        case 0x47: // "G"
          gc_count = 0;
          break
      }
      unchecked(result[i + 1] = (gc_count / gap))
      gc_count  = 0
    }
  }
  return result
}

export function downsample(
  transformed: Float64Array,
  nPoints: i32
): Float64Array {
  const downsampleFactor = f64(transformed.length) / f64(nPoints)
  const overview = new Float64Array(nPoints)
  for (let index = 0; index < nPoints; index++) {
    unchecked(
      (overview[index] =
        transformed[i32(Math.floor(f64(index) * downsampleFactor))])
    )
  }
  return overview
}
export function downsample_i32(
  transformed: Int32Array,
  nPoints: i32
): Int32Array {
  const downsampleFactor = f64(transformed.length) / f64(nPoints)
  const overview = new Int32Array(nPoints)
  for (let index = 0; index < nPoints; index++) {
    unchecked(
      (overview[index] =
        transformed[i32(Math.floor(f64(index) * downsampleFactor))])
    )
  }
  return overview
}

/** Compute an overview of an array.
 *
 * @param transformed The array to get an overview of
 * @param xMin The low end of the x-range
 * @param xMax The high end of the x-range
 * @param coordsPerBase How many coordinates each base of the sequence is represented by
 */
export function getOverviewInRange(
  transformed: Float64Array,
  xMin: f64,
  xMax: f64,
  coordsPerBase: i32
): Float64Array {
  // Slice the array to only contain the x-coordinates of interest
  const sliced = transformed.subarray(
    i32(xMin) * coordsPerBase,
    i32(xMax) * coordsPerBase + 1
  )

  // Return a new array containing just the sliced region
  if (sliced.length <= 1000) {
    let x = new Float64Array(sliced.length)
    for (let i = 0; i < sliced.length; i++) {
      unchecked((x[i] = sliced[i]))
    }
    return x
  } else {
    // Otherwise, if the range is too big, we have to downsample
    return downsample(sliced, 1000)
  }
}
export function getOverviewInRange_i32(
  transformed: Int32Array,
  xMin: f64,
  xMax: f64,
  coordsPerBase: i32
): Int32Array {
  // Slice the array to only contain the x-coordinates of interest
  const sliced = transformed.subarray(
    i32(xMin) * coordsPerBase,
    i32(xMax) * coordsPerBase + 1
  )

  // Return a new array containing just the sliced region
  if (sliced.length <= 1000) {
    let x = new Int32Array(sliced.length)
    for (let i = 0; i < sliced.length; i++) {
      unchecked((x[i] = sliced[i]))
    }
    return x
  } else {
    // Otherwise, if the range is too big, we have to downsample
    return downsample_i32(sliced, 1000)
  }
}

/**
 * The same as getOverviewInRange but insensitive to
 */
export function getOverview(transformed: Float64Array): Float64Array {
  if (transformed.length <= 10000) {
    return transformed
  } else {
    return downsample(transformed, 10000)
  }
}
export function getOverview_i32(transformed: Int32Array): Int32Array {
  if (transformed.length <= 10000) {
    return transformed
  } else {
    return downsample_i32(transformed, 10000)
  }
}
