# swarm-numberformat

[![Travis build status](http://img.shields.io/travis/erosson/swarm-numberformat.svg?style=flat)](https://travis-ci.org/erosson/swarm-numberformat)
[![Dependency Status](https://david-dm.org/erosson/swarm-numberformat.svg)](https://david-dm.org/erosson/swarm-numberformat)
[![devDependency Status](https://david-dm.org/erosson/swarm-numberformat/dev-status.svg)](https://david-dm.org/erosson/swarm-numberformat#info=devDependencies)

Based on https://github.com/swarmsim/swarm/blob/master/app/scripts/filters/bignum.coffee , but rewritten from scratch in ES6.

Project template: https://github.com/babel/generator-babel-boilerplate

This hasn't been used in production yet, so there are probably bugs. If it's anything like the original, they're all precision-related bugs

Basic ES6 usage:
   
    import numberformat from  'swarm-numberformat'
    numberformat.format(1234567)
    >>> '1.23 million'