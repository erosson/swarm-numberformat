(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("decimal.js"));
	else if(typeof define === 'function' && define.amd)
		define(["decimal.js"], factory);
	else if(typeof exports === 'object')
		exports["numberformat"] = factory(require("decimal.js"));
	else
		root["numberformat"] = factory(root["decimal.js"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.formatShort = exports.formatFull = exports.format = exports.Formatter = exports.Formats = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Can't comment a .json file, but the suffixes come from these pages:
	// http://home.kpn.nl/vanadovv/BignumbyN.html
	
	
	var _standardSuffixes = __webpack_require__(1);
	
	var _standardSuffixes2 = _interopRequireDefault(_standardSuffixes);
	
	var _longScaleSuffixes = __webpack_require__(2);
	
	var _longScaleSuffixes2 = _interopRequireDefault(_longScaleSuffixes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
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
	
	      return (val / Math.pow(1000, index)).toPrecision(sigfigs);
	    }
	  },
	  'decimal.js': {
	    // Note that decimal.js is never imported by this library!
	    // We're using its methods passed in by the caller. This keeps the library
	    // much smaller for the common case: no decimal.js.
	    // api docs: https://mikemcl.github.io/decimal.js/
	    _requireDecimal: function _requireDecimal(config) {
	      var Decimal = void 0;
	      if (global.window && window.Decimal) {
	        Decimal = window.Decimal;
	      } else {
	        // the build/minifier must avoid compiling this in. It's externalized in the gulpfile.
	        Decimal = __webpack_require__(3);
	      }
	      return Decimal.clone(config);
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
	      return new Decimal(val).dividedBy(div).toPrecision(sigfigs);
	    }
	  }
	};
	
	// The formatting function.
	function _format(val, opts) {
	  var backend = validate(backends[opts.backend], 'not a backend: ' + opts.backend);
	  val = backend.normalize(val, opts);
	  var index = backend.index(val);
	  var suffix = opts.suffixFn(index);
	  // opts.minSuffix: Use JS native formatting for smallish numbers, because
	  // '99,999' is prettier than '99.9k'
	  // it's safe to let Math coerce Decimal.js to infinity here, gt/lt still work
	  if (Math.abs(val) < opts.minSuffix) {
	    // decimal.js minSuffix/minRound aren't supported, we must be native to get here
	    if (Math.abs(val) >= opts.minRound) {
	      val = Math.floor(val);
	    }
	    return val.toLocaleString(undefined, { maximumSignificantDigits: opts.sigfigs });
	  }
	  // No suffix found: use scientific notation. JS's native toExponential is fine.
	  if (!suffix && suffix !== '') {
	    return val.toExponential(opts.sigfigs - 1).replace('e+', 'e');
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
	  // Show decimals below this value rounded to opts.sigfigs, instead of floor()ed
	  minRound: 0,
	  sigfigs: 3, // often overridden by flavor
	  format: 'standard'
	};
	// User-visible format choices, like on swarmsim's options screen. 
	// Each has a different set of options.
	var Formats = exports.Formats = {
	  standard: { suffixGroups: _standardSuffixes2.default },
	  // like standard formatting, with a different set of suffixes
	  longScale: { suffixGroups: _longScaleSuffixes2.default },
	  // like standard formatting, with no suffixes at all
	  scientific: { suffixGroups: { full: [], short: [] } },
	  // like standard formatting, with a smaller set of suffixes
	  hybrid: {
	    suffixGroups: {
	      full: _standardSuffixes2.default.full.slice(0, 12),
	      short: _standardSuffixes2.default.short.slice(0, 12)
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
	
	var Formatter = exports.Formatter = function () {
	  /**
	   * @param {Object} opts All formatter configuration.
	   * @param {string} [opts.flavor='full'] 'full' or 'short'. Flavors can modify any number of other options here. Full is the default; short has fewer sigfigs and shorter standard-suffixes.
	   * @param {Object} [opts.flavors] Specify your own custom flavors. 
	   * @param {string} [opts.backend='native'] 'native' or 'decimal.js'.
	   * @param {string} [opts.suffixGroup]
	   * @param {Function} [opts.suffixFn]
	   * @param {number} [opts.minSuffix=1e5]
	   * @param {number} [opts.minRound=0]
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
	
	  _createClass(Formatter, [{
	    key: '_normalizeOpts',
	    value: function _normalizeOpts() {
	      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	      // all the user-specified opts, no defaults
	      opts = _extends({}, this.opts, opts);
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
	      return _extends({}, defaultOptions, formatOptions, flavorOptions, opts);
	    }
	    /**
	     * @param {number} val
	     * @param {Object} [opts]
	     * @return {number} which suffix to use for this number in a list of suffixes. You can also think of this as "how many commas are in the number?"
	     */
	
	  }, {
	    key: 'index',
	    value: function index(val, opts) {
	      opts = this._normalizeOpts(opts);
	      return backends[opts.backend].index(val);
	    }
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
	
	  }, {
	    key: 'suffix',
	    value: function suffix(val, opts) {
	      opts = this._normalizeOpts(opts);
	      var index = backends[opts.backend].index(val);
	      return opts.suffixFn(index);
	    }
	    /**
	     * Format a number.
	     * @param {number} val
	     * @param {Object} [opts] Override the options provided to the Formatter constructor.
	     * @return {string} The formatted number.
	     * @example
	     * new Formatter().format(1e6)
	     * // => "1.0000 million"
	     */
	
	  }, {
	    key: 'format',
	    value: function format(val, opts) {
	      opts = this._normalizeOpts(opts);
	      return _format(val, opts);
	    }
	    /**
	     * Format a number with a specified flavor. It's very common to call the formatter with different flavors, so it has its own shortcut.
	     *
	     * `Formatter.formatFull()` and `Formatter.formatShort()` are also available.
	     * @param {number} val
	     * @param {string} flavor 'short' or 'full'. See opts.flavor.
	     * @param {Object} [opts]
	     * @return {string[]} The complete list of formats available. Use this to build an options UI to allow your players to choose their favorite format.
	     */
	
	  }, {
	    key: 'formatFlavor',
	    value: function formatFlavor(val, flavor, opts) {
	      return this.format(val, _extends({}, opts, { flavor: flavor }));
	    }
	    /**
	     * @param {Object} [opts]
	     * @return {string[]} The complete list of formats available. Use this to build an options UI to allow your players to choose their favorite format.
	     */
	
	  }, {
	    key: 'listFormats',
	    value: function listFormats(opts) {
	      opts = this._normalizeOpts(opts);
	      return Object.keys(opts.formats);
	    }
	  }]);
	
	  return Formatter;
	}();
	
	var numberformat = new Formatter();
	numberformat.defaultOptions = defaultOptions;
	numberformat.Formatter = Formatter;
	exports.default = numberformat;
	
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
	
	var format = exports.format = function format(val, opts) {
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
	var formatFull = exports.formatFull = function formatFull(val, opts) {
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
	var formatShort = exports.formatShort = function formatShort(val, opts) {
	  return numberformat.formatFlavor(val, 'short', opts);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports) {

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

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=swarm-numberformat.js.map