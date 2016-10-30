import suffixes from './suffixes.json'
import _ from 'lodash'

function _index(val) {
  // http://stackoverflow.com/a/23416775/2782048
  // oops, fails for e >= 20
  //return Math.floor(((''+val).length-1) / 3)
  return Math.max(0, Math.floor(Math.log10(val)/3))
}
function _suffix(val, suffixes) {
  return suffixes[_index(val)]
}

// All format choices, like on swarmsim's options screen. 
const Formats = {
  standard(val, opts) {
    const index = _index(val)
    if (val < opts.minSuffix) {
      return Math.floor(val).toLocaleString()
    }
    const suffix = opts.suffixFn(index)
    if (!suffix && suffix !== '') {
      return val.toExponential(opts.sigfigs-1).replace('e+', 'e')
    }
    const prefix = (val / Math.pow(1000, index)).toPrecision(opts.sigfigs)
    return `${prefix}${suffix}`
  },
  hybrid(val, opts) {
    opts.suffixes = opts.suffixes.slice(0, 12)
    return this.standard(val, opts)
  },
  scientific(val, opts) {
    opts.suffixes = []
    return this.standard(val, opts)
  },
  engineering(val, opts) {
    opts.suffixFn = function(index) {
      if (index > 0) {
        return `E${index*3}`
      }
      return ''
    }
    return this.standard(val, opts)
  },
}

const defaultOptions = {
  // TODO short suffixes
  suffixes: suffixes.long,
  suffixFn(index) {
    if (index <= this.suffixes.length) {
      return this.suffixes[index] || ''
    }
    // return undefined
  },
  // minimum value to use any suffix, because '99,900' is prettier than '99.9k'
  minSuffix: 1e5,
  sigfigs: 3,
  format: 'standard'
}
export class Formatter {
  constructor(opts = {}) {
    this.opts = Object.assign({}, defaultOptions, opts)
  }
  
  format(val, opts) {
    opts = opts ? _.defaults({}, opts, this.opts) : this.opts
    return Formats[opts.format](val, opts);
  }
}

const numberformat = new Formatter()
numberformat.Formatter = Formatter
export default numberformat;
