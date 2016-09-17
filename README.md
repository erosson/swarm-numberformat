# swarm-numberformat

[![Travis build status](http://img.shields.io/travis/erosson/swarm-numberformat.svg?style=flat)](https://travis-ci.org/erosson/swarm-numberformat)
[![Dependency Status](https://david-dm.org/erosson/swarm-numberformat.svg)](https://david-dm.org/erosson/swarm-numberformat)
[![devDependency Status](https://david-dm.org/erosson/swarm-numberformat/dev-status.svg)](https://david-dm.org/erosson/swarm-numberformat#info=devDependencies)

Based on swarmsim's bignum, but rewritten from scratch in ES6.
* https://github.com/swarmsim/swarm/blob/master/app/scripts/filters/bignum.coffee
* https://github.com/swarmsim/swarm/blob/master/test/spec/filters/bignum.coffee

Project template: https://github.com/babel/generator-babel-boilerplate

This hasn't been used in production yet, so there are probably bugs. If it's anything like the original, they're all precision-related bugs

Basic ES6 usage:
   
    import numberformat from  'swarm-numberformat'
    numberformat.format(1234567)
    >>> '1.23 million'

npm should work:

    npm install swarm-numberformat
