module.exports = {
  type: 'web-module',
  npm: {
    esModules: true,
    umd: {
      global: 'numberformat',
      externals: {
        'decimal.js': 'Decimal',
      },
    },
  },
}
