/* really no idea what to call this file... */

export function last(arr: any[]) {
  return arr[arr.length - 1]
}

export function delay(ms: number) {
  return new Promise<void>((resolve) =>
    setTimeout(() => resolve(), ms),
  )
}

export function isCurrent(route: string, pathname: string) {
  const target = `/${route}`
  if (route === '') return pathname === '/'
  return (
    pathname === target || pathname.startsWith(`${target}/`)
  )
}
