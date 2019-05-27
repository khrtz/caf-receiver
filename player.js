/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/receiver/index.mjs":
/*!********************************!*\
  !*** ./src/receiver/index.mjs ***!
  \********************************/
/*! no exports provided */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _receiver_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./receiver.mjs */ "./src/receiver/receiver.mjs");


new _receiver_mjs__WEBPACK_IMPORTED_MODULE_0__["Receiver"]();

/***/ }),

/***/ "./src/receiver/receiver.mjs":
/*!***********************************!*\
  !*** ./src/receiver/receiver.mjs ***!
  \***********************************/
/*! exports provided: Receiver */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Receiver", function() { return Receiver; });
const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

class Receiver {
  constructor() {
    this._context = cast.framework.CastReceiverContext.getInstance();
    this._player = this._context.getPlayerManager();
    // this._castDebugLogger = this._context.debug.CastDebugLogger.getInstance();
    /** Optimizing for smart displays **/
    // this._playerData = new cast.framework.ui.PlayerData();
    // this._playerDataBinder = new cast.framework.ui.PlayerDataBinder(playerData);
    // this._touchControls = cast.framework.ui.Controls.getInstance();
    this._attachListeners();
    // this._logger = this.castDebugLogger();
  }

  start() {
    const playbackConfig = new cast.framework.PlaybackConfig();
    const options = new cast.framework.CastReceiverOptions();

    this._context.start({
      touchScreenOptimizedApp: true,
      playbackConfig: playbackConfig,
      supportedCommands: cast.framework.messages.Command.ALL_BASIC_MEDIA,
      options: options
    });
  }

  makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });
  }

  onLoad() {
    // this._logger.info('MyApp.LOG', 'Intercepting LOAD request');
    this._reset();

    return new Promise((resolve, reject) => {
      if (request.media.contenType === 'video/mp4') {
        return resolve(request);
      }

      // Fetch content repository by requested contentId
      this.makeRequest('GET', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4')
      .then(function (data) {
        var item = data[request.media.contentId];
        if(!item) {
          // Content could not be found in repository
          // this_logger.error('MyAPP.LOG', 'Content not found');
          reject();
        } else {
          // Adjusting request to make requested content playable
          request.media.contentId = item.stream.hls;
          request.media.contentType = 'application/x-mpegurl';
          // this._logger.warn('MyAPP.LOG', 'Playable URL: ' + request.media.contentId);

          // Add metadata
          var metadata = new cast.framework.messages.MediaMetadata();
          metadata.metadataType = cast.framework.messages.MetadataType.GENERIC;
          metadata.title = item.title;
          metadata.subtitle = item.author;

          request.media.metadata = metadata;
          resolve(request);
        }
    });
    });

    this.start();
  }

  getPlayer() {
    return this._player;
  }

  _reset() {
    this._player.destroy();
  }

  _attachListeners() {
    playerManager.setMessageInterceptor(
      cast.framework.messages.MessageType.LOAD,
      request => {
        // this._logger.info('MyAPP.LOG', 'Intercepting LOAD request');
        if (request.media && request.media.entity) {
          request.media.contentId = request.media.entity;
        }
        this.onLoad();
      });
  }

  castDebugLogger() {
    /** Debug Logger **/
    const castDebugLogger = cast.debug.CastDebugLogger.getInstance();

    // Enable debug logger and show a warning on receiver
    // NOTE: make sure it is disabled on production
    // _logger.setEnabled(true);
    // _logger.showDebugLogs(true);
      
    // _logger.info('DEV.LOG', 'current show', new cast.framework.messages.TvShowMediaMetadata());
    // _logger.info('DEV.LOG', 'uiConfig', new cast.framework.ui.UiConfig());

    playerManager.addEventListener(
      cast.framework.events.category.CORE,
      event => {
          // castDebugLogger.info('EVENT.CORE', event);
    });

    // Set verbosity level for custom tags
    castDebugLogger.loggerLevelByTags = {
        'EVENT.CORE': cast.framework.LoggerLevel.DEBUG,
        'MyAPP.LOG': cast.framework.LoggerLevel.WARNING,
        "DEV.LOG": cast.framework.LoggerLevel.INFO
    };

    return castDebugLogger;
  }
}



