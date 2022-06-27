
/**
 * 
 * @param {{ [key: string]: false|string }} validation 
 */
export const isError = (validation) => {
  for (const key in validation) {
    if (validation[key]) {
      return true
    }
  }

  return false
}

/**
 * @param {string} str
 */
export const isUrl = (url) => {
  return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(url)
}
