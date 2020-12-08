// The minimal Plotly distribution, remapped when importing by Webpack
// See: https://github.com/plotly/plotly.js/tree/master/dist
const Plotly = require("plotly.js/lib/core")

// Only load the scatterplot
Plotly.register([require("plotly.js/lib/scatter")])

module.exports = Plotly
