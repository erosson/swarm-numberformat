function log(...mess) {
  //console.log(...mess)
}
// Lazy-load - we might not need decimal. It's a peerDependency, so the parent
// library must include it if needed - we don't, because many callers don't need
// it.
let Decimal
export function requireDecimal() {
  return Decimal || (Decimal = (function() {
    if (global && global.Decimal) {
      log('swarm-numberformat decimal.js: Found global.Decimal')
      return global.Decimal
    }
    if (global && global.window && window.Decimal) {
      log('swarm-numberformat decimal.js: Found window.Decimal')
      return window.Decimal
    }
    log('swarm-numberformat decimal.js: trying require()')
    return require('decimal.js')
  })())
}
