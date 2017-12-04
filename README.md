# swarm-numberformat

Format large numbers in several human-readable ways. Designed for incremental games like [Swarm Simulator](https://swarmsim.github.io).

[See it in action](https://jsbin.com/zadepad/edit?html,output), and a [list of all suffixes](https://erosson.github.io/swarm-numberformat/demo/legend.html).

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

Use `formatShort()` or `format({flavor:'short'})` to easily abbreviate suffixes and sigfigs.

     numberformat.formatShort(1e10)
     // => "10.0B"
     numberformat.formatShort(1e10, {format: 'longScale'})
     // => "10.0Md"

Of course, you can override significant figures.

     numberformat.formatShort(1e10, {sigfigs: 7})
     // => "10.00000B"

Use a formatter object instead of `numberformat.format()` / `numberformat.default` to set your own default parameters.

     var f = new numberformat.Formatter({format: 'engineering', sigfigs: 2})
     f.format(1.2345e10)
     // => "12E9"

If you need numbers bigger than `Number.MAX_VALUE` (1e308), there's support for [decimal.js](https://github.com/MikeMcl/decimal.js/).

     numberformat.format(new Decimal('1e10000'), {backend: 'decimal.js', format: 'engineering'})
     // => "10e9999"

[decimal.js-light](https://github.com/MikeMcl/decimal.js-light), [break\_infinity.js](https://github.com/Patashu/break_infinity.js) and other Decimal.js-compatible number objects are supported too. Pass their constructor to your formatter.

     var Decimal = require('decimal.js-light') // or <script src="decimal.js-light">; load it in whatever way works for your app
     numberformat.format(new Decimal('1e10000'), {backend: 'decimal.js', format: 'engineering', Decimal: Decimal})
     // => "10e9999"

     var Decimal = require('break_infinity.js') // or <script src="break_infinity.js">; load it in whatever way works for your app
     numberformat.format(new Decimal('1e10000'), {backend: 'decimal.js', format: 'engineering', Decimal: Decimal})
     // => "10e9999"

`numberformat` can parse its own output.

     numberformat.parse('10k')
     // => 10000
     numberformat.parse('10 thousand')
     // => 10000
     numberformat.parse('10,000')
     // => 10000
     numberformat.parse('10x')
     // => NaN
     numberformat.parse('', {'default': 3})
     // => 3

swarm-numberformat includes no third-party dependencies, and is less than 20k minified.

The suffixes used here are available in JSON format - this might be useful if your program isn't in Javascript, but can read JSON:
[standard-suffixes](https://github.com/erosson/swarm-numberformat/blob/master/src/standard-suffixes.json),
[long-scale-suffixes](https://github.com/erosson/swarm-numberformat/blob/master/src/long-scale-suffixes.json).

## Getting started

    <script src="//cdn.rawgit.com/erosson/swarm-numberformat/v0.1.0/dist/swarm-numberformat.min.js"></script>

or

    bower install --save swarm-numberformat

or

    npm install --save swarm-numberformat

    const numberformat = require('swarm-numberformat')

[Full API documentation](https://erosson.github.io/swarm-numberformat/). Also see [the demo](https://jsbin.com/zadepad/edit?html,output) and a [list of all suffixes](https://erosson.github.io/swarm-numberformat/demo/legend.html).

## Related work

The suffixes used by `standard` and `longScale` formats are based on http://home.kpn.nl/vanadovv/BignumbyN.html

This project started life as number formatting filters for [Swarm Simulator](https://github.com/swarmsim/swarm/).

https://www.npmjs.com/package/written-number has a lot in common with this project. It has better support for internationalization, but its suffixes stop at smaller numbers, and it has no decimal.js support.

Project template: https://github.com/babel/generator-babel-boilerplate

## License

MIT - use this anywhere. I'd like it if you open-sourced any changes you make to this library (send a pull request? Github fork?), but it's not required.
