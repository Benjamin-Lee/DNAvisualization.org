import SessionWorker from "../assets/js/dnaviz.worker.js"

export default (context, inject) => {
  inject("worker", {
    createWorker() {
      return new SessionWorker()
    },
  })
}
