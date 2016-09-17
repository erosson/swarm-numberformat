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
	exports.Formatter = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _suffixes = __webpack_require__(1);
	
	var _suffixes2 = _interopRequireDefault(_suffixes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _index(val) {
	  // http://stackoverflow.com/a/23416775/2782048
	  return Math.floor((('' + val).length - 1) / 3);
	}
	function _suffix(val, suffixes) {
	  return suffixes[_index(val)];
	}
	
	// All format choices, like on swarmsim's options screen. 
	var Formats = {
	  standard: function standard(val, opts) {
	    var index = _index(val);
	    if (val < opts.minSuffix) {
	      return val.toLocaleString();
	    }
	    var suffix = opts.suffixFn(index);
	    if (!suffix && suffix !== '') {
	      return val.toExponential(opts.sigfigs - 1).replace('e+', 'e');
	    }
	    var prefix = (val / Math.pow(1000, index)).toPrecision(opts.sigfigs);
	    return '' + prefix + suffix;
	  },
	  hybrid: function hybrid(val, opts) {
	    opts.suffixes = opts.suffixes.slice(0, 12);
	    return this.standard(val, opts);
	  },
	  scientificE: function scientificE(val, opts) {
	    opts.suffixes = [];
	    return this.standard(val, opts);
	  },
	  engineering: function engineering(val, opts) {
	    opts.suffixFn = function (index) {
	      if (index > 0) {
	        return 'E' + index * 3;
	      }
	      return '';
	    };
	    return this.standard(val, opts);
	  }
	};
	
	var defaultOptions = {
	  // TODO short suffixes
	  suffixes: _suffixes2.default.long,
	  suffixFn: function suffixFn(index) {
	    if (index <= this.suffixes.length) {
	      return this.suffixes[index] || '';
	    }
	    // return undefined
	  },
	
	  // minimum value to use any suffix, because '99,900' is prettier than '99.9k'
	  minSuffix: 1e5,
	  sigfigs: 3,
	  format: 'standard'
	};
	
	var Formatter = exports.Formatter = function () {
	  function Formatter() {
	    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    _classCallCheck(this, Formatter);
	
	    this.opts = Object.assign({}, defaultOptions, opts);
	  }
	
	  _createClass(Formatter, [{
	    key: 'format',
	    value: function format(val) {
	      return Formats[this.opts.format](val, this.opts);
	    }
	  }]);
	
	  return Formatter;
	}();
	
	var numberformat = new Formatter();
	numberformat.Formatter = Formatter;
	exports.default = numberformat;

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
		"long": [
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

/***/ }
/******/ ])
});
;
//# sourceMappingURL=workspace.js.map