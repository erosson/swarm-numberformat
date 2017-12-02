### [0.4.0](https://github.com/erosson/swarm-numberformat/releases/tag/v0.4.0)

- Added support for custom decimal.js constructors.
- Added support for decimal.js-light.
- Numbers like 999,999 or 999,999,999 should no longer display two suffixes. #20

### [0.3.5](https://github.com/erosson/swarm-numberformat/releases/tag/v0.3.5)

- Fix node.js import failures.

### [0.3.0](https://github.com/erosson/swarm-numberformat/releases/tag/v0.3.0)

- Changed build system to use nwb; tests use jest instead of mocha; `npm start` runs the demo page. These are big changes to the development environment, but I think they're invisible to users.
- Implemented number parsing. Standard suffixes only, for now. `numberformat.parse('10k') === 10000`

### [0.2.1](https://github.com/erosson/swarm-numberformat/releases/tag/v0.2.1)

- Support undefined/null/zero sigfigs. #15

### [0.2.0](https://github.com/erosson/swarm-numberformat/releases/tag/v0.2.0)

- BREAKING CHANGE: removed minRound. It existed to format small numbers, but it didn't work very well.
- Added maxSmall, for specialized formatting for numbers with decimal places. Most of this library's optimized for large whole numbers.
- Numbers between zero and minSuffix no longer have sigfigs applied, so format(12345) is "12,345" not "12,300"

### [0.1.1](https://github.com/erosson/swarm-numberformat/releases/tag/v0.1.1)

- Added keywords for Bower and NPM package searches
- Minor documentation updates

### [0.1.0](https://github.com/erosson/swarm-numberformat/releases/tag/v0.1.0)

- First publicized release
