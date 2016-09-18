import numberformat from '../../src/workspace';

// TODO fill in all tests from 
describe('numberformat', () => {
  it('builds formatters', () => {
    expect(new numberformat.Formatter({format: 'hybrid'}).opts.format).to.equal('hybrid')
  }),
  it('formats numbers', () => {
    const formatter = numberformat
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1 thousand')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.00 million')
    expect(formatter.format(1.1111e6)).to.equal('1.11 million')
  })
  it('formats hybrid', () => {
    const formatter = new numberformat.Formatter({format: 'hybrid'})
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1 thousand')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.00 million')
    expect(formatter.format(1.1111e6)).to.equal('1.11 million')
    // TODO differences
  })
  it('formats scientificE', () => {
    const formatter = new numberformat.Formatter({format: 'scientificE'})
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1e3')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.00e6')
    expect(formatter.format(1.1111e6)).to.equal('1.11e6')
  })
  it('formats engineering', () => {
    const formatter = new numberformat.Formatter({format: 'engineering'})
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1E3')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.00E6')
    expect(formatter.format(1.1111e6)).to.equal('1.11E6')
    expect(formatter.format(1e7)).to.equal('10.0E6')
    expect(formatter.format(1.11e7)).to.equal('11.1E6')
    expect(formatter.format(1e8)).to.equal('100E6')
  })
  
  it('formats bigger numbers', () => {
    const formatter = numberformat
    expect(formatter.format(1e18)).to.equal('1.00 quintillion')
    expect(formatter.format(1e21)).to.equal('1.00 sextillion')
  })
});
