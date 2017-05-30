// Lazy-load - we might not need decimal. It's a peerDependency, so the parent
// library must include it if needed - we don't, because many callers don't need
// it.
let Decimal
export function requireDecimal(config) {
  return (config && config.Decimal) || Decimal || (Decimal = (function() {
    // Allow node callers to inject their own decimal.js, because I am sick to
    // death of trying to wrangle require/webpack/import/etc.
    if (global && global.Decimal) {
      return global.Decimal
    }
    // `nwb.config.js: extenals` ensures this points to window.Decimal for umd (`<script src="...">`) builds
    return require('decimal.js')
  })())
}
