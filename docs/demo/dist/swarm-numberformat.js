/*!
 * swarm-numberformat v0.3.5
 * MIT Licensed
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("decimal.js"));
	else if(typeof define === 'function' && define.amd)
		define(["decimal.js"], factory);
	else if(typeof exports === 'object')
		exports["numberformat"] = factory(require("decimal.js"));
	else
		root["numberformat"] = factory(root["Decimal"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (immutable) */ __webpack_exports__["a"] = requireDecimal;
// Lazy-load - we might not need decimal. It's a peerDependency, so the parent
// library must include it if needed - we don't, because many callers don't need
// it.
var Decimal = void 0;
function requireDecimal(config) {
  return config && config.Decimal || Decimal || (Decimal = function () {
    // Allow node callers to inject their own decimal.js, because I am sick to
    // death of trying to wrangle require/webpack/import/etc.
    if (global && global.Decimal) {
      return global.Decimal;
    }
    // `nwb.config.js: extenals` ensures this points to window.Decimal for umd (`<script src="...">`) builds
    return __webpack_require__(7);
  }());
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__static_standard_suffixes_json__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__static_standard_suffixes_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__static_standard_suffixes_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__static_long_scale_suffixes_json__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__static_long_scale_suffixes_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__static_long_scale_suffixes_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__decimal__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Formats; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Formatter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return format; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return formatFull; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return formatShort; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Can't comment a .json file, but the suffixes come from these pages:
// http://home.kpn.nl/vanadovv/BignumbyN.html




// TODO: use this page to generate names dynamically, for even larger numbers:
//   http://mathforum.org/library/drmath/view/59154.html

function validate(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
  return condition;
}

// polyfill IE and phantomjs
var log10 = function () {
  if (!!Math.log10) {
    return Math.log10;
  }
  return function (val) {
    var ret = Math.log(val) / Math.LN10;
    // bloody stupid rounding errors
    ret = Math.round(ret * 1e6) / 1e6;
    return ret;
  };
}();

var backends = {
  'native': {
    normalize: function normalize(val) {
      return val;
    },

    // Suffixes are a list - which index of the list do we want?
    // _index(999) === 0
    // _index(1000) === 1
    // _index(1000000) === 2
    index: function index(val) {
      // string length is faster but fails for length >= 20, where JS starts
      // formatting with e
      return Math.max(0, Math.floor(log10(Math.abs(val)) / 3));
    },
    prefix: function prefix(val, index, _ref) {
      var sigfigs = _ref.sigfigs;

      // `sigfigs||undefined` supports sigfigs=[null|0], #15
      return (val / Math.pow(1000, index)).toPrecision(sigfigs || undefined);
    }
  },
  'decimal.js': {
    // api docs: https://mikemcl.github.io/decimal.js/
    _requireDecimal: function _requireDecimal(config) {
      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__decimal__["a" /* requireDecimal */])(config)) throw new Error('requireDecimal() failed');
      return new __WEBPACK_IMPORTED_MODULE_2__decimal__["a" /* requireDecimal */](config)(0).constructor.clone(config);
    },
    normalize: function normalize(val, _ref2) {
      var rounding = _ref2.rounding;

      var Decimal = this._requireDecimal({ rounding: rounding });
      return new Decimal(val);
    },
    index: function index(val) {
      var Decimal = this._requireDecimal();
      // index = val.log10().dividedToIntegerBy(Decimal.log 1000)
      // Decimal.log() is too slow for large numbers. Docs say performance degrades exponentially as # digits increases, boo.
      // Lucky me, the length is used by decimal.js internally: num.e
      // this is in the docs, so I think it's stable enough to use...
      val = new Decimal(val);
      return Math.floor(val.e / 3);
    },
    prefix: function prefix(val, index, _ref3) {
      var sigfigs = _ref3.sigfigs,
          rounding = _ref3.rounding;

      var Decimal = this._requireDecimal({ rounding: rounding });
      var div = new Decimal(1000).pow(index);
      // `sigfigs||undefined` supports sigfigs=[null|0], #15
      return new Decimal(val).dividedBy(div).toPrecision(sigfigs || undefined);
    }
  }
};

