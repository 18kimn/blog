/* really no idea what to call this file... */

export function last(arr: any[]) {
  return arr[arr.length - 1]
}

export function delay(ms: number) {
  return new Promise<void>((resolve) =>
    setTimeout(() => resolve(), ms),
  )
}
