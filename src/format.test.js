import numberformat from './format'
import Decimal from 'decimal.js'
import LDecimal from 'decimal.js-light'
import BDecimal from 'break_infinity.js'

describe('numberformat', () => {
  it('builds formatters', () => {
    expect(new numberformat.Formatter({format: 'hybrid'}).opts.format).toBe('hybrid')
  }),
  it('formats numbers', () => {
    const formatter = numberformat
    expect(formatter.format(1)).not.toBe(1)
    expect(formatter.format(1)).toBe('1')
    //expect(formatter.format(8/9)).toBe('0.889')
    //expect(formatter.format(1e3)).toBe('1 thousand')
    expect(formatter.format(1e3)).toBe('1,000')
    expect(formatter.format(1e6)).toBe('1.0000 million')
    expect(formatter.format(1.1111e6)).toBe('1.1111 million')
    expect(formatter.format(1.1111e9)).toBe('1.1111 billion')
    expect(formatter.format(1.1111e12)).toBe('1.1111 trillion')
    expect(formatter.format(1e21)).toBe('1.0000 sextillion')
    expect(formatter.format(1e36)).toBe('1.0000 undecillion')
  })
  it('formats long-scale numbers', () => {
    const formatter = new numberformat.Formatter({format: 'longScale'})
    expect(formatter.format(1)).not.toBe(1)
    expect(formatter.format(1)).toBe('1')
    //expect(formatter.format(8/9)).toBe('0.889')
    //expect(formatter.format(1e3)).toBe('1 thousand')
    expect(formatter.format(1e3)).toBe('1,000')
    expect(formatter.format(1e6)).toBe('1.0000 million')
    expect(formatter.format(1.1111e6)).toBe('1.1111 million')
    expect(formatter.format(1.1111e9)).toBe('1.1111 milliard')
    expect(formatter.format(1.1111e12)).toBe('1.1111 billion')
    expect(formatter.format(1e21)).toBe('1.0000 trilliard')
    expect(formatter.format(1e36)).toBe('1.0000 sextillion')
  })
  it('formats hybrid', () => {
    const formatter = new numberformat.Formatter({format: 'hybrid'})
    expect(formatter.format(1)).not.toBe(1)
    expect(formatter.format(1)).toBe('1')
    //expect(formatter.format(8/9)).toBe('0.889')
    //expect(formatter.format(1e3)).toBe('1 thousand')
    expect(formatter.format(1e3)).toBe('1,000')
    expect(formatter.format(1e6)).toBe('1.0000 million')
    expect(formatter.format(1.1111e6)).toBe('1.1111 million')
    expect(formatter.format(1e36)).toBe('1.0000e36')
  })
  it('formats scientificE', () => {
    const formatter = new numberformat.Formatter({format: 'scientific'})
    expect(formatter.format(1)).not.toBe(1)
    expect(formatter.format(1)).toBe('1')
    //expect(formatter.format(8/9)).toBe('0.889')
    //expect(formatter.format(1e3)).toBe('1e3')
    expect(formatter.format(1e3)).toBe('1,000')
    expect(formatter.format(1e6)).toBe('1.0000e6')
    expect(formatter.format(1.1111e6)).toBe('1.1111e6')
    expect(formatter.format(1e36)).toBe('1.0000e36')
  })
  it('formats engineering', () => {
    const formatter = new numberformat.Formatter({format: 'engineering'})
    expect(formatter.format(1)).not.toBe(1)
    expect(formatter.format(1)).toBe('1')
    //expect(formatter.format(8/9)).toBe('0.889')
    //expect(formatter.format(1e3)).toBe('1E3')
    expect(formatter.format(1e3)).toBe('1,000')
    expect(formatter.format(1e6)).toBe('1.0000E6')
    expect(formatter.format(1.1111e6)).toBe('1.1111E6')
    expect(formatter.format(1e7)).toBe('10.000E6')
    expect(formatter.format(1.1111e7)).toBe('11.111E6')
    expect(formatter.format(1e8)).toBe('100.00E6')
  })
  it('formats short numbers', () => {
    const formatter = new numberformat.Formatter({flavor: 'short'})
    expect(formatter.format(1)).not.toBe(1)
    expect(formatter.format(1)).toBe('1')
    expect(formatter.format(1e3)).toBe('1,000')
    expect(formatter.format(1e6)).toBe('1.00M')
    expect(formatter.format(100e3)).toBe('100K')
    expect(formatter.format(1e9)).toBe('1.00B')
    expect(formatter.format(1.1111e6)).toBe('1.11M')
    expect(formatter.format(1.1111e6, {format: 'engineering'})).toBe('1.11E6')
  })
  it('supports `opts` as a second argument', () => {
    const formatter = numberformat
    expect(formatter.format(1, {flavor: 'short'})).toBe('1')
    expect(formatter.format(1e3, {flavor: 'short'})).toBe('1,000')
    expect(formatter.format(1e6, {flavor: 'short'})).toBe('1.00M')
    expect(formatter.format(100e3, {flavor: 'short'})).toBe('100K')
    expect(formatter.format(1e9, {flavor: 'short'})).toBe('1.00B')
    expect(formatter.format(1.1111e6, {flavor: 'short'})).toBe('1.11M')
  })
  it('handles bogus formats', () => {
    const formatter = numberformat
    expect(() => formatter.format(1, {format: 'bogus'})).toThrow()
    expect(() => formatter.format(1, {format: 'standard'})).not.toThrow()
    expect(() => formatter.format(1, {format: null})).not.toThrow()
  })
  it('supports suffix-only', () => {
    const formatter = numberformat
    expect(formatter.suffix(1e6, {format: 'standard'})).toBe(' million')
    expect(formatter.suffix(1e6, {format: 'standard', flavor: 'short'})).toBe('M')
    expect(formatter.suffix(1e6, {format: 'engineering'})).toBe('E6')
  })
  it('supports negatives', () => {
    const formatter = numberformat
    expect(formatter.format(0)).toBe('0')
    expect(formatter.format(-1)).toBe('-1')
    expect(formatter.format(-1e3)).toBe('-1,000')
    expect(formatter.format(-1e6)).toBe('-1.0000 million')
    expect(formatter.format(-1e21)).toBe('-1.0000 sextillion')
  })
  it('supports small decimals', () => {
    const formatter = numberformat
    expect(formatter.format(8/9)).toBe('0')
    expect(formatter.format(8/9, {maxSmall: 1})).toBe('0.88889')
    expect(formatter.format(-8/9, {maxSmall: 1})).toBe('-0.88889')
    expect(formatter.format(8/9, {sigfigs: 3, maxSmall: 1})).toBe('0.889')
    expect(formatter.format(8/9, {sigfigs: 1, maxSmall: 1})).toBe('0.9')
    expect(formatter.format(8/9, {flavor: 'short', maxSmall: 1})).toBe('0.889')
    // zero-sigfigs after the decimal point are truncated
    expect(formatter.format(0.1, {maxSmall: 1, sigfigs:9})).toBe('0.1')
    expect(formatter.format(0.11, {maxSmall: 1, sigfigs:9})).toBe('0.11')
    expect(formatter.format(0.111, {maxSmall: 1, sigfigs:9})).toBe('0.111')
    expect(formatter.format(0.101, {maxSmall: 1, sigfigs:9})).toBe('0.101')
  })

  it('formats bigger numbers', () => {
    const formatter = numberformat
    expect(formatter.format(1e18)).toBe('1.0000 quintillion')
    expect(formatter.format(1e18, {flavor: 'short'})).toBe('1.00Qi')
    // 1e20 is an important breakpoint: JS's native number formatting changes
    // from '123,456' to '1.23e21'
    expect(formatter.format(1e21)).toBe('1.0000 sextillion')
    expect(formatter.format(1e21, {flavor: 'short'})).toBe('1.00Sx')
  })
  it('supports decimal.js', () => {
    const formatter = new numberformat.Formatter({backend: 'decimal.js'})
    //console.log(new Decimal('1e999').toString())
    expect(formatter.format('1e9999', {format: 'engineering'})).toBe('1.0000E9999')
    expect(formatter.format(new Decimal('1e9999'), {format: 'engineering'})).toBe('1.0000E9999')
    expect(formatter.format(new Decimal('1e9999'))).toBe('1.0000e9999')
    expect(formatter.format(new Decimal('1'))).toBe('1')
    expect(formatter.format(new Decimal('1e3'))).toBe('1,000')
    expect(formatter.format(new Decimal('1e6'))).toBe('1.0000 million')
    expect(formatter.format(new Decimal('1.1111e6'))).toBe('1.1111 million')
    expect(formatter.format(new Decimal('1.1111e9'))).toBe('1.1111 billion')
    expect(formatter.format(new Decimal('1.1111e12'))).toBe('1.1111 trillion')
    expect(formatter.format(new Decimal('1e21'))).toBe('1.0000 sextillion')
    expect(formatter.format(new Decimal('1e36'))).toBe('1.0000 undecillion')
  })
  it('supports decimal.js-light', () => {
    const Decimal = LDecimal
    const formatter = new numberformat.Formatter({backend: 'decimal.js', Decimal})
    expect(formatter.format('1e9999', {format: 'engineering'})).toBe('1.0000E9999')
    expect(formatter.format(new Decimal('1e9999'), {format: 'engineering'})).toBe('1.0000E9999')
    expect(formatter.format(new Decimal('1e9999'))).toBe('1.0000e9999')
    expect(formatter.format(new Decimal('1'))).toBe('1')
    expect(formatter.format(new Decimal('1e3'))).toBe('1,000')
    expect(formatter.format(new Decimal('1e6'))).toBe('1.0000 million')
    expect(formatter.format(new Decimal('1.1111e6'))).toBe('1.1111 million')
    expect(formatter.format(new Decimal('1.1111e9'))).toBe('1.1111 billion')
    expect(formatter.format(new Decimal('1.1111e12'))).toBe('1.1111 trillion')
    expect(formatter.format(new Decimal('1e21'))).toBe('1.0000 sextillion')
    expect(formatter.format(new Decimal('1e36'))).toBe('1.0000 undecillion')
  })
  it('supports break_infinity.js', () => {
    const Decimal = BDecimal
    const formatter = new numberformat.Formatter({backend: 'decimal.js', Decimal})
    expect(formatter.format('1e9999', {format: 'engineering'})).toBe('1.0000E9999')
    expect(formatter.format(new Decimal('1e9999'), {format: 'engineering'})).toBe('1.0000E9999')
    expect(formatter.format(new Decimal('1e9999'))).toBe('1.0000e9999')
    expect(formatter.format(new Decimal('1'))).toBe('1')
    expect(formatter.format(new Decimal('1e3'))).toBe('1,000')
    expect(formatter.format(new Decimal('1e6'))).toBe('1.0000 million')
    expect(formatter.format(new Decimal('1.1111e6'))).toBe('1.1111 million')
    expect(formatter.format(new Decimal('1.1111e9'))).toBe('1.1111 billion')
    expect(formatter.format(new Decimal('1.1111e12'))).toBe('1.1111 trillion')
    expect(formatter.format(new Decimal('1e21'))).toBe('1.0000 sextillion')
    expect(formatter.format(new Decimal('1e36'))).toBe('1.0000 undecillion')
  })
  it('has shortcuts for each flavor', () => {
    const formatter = numberformat
    expect(!!formatter.formatFull).toBe(true)
    expect(!!formatter.formatShort).toBe(true)
    expect(formatter.formatFull(1e6)).toBe('1.0000 million')
    expect(formatter.formatShort(1e6)).toBe('1.00M')
  })
  it('doesn\'t round smallish numbers by default, #13', () => {
    const f = numberformat
    expect(f.format(12345)).toBe('12,345')
    expect(f.formatShort(12345)).toBe('12,345')
  })
  it('doesn\'t display double suffixes: native, #20', () => {
    const f = numberformat
    expect(f.format(1e9-1)).toBe('999.99 million')
    expect(f.formatShort(1e9-1)).toBe('999M')
    expect(f.format(1e6-1)).toBe('999.99 thousand')
    expect(f.formatShort(1e6-1)).toBe('999K')
  })
  it('doesn\'t display double suffixes: decimal.js, #20', () => {
    const f = new numberformat.Formatter({backend: 'decimal.js'})
    expect(f.format(1e9-1)).toBe('999.99 million')
    expect(f.formatShort(1e9-1)).toBe('999M')
    expect(f.format(1e6-1)).toBe('999.99 thousand')
    expect(f.formatShort(1e6-1)).toBe('999K')
  })
  for (let config0 of [
    {backend: 'native'},
    {backend: 'decimal.js'},
    {name: 'decimal.js-light', backend: 'decimal.js', Decimal: LDecimal},
    //{name: 'break_infinity.js', backend: 'decimal.js', Decimal: BDecimal},
  ]) {
    let {name, ...config} = config0
    name = name || config.backend
    const f = new numberformat.Formatter(config)
    it('supports undefined sigfigs, #15: standard, '+name, () => {
      expect(f.format(1.00e9, {format: 'standard', sigfigs: undefined})).toBe('1 billion')
      expect(f.format(1.23e9, {format: 'standard', sigfigs: undefined})).toBe('1.23 billion')
    })
    it('supports undefined sigfigs, #15: hybrid, '+name, () => {
      expect(f.format(1.00e9, {format: 'hybrid', sigfigs: undefined})).toBe('1 billion')
      expect(f.format(1.23e9, {format: 'hybrid', sigfigs: undefined})).toBe('1.23 billion')
    })
    it('supports undefined sigfigs, #15: scientific, '+name, () => {
      expect(f.format(1.00e9, {format: 'scientific', sigfigs: undefined})).toBe('1e9')
      expect(f.format(1.23e9, {format: 'scientific', sigfigs: undefined})).toBe('1.23e9')
    })
    it('supports undefined sigfigs, #15: engineering, '+name, () => {
      expect(f.format(1.00e9, {format: 'engineering', sigfigs: undefined})).toBe('1E9')
      expect(f.format(1.23e9, {format: 'engineering', sigfigs: undefined})).toBe('1.23E9')
    })
    it('supports undefined sigfigs, #15: longScale, '+name, () => {
      expect(f.format(1.00e9, {format: 'longScale', sigfigs: undefined})).toBe('1 milliard')
      expect(f.format(1.23e9, {format: 'longScale', sigfigs: undefined})).toBe('1.23 milliard')
    })
    it('supports undefined sigfigs, #15: standard/short, '+name, () => {
      expect(f.format(1.00e9, {format: 'standard', sigfigs: undefined, flavor: 'short'})).toBe('1B')
      expect(f.format(1.23e9, {format: 'standard', sigfigs: undefined, flavor: 'short'})).toBe('1.23B')
    })
    it('supports undefined sigfigs, #15: standard/null, '+name, () => {
      expect(f.format(1.00e9, {format: 'standard', sigfigs: null})).toBe('1 billion')
      expect(f.format(1.23e9, {format: 'standard', sigfigs: null})).toBe('1.23 billion')
    })
    it('supports undefined sigfigs, #15: standard/0, '+name, () => {
      expect(f.format(1.00e9, {format: 'standard', sigfigs: 0})).toBe('1 billion')
      expect(f.format(1.23e9, {format: 'standard', sigfigs: 0})).toBe('1.23 billion')
    })
  }
});