// The formatting function.
function _format(val, opts) {
  var backend = validate(backends[opts.backend], 'not a backend: ' + opts.backend);
  val = backend.normalize(val, opts);
  var index = backend.index(val);
  var suffix = opts.suffixFn(index);
  // `{sigfigs: undefined|null|0}` for automatic sigfigs is supported.
  var sigfigs = opts.sigfigs || undefined;
  // optionally format small numbers differently: show decimals without trailing zeros
  if (Math.abs(val) < opts.maxSmall) {
    // second param for decimal.js only, native ignores it
    return val.toPrecision(sigfigs, opts.rounding).replace(/(\.\d*[1-9])0+$/, '$1');
  }
  // opts.minSuffix: Use JS native formatting for smallish numbers, because
  // '99,999' is prettier than '99.9k'
  // it's safe to let Math coerce Decimal.js to infinity here, gt/lt still work
  if (Math.abs(val) < opts.minSuffix) {
    val = Math.floor(val);
    return val.toLocaleString();
  }
  // No suffix found: use scientific notation. JS's native toExponential is fine.
  if (!suffix && suffix !== '') {
    if (!!sigfigs) {
      sigfigs -= 1;
    }
    return val.toExponential(sigfigs).replace('e+', 'e');
  }
  // Found a suffix. Calculate the prefix, the number before the suffix.
  var prefix = backend.prefix(val, index, opts);
  return '' + prefix + suffix;
}

var defaultOptions = {
  backend: 'native',
  flavor: 'full',
  suffixGroup: 'full',
  suffixFn: function suffixFn(index) {
    var suffixes = this.suffixes || this.suffixGroups[this.suffixGroup];
    validate(suffixes, 'no such suffixgroup: ' + this.suffixGroup);
    if (index < suffixes.length) {
      return suffixes[index] || '';
    }
    // return undefined
  },

  // minimum value to use any suffix, because '99,900' is prettier than '99.9k'
  minSuffix: 1e5,
  // don't use sigfigs for smallish numbers. #13
  minSuffixSigfigs: false,
  // Special formatting for numbers with a decimal point
  maxSmall: 0,
  sigfigs: 3, // often overridden by flavor
  format: 'standard'
};
// User-visible format choices, like on swarmsim's options screen.
// Each has a different set of options.
var Formats = {
  standard: { suffixGroups: __WEBPACK_IMPORTED_MODULE_0__static_standard_suffixes_json___default.a },
  // like standard formatting, with a different set of suffixes
  longScale: { suffixGroups: __WEBPACK_IMPORTED_MODULE_1__static_long_scale_suffixes_json___default.a },
  // like standard formatting, with no suffixes at all
  scientific: { suffixGroups: { full: [], short: [] } },
  // like standard formatting, with a smaller set of suffixes
  hybrid: {
    suffixGroups: {
      full: __WEBPACK_IMPORTED_MODULE_0__static_standard_suffixes_json___default.a.full.slice(0, 12),
      short: __WEBPACK_IMPORTED_MODULE_0__static_standard_suffixes_json___default.a.short.slice(0, 12)
    }
  },
  // like standard formatting, with a different/infinite set of suffixes
  engineering: { suffixFn: function suffixFn(index) {
      return index === 0 ? '' : 'E' + index * 3;
    } }
};
// A convenient way for the developer to modify formatters.
// These are different from formats - not user-visible.
var Flavors = {
  full: { suffixGroup: 'full', sigfigs: 5 },
  short: { suffixGroup: 'short', sigfigs: 3 }
};
// Allow callers to extend formats and flavors.
defaultOptions.formats = Formats;
defaultOptions.flavors = Flavors;

