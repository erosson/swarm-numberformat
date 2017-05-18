### [0.2.2](https://github.com/erosson/swarm-numberformat/releases/tag/v0.2.2)

- Babel won't try to compile `dist/` anymore.

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
