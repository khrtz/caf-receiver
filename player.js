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

/***/ "./src/receiver/app.mjs":
/*!******************************!*\
  !*** ./src/receiver/app.mjs ***!
  \******************************/
/*! exports provided: ReceiverManager */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReceiverManager", function() { return ReceiverManager; });
class ReceiverManager {
  constructor() {
    this._context = cast.framework.CastReceiverContext.getInstance();
    this._player = this._context.getPlayerManager();
    this._addListeners();
    this._setLogger();

    /** for Touch devices **/
    const playerData = new cast.framework.ui.PlayerData();
    const playerDataBinder = new cast.framework.ui.PlayerDataBinder(playerData);
    const touchControls = cast.framework.ui.Controls.getInstance();
  }

  start() {
    const playbackConfig = new cast.framework.PlaybackConfig();
    const options = new cast.framework.CastReceiverOptions();

    this._context.start({
      playbackConfig: playbackConfig,
      options: options
    });
    this._castDebugLogger.info('MyApp.LOG', 'START');
  }

  onLoad() {
    this._castDebugLogger.info('MyApp.LOG', 'Intercepting LOAD request');
    this._reset();
    // Fetch content repository by requested contentId
    apiClient('GET', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4')
    .then(function (data) {
      var item = data[request.media.contentId];
      if(!item) {
        reject();
      } else {
        // Adjusting request to make requested content playable
        request.media.contentId = item.stream.hls;
        request.media.contentType = 'application/x-mpegurl';

        // Add metadata
        var metadata = new cast.framework.messages.MediaMetadata();
        metadata.metadataType = cast.framework.messages.MetadataType.GENERIC;
        metadata.title = item.title;
        metadata.subtitle = item.author;

        request.media.metadata = metadata;
        resolve(request);
      }
    });
  }

  apiClient(method, url) {
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

  _reset() {
    this._player.reset();
  }

  _addListeners() {
    this._player.setMessageInterceptor(
      cast.framework.messages.MessageType.LOAD,
      request => {
        if (request.media && request.media.entity) {
          request.media.contentId = request.media.entity;
        }
        return new Promise((resolve, reject) => {
          if(request.media.contentType == 'video/mp4') {
            return resolve(request);
          }
          this.onLoad();
        });
    });
  }

  _setLogger() {
    this._castDebugLogger = cast.debug.CastDebugLogger.getInstance();
    this._castDebugLogger.setEnabled(true);
    this._castDebugLogger.showDebugLogs(true);
    // Set verbosity level for custom tags
    this._castDebugLogger.loggerLevelByTags = {
      'EVENT.CORE': cast.framework.LoggerLevel.DEBUG,
      'MyAPP.LOG': cast.framework.LoggerLevel.WARNING,
      "DEV.LOG": cast.framework.LoggerLevel.INFO
    };
  }

  _getBrowseItems() {
    const browseItems = [];
    makeRequest('GET', 'https://tse-summit.firebaseio.com/content.json')
    .then(function (data) {
      for (let key in data) {
        const item = new cast.framework.ui.BrowseItem();
        item.entity = key;
        item.title = data[key].title;
        item.subtitle = data[key].description;
        item.image = new cast.framework.messages.Image(data[key].poster);
        item.imageType = cast.framework.ui.BrowseImageType.MOVIE;
        browseItems.push(item);
      }
    });
    return browseItems;
  }
}

/***/ }),

/***/ "./src/receiver/index.mjs":
/*!********************************!*\
  !*** ./src/receiver/index.mjs ***!
  \********************************/
/*! no exports provided */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.mjs */ "./src/receiver/app.mjs");