var Formatter = function () {
  /**
   * @param {Object} opts All formatter configuration.
   * @param {string} [opts.flavor='full'] 'full' or 'short'. Flavors can modify any number of other options here. Full is the default; short has fewer sigfigs and shorter standard-suffixes.
   * @param {Object} [opts.flavors] Specify your own custom flavors.
   * @param {string} [opts.backend='native'] 'native' or 'decimal.js'.
   * @param {string} [opts.suffixGroup]
   * @param {Function} [opts.suffixFn]
   * @param {number} [opts.minSuffix=1e5]
   * @param {number} [opts.maxSmall=0] Special formatting for numbers with a decimal point
   * @param {number} [opts.sigfigs=5]
   * @param {number} [opts.format='standard'] 'standard', 'hybrid', 'scientific', 'longScale'.
   * @param {Object} [opts.formats] Specify your own custom formats.
   */
  function Formatter() {
    var _this = this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Formatter);

    /** @type Object */
    this.opts = opts;
    // create convenience methods for each flavor
    var flavors = Object.keys(this._normalizeOpts().flavors);
    // the fn(i) is for stupid binding tricks with the looped fn(val, opts)
    for (var i = 0; i < flavors.length; i++) {
      (function (i) {
        var flavor = flavors[i];
        // capitalize the first letter to camel-case method name, like formatShort
        var key = 'format' + flavor.charAt(0).toUpperCase() + flavor.substr(1);
        /** @ignore */
        _this[key] = function (val, opts) {
          return _this.formatFlavor(val, flavor, opts);
        };
      })(i);
    }
  }

  Formatter.prototype._normalizeOpts = function _normalizeOpts() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // all the user-specified opts, no defaults
    opts = Object.assign({}, this.opts, opts);
    // opts.format redefines some other opts, but should never override the user's opts
    var format = opts && opts.format;
    var formats = opts && opts.formats || defaultOptions.formats;
    var formatOptions = formats[format || defaultOptions.format];
    validate(formatOptions, 'no such format: ' + format);
    var flavor = opts && opts.flavor;
    var flavors = opts && opts.flavors || defaultOptions.flavors;
    var flavorOptions = flavors[flavor || defaultOptions.flavor];
    validate(flavorOptions, 'no such flavor: ' + flavor);
    // finally, add the implied options: defaults and format-derived
    return Object.assign({}, defaultOptions, formatOptions, flavorOptions, opts);
  };
  /**
   * @param {number} val
   * @param {Object} [opts]
   * @return {number} which suffix to use for this number in a list of suffixes. You can also think of this as "how many commas are in the number?"
   */


  Formatter.prototype.index = function index(val, opts) {
    opts = this._normalizeOpts(opts);
    return backends[opts.backend].index(val);
  };
  /**
   * @param {number} val
   * @param {Object} [opts]
   * @return {string} The suffix that this number would use, with no number shown.
   * @example
   * new Formatter().suffix(1e6)
   * // => " million"
   * @example
   * new Formatter().suffix(1e6, {flavor: "short"})
   * // => "M"
   */


  Formatter.prototype.suffix = function suffix(val, opts) {
    opts = this._normalizeOpts(opts);
    var index = backends[opts.backend].index(val);
    return opts.suffixFn(index);
  };
  /**
   * Format a number.
   * @param {number} val
   * @param {Object} [opts] Override the options provided to the Formatter constructor.
   * @return {string} The formatted number.
   * @example
   * new Formatter().format(1e6)
   * // => "1.0000 million"
   */


  Formatter.prototype.format = function format(val, opts) {
    opts = this._normalizeOpts(opts);
    return _format(val, opts);
  };
  /**
   * Format a number with a specified flavor. It's very common to call the formatter with different flavors, so it has its own shortcut.
   *
   * `Formatter.formatFull()` and `Formatter.formatShort()` are also available.
   * @param {number} val
   * @param {string} flavor 'short' or 'full'. See opts.flavor.
   * @param {Object} [opts]
   * @return {string} The formatted number.
   * @example
   * new Formatter().format(1e6, 'short')
   * // => "1.00M"
   */


  Formatter.prototype.formatFlavor = function formatFlavor(val, flavor, opts) {
    return this.format(val, Object.assign({}, opts, { flavor: flavor }));
  };
  /**
   * @param {Object} [opts]
   * @return {string[]} The complete list of formats available. Use this to build an options UI to allow your players to choose their favorite format.
   */


  Formatter.prototype.listFormats = function listFormats(opts) {
    opts = this._normalizeOpts(opts);
    return Object.keys(opts.formats);
  };

  return Formatter;
}();

var numberformat = new Formatter();
numberformat.defaultOptions = defaultOptions;
numberformat.Formatter = Formatter;
/* harmony default export */ __webpack_exports__["f"] = numberformat;

/**
 * Format a number using the default options.
 * @param {number} val
 * @param {Object} [opts]
 * @return string
 * @example
 * format(1e6)
 * // => "1.0000 million"
 * @example
 * format(1e6, {sigfigs: 1})
 * // => "1 million"
 */
