class TaskQueue {
  constructor(delay) {
    this.delay = delay
    this.limit = 10
    this.paused = false

    this.queue = []
    this.timeout = null
    this.interval = setInterval(this.run.bind(this), 5000)
    this.immediate = null
  }

  enqueue(task) {
    if (this.queue.length < this.limit) {
      this.queue.push(task)
    }
  }

  unpause() {
    this.paused = false
  }

  run() {
    if (!this.paused && this.queue.length > 0) {
      this.paused = true
      this.timeout = setTimeout(this.unpause.bind(this), this.delay)
      this.immediate = setImmediate(this.queue.shift())
    }
  }
}

const singletonQueue = new TaskQueue(10 * 60 * 1000)

module.exports = singletonQueue
