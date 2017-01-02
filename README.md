# swarm-numberformat

Format large numbers in several human-readable ways. Designed for incremental games like [swarmsim](https://swarmsim.github.io).

[See it in action](https://jsbin.com/zadepad/edit?html,output).

[![Travis build status](http://img.shields.io/travis/erosson/swarm-numberformat.svg?style=flat)](https://travis-ci.org/erosson/swarm-numberformat)
[![Dependency Status](https://david-dm.org/erosson/swarm-numberformat.svg)](https://david-dm.org/erosson/swarm-numberformat)
[![devDependency Status](https://david-dm.org/erosson/swarm-numberformat/dev-status.svg)](https://david-dm.org/erosson/swarm-numberformat#info=devDependencies)

## Features

Several built-in formats to choose from. Let your users pick their favorite in an options menu! 

     numberformat.format(1e10)    // or {format: 'standard'}
     // => "10.000 billion"
     numberformat.format(1e10, {format: 'scientific'})
     // => "1.0000e10"
     numberformat.format(1e10, {format: 'engineering'})
     // => "10.000E9"
     numberformat.format(1e10, {format: 'longScale'})
     // => "10.000 milliard"

At 1e249, 'standard' and 'longScale' fall back to scientific notation.
     
Write `{flavor:'short'}` in places you need to abbreviate suffixes and sigfigs. Plays nice with all the formats above.

     numberformat.format(1e10, {flavor: 'short'})
     // => "10.0B"

Of course, you can override significant figures.

     numberformat.format(1e10, {flavor: 'short', sigfigs: 7})
     // => "10.00000B"
     
Use a formatter object instead of `numberformat.format`/`numberformat.default` to set your own default parameters.

     var f = new numberformat.Formatter({format: 'engineering', sigfigs: 2})
     f.format(1.2345e10)
     // => "12E9"
     
There's support for [decimal.js](https://github.com/MikeMcl/decimal.js/) when you need numbers beyond 1e308/`Number.MAX_VALUE`.

     numberformat.format(new Decimal(1e10000), {backend: 'decimal.js', format: 'engineering'})
     // => "10e9999"

swarm-numberformat has no third-party dependencies, and is less than 20k minified.

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
