#!/bin/sh -eux
npm run build
git add dist CHANGELOG.md
git commit -m 'publish'
npm version "$@"
npm publish

