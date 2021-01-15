/* eslint-disable*/ 
importScripts("https://unpkg.com/dnaviz/dist/dnaviz.min.js") 
// self.importScripts()


self.onmessage = (e) => {
  const sequence = e.data.sequence
  const method = e.data.method
  const result = dnaviz[method](sequence)
  postMessage({result, method, description: e.data.description})
}
