/**
 * Downsample a pair of arrays to hold n points
 */
export function downsample(transformed, nPoints) {
  const downsampleFactor = transformed[0].length / nPoints
  const overview = [new Array(nPoints), new Array(nPoints)]
  for (let index = 0; index < nPoints; index++) {
    overview[0][index] = transformed[0][Math.floor(index * downsampleFactor)]
    overview[1][index] = transformed[1][Math.floor(index * downsampleFactor)]
  }
  return overview
}