const receiver = new _app_mjs__WEBPACK_IMPORTED_MODULE_0__["ReceiverManager"]();
receiver.start();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlY2VpdmVyL2FwcC5tanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlY2VpdmVyL2luZGV4Lm1qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDMUhBO0FBQUE7QUFBNEM7O0FBRTVDLHFCQUFxQix3REFBZTtBQUNwQyxpQiIsImZpbGUiOiJwbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJleHBvcnQgY2xhc3MgUmVjZWl2ZXJNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY29udGV4dCA9IGNhc3QuZnJhbWV3b3JrLkNhc3RSZWNlaXZlckNvbnRleHQuZ2V0SW5zdGFuY2UoKTtcbiAgICB0aGlzLl9wbGF5ZXIgPSB0aGlzLl9jb250ZXh0LmdldFBsYXllck1hbmFnZXIoKTtcbiAgICB0aGlzLl9hZGRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLl9zZXRMb2dnZXIoKTtcblxuICAgIC8qKiBmb3IgVG91Y2ggZGV2aWNlcyAqKi9cbiAgICBjb25zdCBwbGF5ZXJEYXRhID0gbmV3IGNhc3QuZnJhbWV3b3JrLnVpLlBsYXllckRhdGEoKTtcbiAgICBjb25zdCBwbGF5ZXJEYXRhQmluZGVyID0gbmV3IGNhc3QuZnJhbWV3b3JrLnVpLlBsYXllckRhdGFCaW5kZXIocGxheWVyRGF0YSk7XG4gICAgY29uc3QgdG91Y2hDb250cm9scyA9IGNhc3QuZnJhbWV3b3JrLnVpLkNvbnRyb2xzLmdldEluc3RhbmNlKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjb25zdCBwbGF5YmFja0NvbmZpZyA9IG5ldyBjYXN0LmZyYW1ld29yay5QbGF5YmFja0NvbmZpZygpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBuZXcgY2FzdC5mcmFtZXdvcmsuQ2FzdFJlY2VpdmVyT3B0aW9ucygpO1xuXG4gICAgdGhpcy5fY29udGV4dC5zdGFydCh7XG4gICAgICBwbGF5YmFja0NvbmZpZzogcGxheWJhY2tDb25maWcsXG4gICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgfSk7XG4gICAgdGhpcy5fY2FzdERlYnVnTG9nZ2VyLmluZm8oJ015QXBwLkxPRycsICdTVEFSVCcpO1xuICB9XG5cbiAgb25Mb2FkKCkge1xuICAgIHRoaXMuX2Nhc3REZWJ1Z0xvZ2dlci5pbmZvKCdNeUFwcC5MT0cnLCAnSW50ZXJjZXB0aW5nIExPQUQgcmVxdWVzdCcpO1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgLy8gRmV0Y2ggY29udGVudCByZXBvc2l0b3J5IGJ5IHJlcXVlc3RlZCBjb250ZW50SWRcbiAgICBhcGlDbGllbnQoJ0dFVCcsICdodHRwOi8vY29tbW9uZGF0YXN0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vZ3R2LXZpZGVvcy1idWNrZXQvYmlnX2J1Y2tfYnVubnlfMTA4MHAubXA0JylcbiAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgdmFyIGl0ZW0gPSBkYXRhW3JlcXVlc3QubWVkaWEuY29udGVudElkXTtcbiAgICAgIGlmKCFpdGVtKSB7XG4gICAgICAgIHJlamVjdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQWRqdXN0aW5nIHJlcXVlc3QgdG8gbWFrZSByZXF1ZXN0ZWQgY29udGVudCBwbGF5YWJsZVxuICAgICAgICByZXF1ZXN0Lm1lZGlhLmNvbnRlbnRJZCA9IGl0ZW0uc3RyZWFtLmhscztcbiAgICAgICAgcmVxdWVzdC5tZWRpYS5jb250ZW50VHlwZSA9ICdhcHBsaWNhdGlvbi94LW1wZWd1cmwnO1xuXG4gICAgICAgIC8vIEFkZCBtZXRhZGF0YVxuICAgICAgICB2YXIgbWV0YWRhdGEgPSBuZXcgY2FzdC5mcmFtZXdvcmsubWVzc2FnZXMuTWVkaWFNZXRhZGF0YSgpO1xuICAgICAgICBtZXRhZGF0YS5tZXRhZGF0YVR5cGUgPSBjYXN0LmZyYW1ld29yay5tZXNzYWdlcy5NZXRhZGF0YVR5cGUuR0VORVJJQztcbiAgICAgICAgbWV0YWRhdGEudGl0bGUgPSBpdGVtLnRpdGxlO1xuICAgICAgICBtZXRhZGF0YS5zdWJ0aXRsZSA9IGl0ZW0uYXV0aG9yO1xuXG4gICAgICAgIHJlcXVlc3QubWVkaWEubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgcmVzb2x2ZShyZXF1ZXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFwaUNsaWVudChtZXRob2QsIHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIub3BlbihtZXRob2QsIHVybCk7XG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZWplY3Qoe1xuICAgICAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHRcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgeGhyLnNlbmQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9yZXNldCgpIHtcbiAgICB0aGlzLl9wbGF5ZXIucmVzZXQoKTtcbiAgfVxuXG4gIF9hZGRMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5fcGxheWVyLnNldE1lc3NhZ2VJbnRlcmNlcHRvcihcbiAgICAgIGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLk1lc3NhZ2VUeXBlLkxPQUQsXG4gICAgICByZXF1ZXN0ID0+IHtcbiAgICAgICAgaWYgKHJlcXVlc3QubWVkaWEgJiYgcmVxdWVzdC5tZWRpYS5lbnRpdHkpIHtcbiAgICAgICAgICByZXF1ZXN0Lm1lZGlhLmNvbnRlbnRJZCA9IHJlcXVlc3QubWVkaWEuZW50aXR5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgaWYocmVxdWVzdC5tZWRpYS5jb250ZW50VHlwZSA9PSAndmlkZW8vbXA0Jykge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocmVxdWVzdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMub25Mb2FkKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgX3NldExvZ2dlcigpIHtcbiAgICB0aGlzLl9jYXN0RGVidWdMb2dnZXIgPSBjYXN0LmRlYnVnLkNhc3REZWJ1Z0xvZ2dlci5nZXRJbnN0YW5jZSgpO1xuICAgIHRoaXMuX2Nhc3REZWJ1Z0xvZ2dlci5zZXRFbmFibGVkKHRydWUpO1xuICAgIHRoaXMuX2Nhc3REZWJ1Z0xvZ2dlci5zaG93RGVidWdMb2dzKHRydWUpO1xuICAgIC8vIFNldCB2ZXJib3NpdHkgbGV2ZWwgZm9yIGN1c3RvbSB0YWdzXG4gICAgdGhpcy5fY2FzdERlYnVnTG9nZ2VyLmxvZ2dlckxldmVsQnlUYWdzID0ge1xuICAgICAgJ0VWRU5ULkNPUkUnOiBjYXN0LmZyYW1ld29yay5Mb2dnZXJMZXZlbC5ERUJVRyxcbiAgICAgICdNeUFQUC5MT0cnOiBjYXN0LmZyYW1ld29yay5Mb2dnZXJMZXZlbC5XQVJOSU5HLFxuICAgICAgXCJERVYuTE9HXCI6IGNhc3QuZnJhbWV3b3JrLkxvZ2dlckxldmVsLklORk9cbiAgICB9O1xuICB9XG5cbiAgX2dldEJyb3dzZUl0ZW1zKCkge1xuICAgIGNvbnN0IGJyb3dzZUl0ZW1zID0gW107XG4gICAgbWFrZVJlcXVlc3QoJ0dFVCcsICdodHRwczovL3RzZS1zdW1taXQuZmlyZWJhc2Vpby5jb20vY29udGVudC5qc29uJylcbiAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IG5ldyBjYXN0LmZyYW1ld29yay51aS5Ccm93c2VJdGVtKCk7XG4gICAgICAgIGl0ZW0uZW50aXR5ID0ga2V5O1xuICAgICAgICBpdGVtLnRpdGxlID0gZGF0YVtrZXldLnRpdGxlO1xuICAgICAgICBpdGVtLnN1YnRpdGxlID0gZGF0YVtrZXldLmRlc2NyaXB0aW9uO1xuICAgICAgICBpdGVtLmltYWdlID0gbmV3IGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLkltYWdlKGRhdGFba2V5XS5wb3N0ZXIpO1xuICAgICAgICBpdGVtLmltYWdlVHlwZSA9IGNhc3QuZnJhbWV3b3JrLnVpLkJyb3dzZUltYWdlVHlwZS5NT1ZJRTtcbiAgICAgICAgYnJvd3NlSXRlbXMucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYnJvd3NlSXRlbXM7XG4gIH1cbn0iLCJpbXBvcnQgeyBSZWNlaXZlck1hbmFnZXIgfSBmcm9tICcuL2FwcC5tanMnO1xuXG5jb25zdCByZWNlaXZlciA9IG5ldyBSZWNlaXZlck1hbmFnZXIoKTtcbnJlY2VpdmVyLnN0YXJ0KCk7Il0sInNvdXJjZVJvb3QiOiIifQ==