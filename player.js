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


const receivery = new _receiver_mjs__WEBPACK_IMPORTED_MODULE_0__["Receiver"];

_receiver_mjs__WEBPACK_IMPORTED_MODULE_0__["Receiver"].start;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlY2VpdmVyL2luZGV4Lm1qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVjZWl2ZXIvcmVjZWl2ZXIubWpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUEwQzs7QUFFMUMsc0JBQXNCLHNEQUFROztBQUU5QixzREFBUSxPOzs7Ozs7Ozs7Ozs7QUNKUjtBQUFBO0FBQUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJwbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJpbXBvcnQgeyBSZWNlaXZlciB9IGZyb20gJy4vcmVjZWl2ZXIubWpzJztcblxuY29uc3QgcmVjZWl2ZXJ5ID0gbmV3IFJlY2VpdmVyO1xuXG5SZWNlaXZlci5zdGFydDsiLCJjb25zdCBjb250ZXh0ID0gY2FzdC5mcmFtZXdvcmsuQ2FzdFJlY2VpdmVyQ29udGV4dC5nZXRJbnN0YW5jZSgpO1xuY29uc3QgcGxheWVyTWFuYWdlciA9IGNvbnRleHQuZ2V0UGxheWVyTWFuYWdlcigpO1xuXG5leHBvcnQgY2xhc3MgUmVjZWl2ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jb250ZXh0ID0gY2FzdC5mcmFtZXdvcmsuQ2FzdFJlY2VpdmVyQ29udGV4dC5nZXRJbnN0YW5jZSgpO1xuICAgIHRoaXMuX3BsYXllciA9IHRoaXMuX2NvbnRleHQuZ2V0UGxheWVyTWFuYWdlcigpO1xuICAgIC8vIHRoaXMuX2Nhc3REZWJ1Z0xvZ2dlciA9IHRoaXMuX2NvbnRleHQuZGVidWcuQ2FzdERlYnVnTG9nZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgLyoqIE9wdGltaXppbmcgZm9yIHNtYXJ0IGRpc3BsYXlzICoqL1xuICAgIC8vIHRoaXMuX3BsYXllckRhdGEgPSBuZXcgY2FzdC5mcmFtZXdvcmsudWkuUGxheWVyRGF0YSgpO1xuICAgIC8vIHRoaXMuX3BsYXllckRhdGFCaW5kZXIgPSBuZXcgY2FzdC5mcmFtZXdvcmsudWkuUGxheWVyRGF0YUJpbmRlcihwbGF5ZXJEYXRhKTtcbiAgICAvLyB0aGlzLl90b3VjaENvbnRyb2xzID0gY2FzdC5mcmFtZXdvcmsudWkuQ29udHJvbHMuZ2V0SW5zdGFuY2UoKTtcbiAgICB0aGlzLl9hdHRhY2hMaXN0ZW5lcnMoKTtcbiAgICAvLyB0aGlzLl9sb2dnZXIgPSB0aGlzLmNhc3REZWJ1Z0xvZ2dlcigpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgY29uc3QgcGxheWJhY2tDb25maWcgPSBuZXcgY2FzdC5mcmFtZXdvcmsuUGxheWJhY2tDb25maWcoKTtcbiAgICBjb25zdCBvcHRpb25zID0gbmV3IGNhc3QuZnJhbWV3b3JrLkNhc3RSZWNlaXZlck9wdGlvbnMoKTtcblxuICAgIHRoaXMuX2NvbnRleHQuc3RhcnQoe1xuICAgICAgdG91Y2hTY3JlZW5PcHRpbWl6ZWRBcHA6IHRydWUsXG4gICAgICBwbGF5YmFja0NvbmZpZzogcGxheWJhY2tDb25maWcsXG4gICAgICBzdXBwb3J0ZWRDb21tYW5kczogY2FzdC5mcmFtZXdvcmsubWVzc2FnZXMuQ29tbWFuZC5BTExfQkFTSUNfTUVESUEsXG4gICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgfSk7XG4gIH1cblxuICBtYWtlUmVxdWVzdChtZXRob2QsIHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIub3BlbihtZXRob2QsIHVybCk7XG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZWplY3Qoe1xuICAgICAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHRcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgeGhyLnNlbmQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTG9hZCgpIHtcbiAgICAvLyB0aGlzLl9sb2dnZXIuaW5mbygnTXlBcHAuTE9HJywgJ0ludGVyY2VwdGluZyBMT0FEIHJlcXVlc3QnKTtcbiAgICB0aGlzLl9yZXNldCgpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChyZXF1ZXN0Lm1lZGlhLmNvbnRlblR5cGUgPT09ICd2aWRlby9tcDQnKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKHJlcXVlc3QpO1xuICAgICAgfVxuXG4gICAgICAvLyBGZXRjaCBjb250ZW50IHJlcG9zaXRvcnkgYnkgcmVxdWVzdGVkIGNvbnRlbnRJZFxuICAgICAgdGhpcy5tYWtlUmVxdWVzdCgnR0VUJywgJ2h0dHA6Ly9jb21tb25kYXRhc3RvcmFnZS5nb29nbGVhcGlzLmNvbS9ndHYtdmlkZW9zLWJ1Y2tldC9iaWdfYnVja19idW5ueV8xMDgwcC5tcDQnKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBkYXRhW3JlcXVlc3QubWVkaWEuY29udGVudElkXTtcbiAgICAgICAgaWYoIWl0ZW0pIHtcbiAgICAgICAgICAvLyBDb250ZW50IGNvdWxkIG5vdCBiZSBmb3VuZCBpbiByZXBvc2l0b3J5XG4gICAgICAgICAgLy8gdGhpc19sb2dnZXIuZXJyb3IoJ015QVBQLkxPRycsICdDb250ZW50IG5vdCBmb3VuZCcpO1xuICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEFkanVzdGluZyByZXF1ZXN0IHRvIG1ha2UgcmVxdWVzdGVkIGNvbnRlbnQgcGxheWFibGVcbiAgICAgICAgICByZXF1ZXN0Lm1lZGlhLmNvbnRlbnRJZCA9IGl0ZW0uc3RyZWFtLmhscztcbiAgICAgICAgICByZXF1ZXN0Lm1lZGlhLmNvbnRlbnRUeXBlID0gJ2FwcGxpY2F0aW9uL3gtbXBlZ3VybCc7XG4gICAgICAgICAgLy8gdGhpcy5fbG9nZ2VyLndhcm4oJ015QVBQLkxPRycsICdQbGF5YWJsZSBVUkw6ICcgKyByZXF1ZXN0Lm1lZGlhLmNvbnRlbnRJZCk7XG5cbiAgICAgICAgICAvLyBBZGQgbWV0YWRhdGFcbiAgICAgICAgICB2YXIgbWV0YWRhdGEgPSBuZXcgY2FzdC5mcmFtZXdvcmsubWVzc2FnZXMuTWVkaWFNZXRhZGF0YSgpO1xuICAgICAgICAgIG1ldGFkYXRhLm1ldGFkYXRhVHlwZSA9IGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLk1ldGFkYXRhVHlwZS5HRU5FUklDO1xuICAgICAgICAgIG1ldGFkYXRhLnRpdGxlID0gaXRlbS50aXRsZTtcbiAgICAgICAgICBtZXRhZGF0YS5zdWJ0aXRsZSA9IGl0ZW0uYXV0aG9yO1xuXG4gICAgICAgICAgcmVxdWVzdC5tZWRpYS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgIHJlc29sdmUocmVxdWVzdCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFBsYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5fcGxheWVyO1xuICB9XG5cbiAgX3Jlc2V0KCkge1xuICAgIHRoaXMuX3BsYXllci5kZXN0cm95KCk7XG4gIH1cblxuICBfYXR0YWNoTGlzdGVuZXJzKCkge1xuICAgIHBsYXllck1hbmFnZXIuc2V0TWVzc2FnZUludGVyY2VwdG9yKFxuICAgICAgY2FzdC5mcmFtZXdvcmsubWVzc2FnZXMuTWVzc2FnZVR5cGUuTE9BRCxcbiAgICAgIHJlcXVlc3QgPT4ge1xuICAgICAgICAvLyB0aGlzLl9sb2dnZXIuaW5mbygnTXlBUFAuTE9HJywgJ0ludGVyY2VwdGluZyBMT0FEIHJlcXVlc3QnKTtcbiAgICAgICAgaWYgKHJlcXVlc3QubWVkaWEgJiYgcmVxdWVzdC5tZWRpYS5lbnRpdHkpIHtcbiAgICAgICAgICByZXF1ZXN0Lm1lZGlhLmNvbnRlbnRJZCA9IHJlcXVlc3QubWVkaWEuZW50aXR5O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub25Mb2FkKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGNhc3REZWJ1Z0xvZ2dlcigpIHtcbiAgICAvKiogRGVidWcgTG9nZ2VyICoqL1xuICAgIGNvbnN0IGNhc3REZWJ1Z0xvZ2dlciA9IGNhc3QuZGVidWcuQ2FzdERlYnVnTG9nZ2VyLmdldEluc3RhbmNlKCk7XG5cbiAgICAvLyBFbmFibGUgZGVidWcgbG9nZ2VyIGFuZCBzaG93IGEgd2FybmluZyBvbiByZWNlaXZlclxuICAgIC8vIE5PVEU6IG1ha2Ugc3VyZSBpdCBpcyBkaXNhYmxlZCBvbiBwcm9kdWN0aW9uXG4gICAgLy8gX2xvZ2dlci5zZXRFbmFibGVkKHRydWUpO1xuICAgIC8vIF9sb2dnZXIuc2hvd0RlYnVnTG9ncyh0cnVlKTtcbiAgICAgIFxuICAgIC8vIF9sb2dnZXIuaW5mbygnREVWLkxPRycsICdjdXJyZW50IHNob3cnLCBuZXcgY2FzdC5mcmFtZXdvcmsubWVzc2FnZXMuVHZTaG93TWVkaWFNZXRhZGF0YSgpKTtcbiAgICAvLyBfbG9nZ2VyLmluZm8oJ0RFVi5MT0cnLCAndWlDb25maWcnLCBuZXcgY2FzdC5mcmFtZXdvcmsudWkuVWlDb25maWcoKSk7XG5cbiAgICBwbGF5ZXJNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBjYXN0LmZyYW1ld29yay5ldmVudHMuY2F0ZWdvcnkuQ09SRSxcbiAgICAgIGV2ZW50ID0+IHtcbiAgICAgICAgICAvLyBjYXN0RGVidWdMb2dnZXIuaW5mbygnRVZFTlQuQ09SRScsIGV2ZW50KTtcbiAgICB9KTtcblxuICAgIC8vIFNldCB2ZXJib3NpdHkgbGV2ZWwgZm9yIGN1c3RvbSB0YWdzXG4gICAgY2FzdERlYnVnTG9nZ2VyLmxvZ2dlckxldmVsQnlUYWdzID0ge1xuICAgICAgICAnRVZFTlQuQ09SRSc6IGNhc3QuZnJhbWV3b3JrLkxvZ2dlckxldmVsLkRFQlVHLFxuICAgICAgICAnTXlBUFAuTE9HJzogY2FzdC5mcmFtZXdvcmsuTG9nZ2VyTGV2ZWwuV0FSTklORyxcbiAgICAgICAgXCJERVYuTE9HXCI6IGNhc3QuZnJhbWV3b3JrLkxvZ2dlckxldmVsLklORk9cbiAgICB9O1xuXG4gICAgcmV0dXJuIGNhc3REZWJ1Z0xvZ2dlcjtcbiAgfVxufVxuXG4iXSwic291cmNlUm9vdCI6IiJ9