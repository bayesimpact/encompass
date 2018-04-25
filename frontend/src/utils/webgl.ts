/**
 * Return true if we can get a webgl context, or false otherwise.
 */
export function isWebGLEnabled() {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  return !!(gl && gl instanceof WebGLRenderingContext)
}