var format = function format(val, opts) {
  return numberformat.format(val, opts);
};
/**
 * Format a full-flavor number using the default options. Identical to `format()`
 * @param {number} val
 * @param {Object} [opts]
 * @return string
 * @example
 * format(1e6)
 * // => "1.0000 million"
 */
var formatFull = function formatFull(val, opts) {
  return numberformat.formatFlavor(val, 'full', opts);
};
/**
 * Format a short-flavor number using the default options.
 * @param {number} val
 * @param {Object} [opts]
 * @return string
 * @example
 * format(1e6)
 * // => "1.00M"
 */
var formatShort = function formatShort(val, opts) {
  return numberformat.formatFlavor(val, 'short', opts);
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = {
	"short": [
		"",
		"K",
		"M",
		"Md",
		"B",
		"Bd",
		"T",
		"Td",
		"Qa",
		"Qad",
		"Qi",
		"Qid",
		"Sx",
		"Sxd",
		"Sp",
		"Spd",
		"Oc",
		"Od",
		"No",
		"Nd",
		"Dc",
		"Dd",
		"UDc",
		"UDd",
		"DDc",
		"DDd",
		"TDc",
		"TDd",
		"QaDc",
		"QaDd",
		"QiDc",
		"QiDd",
		"SxDc",
		"SxDd",
		"SpDc",
		"SpDd",
		"ODc",
		"ODd",
		"NDc",
		"NDd",
		"Vi",
		"Vd",
		"UVi",
		"UVd",
		"DVi",
		"DVd",
		"TVi",
		"TVd",
		"QaVi",
		"QaVd",
		"QiVi",
		"QiVd",
		"SxVi",
		"SxVd",
		"SpVi",
		"SpVd",
		"OVi",
		"OVd",
		"NVi",
		"NVd",
		"Tg",
		"TD",
		"UTg",
		"UTD",
		"DTg",
		"DTD",
		"TTg",
		"TTD",
		"QaTg",
		"QaTD",
		"QiTg",
		"QiTD",
		"SxTg",
		"SxTD",
		"SpTg",
		"SpTD",
		"OTg",
		"OTD",
		"NTg",
		"NTD",
		"Qd",
		"QD",
		"UQd",
		"UQD",
		"DQd",
		"DQD",
		"TQd",
		"TQD",
		"QaQd",
		"QaQD"
	],
	"full": [
		"",
		" thousand",
		" million",
		" milliard",
		" billion",
		" billiard",
		" trillion",
		" trilliard",
		" quadrillion",
		" quadrilliard",
		" quintillion",
		" quintilliard",
		" sextillion",
		" sextilliard",
		" septillion",
		" septilliard",
		" octillion",
		" octilliard",
		" nonillion",
		" nonilliard",
		" decillion",
		" decilliard",
		" undecillion",
		" undecilliard",
		" duodecillion",
		" duodecilliard",
		" tredecillion",
		" tredecilliard",
		" quattuordecillion",
		" quattuordecilliard",
		" quinquadecillion",
		" quinquadecilliard",
		" sedecillion",
		" sedecilliard",
		" septendecillion",
		" septendecilliard",
		" octodecillion",
		" octodecilliard",
		" novendecillion",
		" novendecilliard",
		" vigintillion",
		" vigintilliard",
		" unvigintillion",
		" unvigintilliard",
		" duovigintillion",
		" duovigintilliard",
		" tresvigintillion",
		" tresvigintilliard",
		" quattuorvigintillion",
		" quattuorvigintilliard",
		" quinquavigintillion",
		" quinquavigintilliard",
		" sesvigintillion",
		" sesvigintilliard",
		" septemvigintillion",
		" septemvigintilliard",
		" octovigintillion",
		" octovigintilliard",
		" novemvigintillion",
		" novemvigintilliard",
		" trigintillion",
		" trigintilliard",
		" untrigintillion",
		" untrigintilliard",
		" duotrigintillion",
		" duotrigintilliard",
		" trestrigintillion",
		" trestrigintilliard",
		" quattuortrigintillion",
		" quattuortrigintilliard",
		" quinquatrigintillion",
		" quinquatrigintilliard",
		" sestrigintillion",
		" sestrigintilliard",
		" septentrigintillion",
		" septentrigintilliard",
		" octotrigintillion",
		" octotrigintilliard",
		" noventrigintillion",
		" noventrigintilliard",
		" quadragintillion",
		" quadragintilliard",
		" unquadragintillion",
		" unquadragintilliard"
	]
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
	"short": [
		"",
		"K",
		"M",
		"B",
		"T",
		"Qa",
		"Qi",
		"Sx",
		"Sp",
		"Oc",
		"No",
		"Dc",
		"UDc",
		"DDc",
		"TDc",
		"QaDc",
		"QiDc",
		"SxDc",
		"SpDc",
		"ODc",
		"NDc",
		"Vi",
		"UVi",
		"DVi",
		"TVi",
		"QaVi",
		"QiVi",
		"SxVi",
		"SpVi",
		"OVi",
		"NVi",
		"Tg",
		"UTg",
		"DTg",
		"TTg",
		"QaTg",
		"QiTg",
		"SxTg",
		"SpTg",
		"OTg",
		"NTg",
		"Qd",
		"UQd",
		"DQd",
		"TQd",
		"QaQd",
		"QiQd",
		"SxQd",
		"SpQd",
		"OQd",
		"NQd",
		"Qq",
		"UQq",
		"DQq",
		"TQq",
		"QaQq",
		"QiQq",
		"SxQq",
		"SpQq",
		"OQq",
		"NQq",
		"Sg",
		"USg",
		"DSg",
		"TSg",
		"QaSg",
		"QiSg",
		"SxSg",
		"SpSg",
		"OSg",
		"NSg",
		"St",
		"USt",
		"DSt",
		"TSt",
		"QaSt",
		"QiSt",
		"SxSt",
		"SpSt",
		"OSt",
		"NSt",
		"Og",
		"UOg",
		"DOg",
		"TOg",
		"QaOg",
		"QiOg",
		"SxOg",
		"SpOg",
		"OOg",
		"NOg"
	],
	"full": [
		"",
		" thousand",
		" million",
		" billion",
		" trillion",
		" quadrillion",
		" quintillion",
		" sextillion",
		" septillion",
		" octillion",
		" nonillion",
		" decillion",
		" undecillion",
		" duodecillion",
		" tredecillion",
		" quattuordecillion",
		" quinquadecillion",
		" sedecillion",
		" septendecillion",
		" octodecillion",
		" novendecillion",
		" vigintillion",
		" unvigintillion",
		" duovigintillion",
		" tresvigintillion",
		" quattuorvigintillion",
		" quinquavigintillion",
		" sesvigintillion",
		" septemvigintillion",
		" octovigintillion",
		" novemvigintillion",
		" trigintillion",
		" untrigintillion",
		" duotrigintillion",
		" trestrigintillion",
		" quattuortrigintillion",
		" quinquatrigintillion",
		" sestrigintillion",
		" septentrigintillion",
		" octotrigintillion",
		" noventrigintillion",
		" quadragintillion",
		" unquadragintillion",
		" duoquadragintillion",
		" tresquadragintillion",
		" quattuorquadragintillion",
		" quinquaquadragintillion",
		" sesquadragintillion",
		" septenquadragintillion",
		" octoquadragintillion",
		" novenquadragintillion",
		" quinquagintillion",
		" unquinquagintillion",
		" duoquinquagintillion",
		" tresquinquagintillion",
		" quattuorquinquagintillion",
		" quinquaquinquagintillion",
		" sesquinquagintillion",
		" septenquinquagintillion",
		" octoquinquagintillion",
		" novenquinquagintillion",
		" sexagintillion",
		" unsexagintillion",
		" duosexagintillion",
		" tresexagintillion",
		" quattuorsexagintillion",
		" quinquasexagintillion",
		" sesexagintillion",
		" septensexagintillion",
		" octosexagintillion",
		" novensexagintillion",
		" septuagintillion",
		" unseptuagintillion",
		" duoseptuagintillion",
		" treseptuagintillion",
		" quattuorseptuagintillion",
		" quinquaseptuagintillion",
		" seseptuagintillion",
		" septenseptuagintillion",
		" octoseptuagintillion",
		" novenseptuagintillion",
		" octogintillion",
		" unoctogintillion",
		" duooctogintillion"
	]
};

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__format__ = __webpack_require__(1);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Formats", function() { return __WEBPACK_IMPORTED_MODULE_0__format__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Formatter", function() { return __WEBPACK_IMPORTED_MODULE_0__format__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "format", function() { return __WEBPACK_IMPORTED_MODULE_0__format__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "formatFull", function() { return __WEBPACK_IMPORTED_MODULE_0__format__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "formatShort", function() { return __WEBPACK_IMPORTED_MODULE_0__format__["e"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "numberformat", function() { return __WEBPACK_IMPORTED_MODULE_0__format__["f"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parse__ = __webpack_require__(5);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return __WEBPACK_IMPORTED_MODULE_1__parse__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Parser", function() { return __WEBPACK_IMPORTED_MODULE_1__parse__["b"]; });




/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__static_standard_suffixes_json__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__static_standard_suffixes_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__static_standard_suffixes_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__static_long_scale_suffixes_json__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__static_long_scale_suffixes_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__static_long_scale_suffixes_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__decimal_js__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _parse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Parser; });


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }





//const suffixGroups = {standard, longScale}
var suffixGroups = { standard: __WEBPACK_IMPORTED_MODULE_0__static_standard_suffixes_json___default.a }; // TODO longscale parsing. There's a duplicate
var suffixGroupsToExp = {};
for (var _iterator = Object.keys(suffixGroups), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
  var _ref;

  if (_isArray) {
    if (_i >= _iterator.length) break;
    _ref = _iterator[_i++];
  } else {
    _i = _iterator.next();
    if (_i.done) break;
    _ref = _i.value;
  }

  var groupName = _ref;

  var group = suffixGroups[groupName];
  var suffixToExp = suffixGroupsToExp[groupName] = {};
  for (var _iterator2 = Object.keys(group), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray2) {
      if (_i2 >= _iterator2.length) break;
      _ref2 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done) break;
      _ref2 = _i2.value;
    }

    var fkey = _ref2;

    var fg = group[fkey];
    for (var index in fg) {
      var suffix = fg[index].toLowerCase();
      var exp = index * 3;
      if (suffixToExp[suffix] && suffixToExp[suffix].exp === exp, "duplicate parsenumber suffix with different exponents: " + suffix) suffixToExp[suffix] = { index: index, exp: exp, replace: 'e' + exp };
    }
  }
}

var backends = {
  'native': {
    parseInt: function parseInt(text, config) {
      var val = Math.ceil(Number(text, 10));
      return 'default' in config && !this.isValid(val) ? config['default'] : val;
    },
    isValid: function isValid(val) {
      return (val || val === 0) && !Number.isNaN(val);
    }
  },
  'decimal.js': {
    parseInt: function parseInt(text, config) {
      if ('default' in config) {
        try {
          var val = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__decimal_js__["a" /* requireDecimal */])(config)(text).ceil();
          return this.isValid(val) ? val : config['default'];
        } catch (e) {
          return config.default;
        }
      }
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__decimal_js__["a" /* requireDecimal */])(config)(text).ceil();
    },
    isValid: function isValid(val) {
      return val && !val.isNaN();
    }
  }
};

function _parse(text) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!text) return config['default'] || null;
  // TODO make this an option
  var suffixToExp = suffixGroupsToExp[config.suffixGroup || 'standard'];
  var backend = backends[config.backend || 'native'];
  if (!backend) throw new Error('no such backend: ' + config.backend);
  // remove commas. TODO: i18n fail
  text = text.replace(/,/g, '');
  // replace suffixes ('billion', etc)
  var match = / ?[a-zA-Z]+/.exec(text);
  if (match && match.length > 0) {
    var exp = suffixToExp[match[0].toLowerCase()];
    if (exp) {
      // ceil(): buy at least this many. The default of floor() is annoying when
      // we're trying to purchase exactly-n for an upgrade.
      return backend.parseInt(text.replace(match[0], exp.replace), config);
    }
  }
  // no/invalid suffix found
  // note that we also get here for a suffix of 'e', like '1e3', because it's not
  // used as a suffix. Decimal.js will parse it.
  return backend.parseInt(text, config);
}

var Parser = function () {
  function Parser(config) {
    _classCallCheck(this, Parser);

    this.config = config;
  }

  Parser.prototype.parse = function parse(text) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return _parse(text, _extends({}, this.config, config));
  };

  return Parser;
}();

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ })
/******/ ]);
});