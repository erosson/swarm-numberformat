import standard from '../static/standard-suffixes.json'
import longScale from '../static/long-scale-suffixes.json'
import {requireDecimal} from './decimal.js'

//const suffixGroups = {standard, longScale}
const suffixGroups = {standard} // TODO longscale parsing. There's a duplicate
const suffixGroupsToExp = {}
for (let groupName of Object.keys(suffixGroups)) {
  const group = suffixGroups[groupName]
  const suffixToExp = suffixGroupsToExp[groupName] = {}
  for (let fkey of Object.keys(group)) {
    const fg = group[fkey]
    for (let index in fg) {
      const suffix = fg[index].toLowerCase()
      const exp = index * 3
      if(suffixToExp[suffix] && suffixToExp[suffix].exp === exp,
        "duplicate parsenumber suffix with different exponents: "+suffix)
      suffixToExp[suffix] = {index, exp, replace:'e'+exp}
    }
  }
}

const backends = {
  'native': {
    parseInt(text, config) {
      const val = Math.ceil(Number(text, 10))
      return 'default' in config && !this.isValid(val) ? config['default'] : val
    },
    isValid(val) {
      return (val || val === 0) && !Number.isNaN(val)
    },
  },
  'decimal.js': {
    parseInt(text, config) {
      if ('default' in config) {
        try {
          const val = requireDecimal(config)(text).ceil()
          return this.isValid(val) ? val : config['default']
        }
        catch(e) {
          return config.default
        }
      }
      return requireDecimal(config)(text).ceil()
    },
    isValid(val) {
      return val && !val.isNaN()
    },
  },
}

export function parse(text, config={}) {
  if (!text) return config['default'] || null
  // TODO make this an option
  const suffixToExp = suffixGroupsToExp[config.suffixGroup || 'standard']
  const backend = backends[config.backend || 'native']
  if (!backend) throw new Error('no such backend: '+config.backend)
  // remove commas. TODO: i18n fail
  text=text.replace(/,/g, '')
  // replace suffixes ('billion', etc)
  const match=/ ?[a-zA-Z]+/.exec(text)
  if (match && match.length > 0) {
    const exp = suffixToExp[match[0].toLowerCase()]
    if (exp) {
      // ceil(): buy at least this many. The default of floor() is annoying when
      // we're trying to purchase exactly-n for an upgrade.
      return backend.parseInt(text.replace(match[0], exp.replace), config)
    }
  }
  // no/invalid suffix found
  // note that we also get here for a suffix of 'e', like '1e3', because it's not
  // used as a suffix. Decimal.js will parse it.
  return backend.parseInt(text, config)
}

export class Parser {
  constructor(config) {
    this.config = config
  }
  parse(text, config={}) {
    return parse(text, {...this.config, ...config})
  }
}
