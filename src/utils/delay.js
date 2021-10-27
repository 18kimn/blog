const delay = (time) => {
  return () => new Promise((res) => setTimeout(() => res(), time))
}

const debounce = (callback, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => callback(...args), delay)
  }
}

export {delay, debounce}
