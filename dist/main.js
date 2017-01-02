(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["numberformat"] = factory();
	else
		root["numberformat"] = factory();
})(this, function() {
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

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.format = exports.Formatter = exports.defaultOptions = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Can't comment a .json file, but the suffixes come from these pages:
	// http://home.kpn.nl/vanadovv/BignumbyN.html
	
	
	var _standardSuffixes = __webpack_require__(1);
	
	var _standardSuffixes2 = _interopRequireDefault(_standardSuffixes);
	
	var _longscaleSuffixes = __webpack_require__(2);
	
	var _longscaleSuffixes2 = _interopRequireDefault(_longscaleSuffixes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// TODO: use this page to generate names dynamically, for even larger numbers:
	//   http://mathforum.org/library/drmath/view/59154.html
	// TODO: decimal.js support
	// TODO: rounding control
	
	function validate(condition, message) {
	  if (!condition) {
	    throw new Error(message);
	  }
	  return condition;
	}
	
	// Suffixes are a list - which index of the list do we want? 
	// _index(999) === 0
	// _index(1000) === 1
	// _index(1000000) === 2
	function _index(val) {
	  // string length is faster but fails for length >= 20, where JS starts
	  // formatting with e
	  return Math.max(0, Math.floor(Math.log10(Math.abs(val)) / 3));
	}
	
	// The formatting function.
	function _format(val, opts) {
	  var index = _index(val);
	  var suffix = opts.suffixFn(index);
	  // opts.minSuffix: Use JS native formatting for smallish numbers, because
	  // '99,999' is prettier than '99.9k'
	  // TODO: handle 0 < val < 1 here
	  if (Math.abs(val) < opts.minSuffix) {
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
	  var prefix = (val / Math.pow(1000, index)).toPrecision(opts.sigfigs);
	  return '' + prefix + suffix;
	}
	
	var defaultOptions = exports.defaultOptions = {
	  // Flavor is a shortcut to modify any number of other options, like sigfigs.
	  // It's much more commonly used by callers than suffixGroup, which only controls
	  // suffixes. The two share the same possible names by default.
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
	var Formats = {
	  standard: { suffixGroups: _standardSuffixes2.default },
	  // like standard formatting, with a different set of suffixes
	  longScale: { suffixGroups: _longscaleSuffixes2.default },
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
	  function Formatter() {
	    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	    _classCallCheck(this, Formatter);
	
	    this.opts = opts;
	  }
	
	  _createClass(Formatter, [{
	    key: '_normalizeOpts',
	    value: function _normalizeOpts() {
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
	    }
	  }, {
	    key: 'index',
	    value: function index(val) {
	      return _index(val);
	    }
	  }, {
	    key: 'suffix',
	    value: function suffix(val, opts) {
	      opts = this._normalizeOpts(opts);
	      return opts.suffixFn(_index(val));
	    }
	  }, {
	    key: 'format',
	    value: function format(val, opts) {
	      opts = this._normalizeOpts(opts);
	      return _format(val, opts);
	    }
	    // Use this in your options UI
	
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
	
	// this is just to make the browser api nicer
	
	var format = exports.format = function format(val, opts) {
	  return numberformat.format(val, opts);
	};

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
		"short": [],
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

/***/ }
/******/ ])
});
;
//# sourceMappingURL=main.js.map