/***/ }),

/***/ 0:
/*!**************************************!*\
  !*** multi ./src/receiver/index.mjs ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/a14504/sandbox/caf-receiver/src/receiver/index.mjs */"./src/receiver/index.mjs");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlY2VpdmVyL2luZGV4Lm1qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVjZWl2ZXIvcmVjZWl2ZXIubWpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUEwQzs7QUFFMUMsSUFBSSxzREFBUSxHOzs7Ozs7Ozs7Ozs7QUNGWjtBQUFBO0FBQUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJwbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJpbXBvcnQgeyBSZWNlaXZlciB9IGZyb20gJy4vcmVjZWl2ZXIubWpzJztcblxubmV3IFJlY2VpdmVyKCk7IiwiY29uc3QgY29udGV4dCA9IGNhc3QuZnJhbWV3b3JrLkNhc3RSZWNlaXZlckNvbnRleHQuZ2V0SW5zdGFuY2UoKTtcbmNvbnN0IHBsYXllck1hbmFnZXIgPSBjb250ZXh0LmdldFBsYXllck1hbmFnZXIoKTtcblxuZXhwb3J0IGNsYXNzIFJlY2VpdmVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY29udGV4dCA9IGNhc3QuZnJhbWV3b3JrLkNhc3RSZWNlaXZlckNvbnRleHQuZ2V0SW5zdGFuY2UoKTtcbiAgICB0aGlzLl9wbGF5ZXIgPSB0aGlzLl9jb250ZXh0LmdldFBsYXllck1hbmFnZXIoKTtcbiAgICAvLyB0aGlzLl9jYXN0RGVidWdMb2dnZXIgPSB0aGlzLl9jb250ZXh0LmRlYnVnLkNhc3REZWJ1Z0xvZ2dlci5nZXRJbnN0YW5jZSgpO1xuICAgIC8qKiBPcHRpbWl6aW5nIGZvciBzbWFydCBkaXNwbGF5cyAqKi9cbiAgICAvLyB0aGlzLl9wbGF5ZXJEYXRhID0gbmV3IGNhc3QuZnJhbWV3b3JrLnVpLlBsYXllckRhdGEoKTtcbiAgICAvLyB0aGlzLl9wbGF5ZXJEYXRhQmluZGVyID0gbmV3IGNhc3QuZnJhbWV3b3JrLnVpLlBsYXllckRhdGFCaW5kZXIocGxheWVyRGF0YSk7XG4gICAgLy8gdGhpcy5fdG91Y2hDb250cm9scyA9IGNhc3QuZnJhbWV3b3JrLnVpLkNvbnRyb2xzLmdldEluc3RhbmNlKCk7XG4gICAgdGhpcy5fYXR0YWNoTGlzdGVuZXJzKCk7XG4gICAgLy8gdGhpcy5fbG9nZ2VyID0gdGhpcy5jYXN0RGVidWdMb2dnZXIoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGNvbnN0IHBsYXliYWNrQ29uZmlnID0gbmV3IGNhc3QuZnJhbWV3b3JrLlBsYXliYWNrQ29uZmlnKCk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IG5ldyBjYXN0LmZyYW1ld29yay5DYXN0UmVjZWl2ZXJPcHRpb25zKCk7XG5cbiAgICB0aGlzLl9jb250ZXh0LnN0YXJ0KHtcbiAgICAgIHRvdWNoU2NyZWVuT3B0aW1pemVkQXBwOiB0cnVlLFxuICAgICAgcGxheWJhY2tDb25maWc6IHBsYXliYWNrQ29uZmlnLFxuICAgICAgc3VwcG9ydGVkQ29tbWFuZHM6IGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLkNvbW1hbmQuQUxMX0JBU0lDX01FRElBLFxuICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgIH0pO1xuICB9XG5cbiAgbWFrZVJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwpO1xuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3Qoe1xuICAgICAgICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHhoci5zZW5kKCk7XG4gICAgfSk7XG4gIH1cblxuICBvbkxvYWQoKSB7XG4gICAgLy8gdGhpcy5fbG9nZ2VyLmluZm8oJ015QXBwLkxPRycsICdJbnRlcmNlcHRpbmcgTE9BRCByZXF1ZXN0Jyk7XG4gICAgdGhpcy5fcmVzZXQoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAocmVxdWVzdC5tZWRpYS5jb250ZW5UeXBlID09PSAndmlkZW8vbXA0Jykge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShyZXF1ZXN0KTtcbiAgICAgIH1cblxuICAgICAgLy8gRmV0Y2ggY29udGVudCByZXBvc2l0b3J5IGJ5IHJlcXVlc3RlZCBjb250ZW50SWRcbiAgICAgIHRoaXMubWFrZVJlcXVlc3QoJ0dFVCcsICdodHRwOi8vY29tbW9uZGF0YXN0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vZ3R2LXZpZGVvcy1idWNrZXQvYmlnX2J1Y2tfYnVubnlfMTA4MHAubXA0JylcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciBpdGVtID0gZGF0YVtyZXF1ZXN0Lm1lZGlhLmNvbnRlbnRJZF07XG4gICAgICAgIGlmKCFpdGVtKSB7XG4gICAgICAgICAgLy8gQ29udGVudCBjb3VsZCBub3QgYmUgZm91bmQgaW4gcmVwb3NpdG9yeVxuICAgICAgICAgIC8vIHRoaXNfbG9nZ2VyLmVycm9yKCdNeUFQUC5MT0cnLCAnQ29udGVudCBub3QgZm91bmQnKTtcbiAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBBZGp1c3RpbmcgcmVxdWVzdCB0byBtYWtlIHJlcXVlc3RlZCBjb250ZW50IHBsYXlhYmxlXG4gICAgICAgICAgcmVxdWVzdC5tZWRpYS5jb250ZW50SWQgPSBpdGVtLnN0cmVhbS5obHM7XG4gICAgICAgICAgcmVxdWVzdC5tZWRpYS5jb250ZW50VHlwZSA9ICdhcHBsaWNhdGlvbi94LW1wZWd1cmwnO1xuICAgICAgICAgIC8vIHRoaXMuX2xvZ2dlci53YXJuKCdNeUFQUC5MT0cnLCAnUGxheWFibGUgVVJMOiAnICsgcmVxdWVzdC5tZWRpYS5jb250ZW50SWQpO1xuXG4gICAgICAgICAgLy8gQWRkIG1ldGFkYXRhXG4gICAgICAgICAgdmFyIG1ldGFkYXRhID0gbmV3IGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLk1lZGlhTWV0YWRhdGEoKTtcbiAgICAgICAgICBtZXRhZGF0YS5tZXRhZGF0YVR5cGUgPSBjYXN0LmZyYW1ld29yay5tZXNzYWdlcy5NZXRhZGF0YVR5cGUuR0VORVJJQztcbiAgICAgICAgICBtZXRhZGF0YS50aXRsZSA9IGl0ZW0udGl0bGU7XG4gICAgICAgICAgbWV0YWRhdGEuc3VidGl0bGUgPSBpdGVtLmF1dGhvcjtcblxuICAgICAgICAgIHJlcXVlc3QubWVkaWEubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICByZXNvbHZlKHJlcXVlc3QpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnN0YXJ0KCk7XG4gIH1cblxuICBnZXRQbGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BsYXllcjtcbiAgfVxuXG4gIF9yZXNldCgpIHtcbiAgICB0aGlzLl9wbGF5ZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgX2F0dGFjaExpc3RlbmVycygpIHtcbiAgICBwbGF5ZXJNYW5hZ2VyLnNldE1lc3NhZ2VJbnRlcmNlcHRvcihcbiAgICAgIGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLk1lc3NhZ2VUeXBlLkxPQUQsXG4gICAgICByZXF1ZXN0ID0+IHtcbiAgICAgICAgLy8gdGhpcy5fbG9nZ2VyLmluZm8oJ015QVBQLkxPRycsICdJbnRlcmNlcHRpbmcgTE9BRCByZXF1ZXN0Jyk7XG4gICAgICAgIGlmIChyZXF1ZXN0Lm1lZGlhICYmIHJlcXVlc3QubWVkaWEuZW50aXR5KSB7XG4gICAgICAgICAgcmVxdWVzdC5tZWRpYS5jb250ZW50SWQgPSByZXF1ZXN0Lm1lZGlhLmVudGl0eTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uTG9hZCgpO1xuICAgICAgfSk7XG4gIH1cblxuICBjYXN0RGVidWdMb2dnZXIoKSB7XG4gICAgLyoqIERlYnVnIExvZ2dlciAqKi9cbiAgICBjb25zdCBjYXN0RGVidWdMb2dnZXIgPSBjYXN0LmRlYnVnLkNhc3REZWJ1Z0xvZ2dlci5nZXRJbnN0YW5jZSgpO1xuXG4gICAgLy8gRW5hYmxlIGRlYnVnIGxvZ2dlciBhbmQgc2hvdyBhIHdhcm5pbmcgb24gcmVjZWl2ZXJcbiAgICAvLyBOT1RFOiBtYWtlIHN1cmUgaXQgaXMgZGlzYWJsZWQgb24gcHJvZHVjdGlvblxuICAgIC8vIF9sb2dnZXIuc2V0RW5hYmxlZCh0cnVlKTtcbiAgICAvLyBfbG9nZ2VyLnNob3dEZWJ1Z0xvZ3ModHJ1ZSk7XG4gICAgICBcbiAgICAvLyBfbG9nZ2VyLmluZm8oJ0RFVi5MT0cnLCAnY3VycmVudCBzaG93JywgbmV3IGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLlR2U2hvd01lZGlhTWV0YWRhdGEoKSk7XG4gICAgLy8gX2xvZ2dlci5pbmZvKCdERVYuTE9HJywgJ3VpQ29uZmlnJywgbmV3IGNhc3QuZnJhbWV3b3JrLnVpLlVpQ29uZmlnKCkpO1xuXG4gICAgcGxheWVyTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgY2FzdC5mcmFtZXdvcmsuZXZlbnRzLmNhdGVnb3J5LkNPUkUsXG4gICAgICBldmVudCA9PiB7XG4gICAgICAgICAgLy8gY2FzdERlYnVnTG9nZ2VyLmluZm8oJ0VWRU5ULkNPUkUnLCBldmVudCk7XG4gICAgfSk7XG5cbiAgICAvLyBTZXQgdmVyYm9zaXR5IGxldmVsIGZvciBjdXN0b20gdGFnc1xuICAgIGNhc3REZWJ1Z0xvZ2dlci5sb2dnZXJMZXZlbEJ5VGFncyA9IHtcbiAgICAgICAgJ0VWRU5ULkNPUkUnOiBjYXN0LmZyYW1ld29yay5Mb2dnZXJMZXZlbC5ERUJVRyxcbiAgICAgICAgJ015QVBQLkxPRyc6IGNhc3QuZnJhbWV3b3JrLkxvZ2dlckxldmVsLldBUk5JTkcsXG4gICAgICAgIFwiREVWLkxPR1wiOiBjYXN0LmZyYW1ld29yay5Mb2dnZXJMZXZlbC5JTkZPXG4gICAgfTtcblxuICAgIHJldHVybiBjYXN0RGVidWdMb2dnZXI7XG4gIH1cbn1cblxuIl0sInNvdXJjZVJvb3QiOiIifQ==