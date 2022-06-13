export const toObject = <T = any>(cols: T[], keys: string[]) => {
  return keys.reduce((acc, curr, index) => {
    acc[curr] = cols[index]
    return acc
  }, {} as Record<string, T>)
}

export const defaultsOptions = { blankrows: false, header: 1, skipHidden: true }
