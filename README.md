# swarm-numberformat

Format large numbers in several human-readable ways. Designed for incremental games like [swarmsim](https://swarmsim.github.io). Less than 20k minified.

[![Travis build status](http://img.shields.io/travis/erosson/swarm-numberformat.svg?style=flat)](https://travis-ci.org/erosson/swarm-numberformat)
[![Dependency Status](https://david-dm.org/erosson/swarm-numberformat.svg)](https://david-dm.org/erosson/swarm-numberformat)
[![devDependency Status](https://david-dm.org/erosson/swarm-numberformat/dev-status.svg)](https://david-dm.org/erosson/swarm-numberformat#info=devDependencies)

     numberformat.format(1e10)
     // => "10.000 billion"
     numberformat.format(1e10, {format: 'scientific'})
     // => "1.0000e10"
     numberformat.format(1e10, {format: 'engineering'})
     // => "10.000E9"
     numberformat.format(1e10, {format: 'longScale'})
     // => "10.000 milliard"
     
     // `flavor` abbreviates both the suffix and the significant figures
     numberformat.format(1e10, {flavor: 'short'})
     // => "10.0B"
     // Of course, you can specify sigfigs yourself
     numberformat.format(1e10, {flavor: 'short', sigfigs: 7})
     // => "10.00000B"
     
     // Formatter objects allow you to set default parameters just once
     var f = new numberformat.Formatter({format: 'engineering', sigfigs: 2})
     f.format(1.2345e10)
     // => "12E9"
     
     // Very large numbers are supported with decimal.js
     numberformat.format(new Decimal(1e10000), {backend: 'decimal.js', format: 'engineering'})
     // => "10e9999"

[See it in action](https://jsbin.com/zadepad/edit?html,output).

## Getting started

    <script src="//cdn.rawgit.com/erosson/swarm-numberformat/master/dist/swarm-numberformat.js"></script>

or

    npm install --save swarm-numberformat

    const numberformat = require('swarm-numberformat')

TODO: better api documentation. For now, see its features in [the demo](https://jsbin.com/zadepad/edit?html,output).

## Related work

Based on swarmsim's bignum:
* https://github.com/swarmsim/swarm/blob/master/app/scripts/filters/bignum.coffee
* https://github.com/swarmsim/swarm/blob/master/test/spec/filters/bignum.coffee

Project template: https://github.com/babel/generator-babel-boilerplate
