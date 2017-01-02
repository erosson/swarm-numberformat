// Can't comment a .json file, but the suffixes come from these pages:
// http://home.kpn.nl/vanadovv/BignumbyN.html
import standardSuffixes from './standard-suffixes.json'
import longScaleSuffixes from './longscale-suffixes.json'
// TODO: use this page to generate names dynamically, for even larger numbers:
//   http://mathforum.org/library/drmath/view/59154.html
// TODO: decimal.js support
// TODO: rounding control

function validate(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
  return condition
}

const backends = {
  'native': {
    // Suffixes are a list - which index of the list do we want? 
    // _index(999) === 0
    // _index(1000) === 1
    // _index(1000000) === 2
    index(val) {
      // string length is faster but fails for length >= 20, where JS starts
      // formatting with e
      return Math.max(0, Math.floor(Math.log10(Math.abs(val))/3))
    },
    prefix(val, sigfigs, index) {
      return (val / Math.pow(1000, index)).toPrecision(sigfigs)
    },
  },
  'decimal.js': {
    index(val) {
      // we assume the *exponent* is small enough to be a native js number
      return Math.max(0, val.abs().logarithm(10).dividedBy(3).floor().toNumber())
    },
    prefix(val, sigfigs, index) {
      var div = new val.constructor(1000).pow(index)
      return val.dividedBy(div).toPrecision(sigfigs)
    },
  },
}

// The formatting function.
function _format(val, opts) {
  const backend = validate(backends[opts.backend], `not a backend: ${opts.backend}`)
  const index = backend.index(val)
  const suffix = opts.suffixFn(index)
  // opts.minSuffix: Use JS native formatting for smallish numbers, because
  // '99,999' is prettier than '99.9k'
  // it's safe to let Math coerce Decimal.js to infinity here, gt/lt still work
  if (Math.abs(val) < opts.minSuffix) {
    // decimal.js minSuffix/minRound aren't supported, we must be native to get here
    if (Math.abs(val) >= opts.minRound) {
      val = Math.floor(val)
    }
    return val.toLocaleString(undefined, {maximumSignificantDigits: opts.sigfigs})
  }
  // No suffix found: use scientific notation. JS's native toExponential is fine.
  if (!suffix && suffix !== '') {
    return val.toExponential(opts.sigfigs-1).replace('e+', 'e')
  }
  // Found a suffix. Calculate the prefix, the number before the suffix.
  const prefix = backend.prefix(val, opts.sigfigs, index)
  return `${prefix}${suffix}`
}

export const defaultOptions = {
  backend: 'native',
  // Flavor is a shortcut to modify any number of other options, like sigfigs.
  // It's much more commonly used by callers than suffixGroup, which only controls
  // suffixes. The two share the same possible names by default.
  flavor: 'full',
  suffixGroup: 'full',
  suffixFn(index) {
    var suffixes = this.suffixes || this.suffixGroups[this.suffixGroup]
    validate(suffixes, `no such suffixgroup: ${this.suffixGroup}`)
    if (index < suffixes.length) {
      return suffixes[index] || ''
    }
    // return undefined
  },
  // minimum value to use any suffix, because '99,900' is prettier than '99.9k'
  minSuffix: 1e5,
  // Show decimals below this value rounded to opts.sigfigs, instead of floor()ed
  minRound: 0,
  sigfigs: 3, // often overridden by flavor
  format: 'standard'
}
// User-visible format choices, like on swarmsim's options screen. 
// Each has a different set of options.
const Formats = {
  standard: {suffixGroups: standardSuffixes},
  // like standard formatting, with a different set of suffixes
  longScale: {suffixGroups: longScaleSuffixes},
  // like standard formatting, with no suffixes at all
  scientific: {suffixGroups: {full: [], short: []}},
  // like standard formatting, with a smaller set of suffixes
  hybrid: {
    suffixGroups: {
      full: standardSuffixes.full.slice(0, 12),
      short: standardSuffixes.short.slice(0, 12),
    },
  },
  // like standard formatting, with a different/infinite set of suffixes
  engineering: {suffixFn: index => index === 0 ? '' : `E${index*3}`},
}
// A convenient way for the developer to modify formatters.
// These are different from formats - not user-visible.
const Flavors = {
  full: {suffixGroup: 'full', sigfigs: 5},
  short: {suffixGroup: 'short', sigfigs: 3},
}
// Allow callers to extend formats and flavors.
defaultOptions.formats = Formats
defaultOptions.flavors = Flavors

export class Formatter {
  constructor(opts = {}) {
    this.opts = opts
  }
  
  _normalizeOpts(opts={}) {
    // all the user-specified opts, no defaults
    opts = Object.assign({}, this.opts, opts)
    // opts.format redefines some other opts, but should never override the user's opts
    var format = opts && opts.format
    var formats = (opts && opts.formats) || defaultOptions.formats
    var formatOptions = formats[format || defaultOptions.format]
    validate(formatOptions, `no such format: ${format}`)
    var flavor = opts && opts.flavor
    var flavors = (opts && opts.flavors) || defaultOptions.flavors
    var flavorOptions = flavors[flavor || defaultOptions.flavor]
    validate(flavorOptions, `no such flavor: ${flavor}`)
    // finally, add the implied options: defaults and format-derived
    return Object.assign({}, defaultOptions, formatOptions, flavorOptions, opts)
  }
  index(val, opts) {
    opts = this._normalizeOpts(opts)
    return backends[opts.backend].index(val)
  }
  suffix(val, opts) {
    opts = this._normalizeOpts(opts)
    var index = backends[opts.backend].index(val)
    return opts.suffixFn(index)
  }
  format(val, opts) {
    opts = this._normalizeOpts(opts)
    return _format(val, opts)
  }
  // Use this in your options UI
  listFormats(opts) {
    opts = this._normalizeOpts(opts)
    return Object.keys(opts.formats)
  }
}

const numberformat = new Formatter()
numberformat.defaultOptions = defaultOptions
numberformat.Formatter = Formatter
export default numberformat

// this is just to make the browser api nicer
export const format = (val, opts) => numberformat.format(val, opts)

