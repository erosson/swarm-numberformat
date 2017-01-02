import numberformat from '../../src/main'

// TODO fill in all tests from swarm1
describe('numberformat', () => {
  it('builds formatters', () => {
    expect(new numberformat.Formatter({format: 'hybrid'}).opts.format).to.equal('hybrid')
  }),
  it('formats numbers', () => {
    const formatter = numberformat
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    //expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1 thousand')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.0000 million')
    expect(formatter.format(1.1111e6)).to.equal('1.1111 million')
    expect(formatter.format(1e21)).to.equal('1.0000 sextillion')
    expect(formatter.format(1e36)).to.equal('1.0000 undecillion')
  })
  it('formats hybrid', () => {
    const formatter = new numberformat.Formatter({format: 'hybrid'})
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    //expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1 thousand')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.0000 million')
    expect(formatter.format(1.1111e6)).to.equal('1.1111 million')
    expect(formatter.format(1e36)).to.equal('1.0000e36')
  })
  it('formats scientificE', () => {
    const formatter = new numberformat.Formatter({format: 'scientific'})
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    //expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1e3')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.0000e6')
    expect(formatter.format(1.1111e6)).to.equal('1.1111e6')
    expect(formatter.format(1e36)).to.equal('1.0000e36')
  })
  it('formats engineering', () => {
    const formatter = new numberformat.Formatter({format: 'engineering'})
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    //expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1E3')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.0000E6')
    expect(formatter.format(1.1111e6)).to.equal('1.1111E6')
    expect(formatter.format(1e7)).to.equal('10.000E6')
    expect(formatter.format(1.1111e7)).to.equal('11.111E6')
    expect(formatter.format(1e8)).to.equal('100.00E6')
  })
  it('formats short numbers', () => {
    const formatter = new numberformat.Formatter({flavor: 'short'})
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.00M')
    expect(formatter.format(100e3)).to.equal('100K')
    expect(formatter.format(1e9)).to.equal('1.00B')
    expect(formatter.format(1.1111e6)).to.equal('1.11M')
    expect(formatter.format(1.1111e6, {format: 'engineering'})).to.equal('1.11E6')
  })
  it('supports `opts` as a second argument', () => {
    const formatter = numberformat
    expect(formatter.format(1, {flavor: 'short'})).to.equal('1')
    expect(formatter.format(1e3, {flavor: 'short'})).to.equal('1,000')
    expect(formatter.format(1e6, {flavor: 'short'})).to.equal('1.00M')
    expect(formatter.format(100e3, {flavor: 'short'})).to.equal('100K')
    expect(formatter.format(1e9, {flavor: 'short'})).to.equal('1.00B')
    expect(formatter.format(1.1111e6, {flavor: 'short'})).to.equal('1.11M')
  })
  it('handles bogus formats', () => {
    const formatter = numberformat
    expect(() => formatter.format(1, {format: 'bogus'})).to.throw()
    expect(() => formatter.format(1, {format: 'standard'})).not.to.throw()
    expect(() => formatter.format(1, {format: null})).not.to.throw()
  })
  it('supports suffix-only', () => {
    const formatter = numberformat
    expect(formatter.suffix(1e6, {format: 'standard'})).to.equal(' million')
    expect(formatter.suffix(1e6, {format: 'standard', flavor: 'short'})).to.equal('M')
    expect(formatter.suffix(1e6, {format: 'engineering'})).to.equal('E6')
  })
  it('supports negatives', () => {
    const formatter = numberformat
    expect(formatter.format(0)).to.equal('0')
    expect(formatter.format(-1)).to.equal('-1')
    expect(formatter.format(-1e3)).to.equal('-1,000')
    expect(formatter.format(-1e6)).to.equal('-1.0000 million')
    expect(formatter.format(-1e21)).to.equal('-1.0000 sextillion')
  })
  // TODO: rounding
  // TODO: decimal support, 0 < val < 1
  // TODO: negatives tests

  it('formats bigger numbers', () => {
    const formatter = numberformat
    expect(formatter.format(1e18)).to.equal('1.0000 quintillion')
    expect(formatter.format(1e18, {flavor: 'short'})).to.equal('1.00Qi')
    // 1e20 is an important breakpoint: JS's native number formatting changes
    // from '123,456' to '1.23e21'
    expect(formatter.format(1e21)).to.equal('1.0000 sextillion')
    expect(formatter.format(1e21, {flavor: 'short'})).to.equal('1.00Sx')
  })
});
