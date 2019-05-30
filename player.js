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
/* harmony import */ var _receiver_manager_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./receiver-manager.mjs */ "./src/receiver/receiver-manager.mjs");


const receiver = new _receiver_manager_mjs__WEBPACK_IMPORTED_MODULE_0__["ReceiverManager"]();
receiver.start();

/***/ }),

/***/ "./src/receiver/receiver-manager.mjs":
/*!*******************************************!*\
  !*** ./src/receiver/receiver-manager.mjs ***!
  \*******************************************/
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
    this._enableLogger();
    /** DEBUG **/
    this._context.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
    /** for Touch devices **/
    // this._playerData = new cast.framework.ui.PlayerData();
    // this._playerDataBinder = new cast.framework.ui.PlayerDataBinder(this._playerData);
    // this._touchControls = new cast.framework.ui.Controls.getInstance();
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

  onLoadMedia(request) {
    this._castDebugLogger.info('MyApp.LOG', 'Intercepting LOAD request');
    // this._reset();
    // Fetch content repository by requested contentId
    this._castDebugLogger.info('MyApp.LOG', 'contentId', request.media.contentId);
    this.apiClient('GET', 'https://tse-summit.firebaseio.com/content.json?orderBy=%22$key%22&equalTo=%22'+ request.media.contentId + '%22')
    .then(function (data) {
      const item = data[request.media.contentId];
      if(!item) {
        this._castDebugLogger.info('MyApp.LOG', 'not item');
        reject();
      } else {
        // Adjusting request to make requested content playable
        // request.media.contentId = item.stream.hls;
        // request.media.contentType = 'application/x-mpegurl';

        // // Add metadata
        // const metadata = new cast.framework.messages.MediaMetadata();
        // metadata.metadataType = cast.framework.messages.MetadataType.GENERIC;
        // metadata.title = item.title;
        // metadata.subtitle = item.author;

        // request.media.metadata = metadata;
        this._castDebugLogger.info('MyApp.LOG', 'request', request.media.metadata);
        resolve(request);
      }
    });
  }

  apiClient(method, url) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
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
    // this._castDebugLogger.info('MyApp.LOG', 'add listeners');
    this._player.setMessageInterceptor(
      cast.framework.messages.MessageType.LOAD,
      request => {
        if (request.media && request.media.entity) {
          this._castDebugLogger.info('MyApp.LOG', 'request');
          request.media.contentId = request.media.entity;
        }
        return new Promise((resolve, reject) => {
          if(request.media.contentType == 'video/mp4') {
            this._castDebugLogger.info('MyApp.LOG', 'promise');
            return resolve(request);
          }
          this._castDebugLogger.info('MyApp.LOG', 'load media');
          this.onLoadMedia(request);
        });
    });
  }

  _enableLogger() {
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

  _setBrowseConent() {
    const browseContent = new cast.framework.ui.BrowseContent();
    browseContent.title = 'Up Next';
    browseContent.items = this._getBrowseItems();
    browseContent.targetAspectRatio =
      cast.framework.ui.BrowseImageAspectRatio.LANDSCAPE_16_TO_9;

    _touchControls.setBrowseContent(browseContent);
  }

  _assignSlot() {
    // Clear default buttons and re-assign
    _touchControls.clearDefaultSlotAssignments(); 
    // Assign buttons to control slots.
    controls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_1,
      cast.framework.ui.ControlsButton.QUEUE_PREV
    )
    controls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_2,
      cast.framework.ui.ControlsButton.CAPTIONS
    )
    controls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_3,
      cast.framework.ui.ControlsButton.SEEK_FORWARD_15
    )
    controls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_4,
      cast.framework.ui.ControlsButton.QUEUE_NEXT
    )
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlY2VpdmVyL2luZGV4Lm1qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVjZWl2ZXIvcmVjZWl2ZXItbWFuYWdlci5tanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQXlEOztBQUV6RCxxQkFBcUIscUVBQWU7QUFDcEMsaUI7Ozs7Ozs7Ozs7OztBQ0hBO0FBQUE7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQyIsImZpbGUiOiJwbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJpbXBvcnQgeyBSZWNlaXZlck1hbmFnZXIgfSBmcm9tICcuL3JlY2VpdmVyLW1hbmFnZXIubWpzJztcblxuY29uc3QgcmVjZWl2ZXIgPSBuZXcgUmVjZWl2ZXJNYW5hZ2VyKCk7XG5yZWNlaXZlci5zdGFydCgpOyIsImV4cG9ydCBjbGFzcyBSZWNlaXZlck1hbmFnZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jb250ZXh0ID0gY2FzdC5mcmFtZXdvcmsuQ2FzdFJlY2VpdmVyQ29udGV4dC5nZXRJbnN0YW5jZSgpO1xuICAgIHRoaXMuX3BsYXllciA9IHRoaXMuX2NvbnRleHQuZ2V0UGxheWVyTWFuYWdlcigpO1xuICAgIHRoaXMuX2FkZExpc3RlbmVycygpO1xuICAgIHRoaXMuX2VuYWJsZUxvZ2dlcigpO1xuICAgIC8qKiBERUJVRyAqKi9cbiAgICB0aGlzLl9jb250ZXh0LnNldExvZ2dlckxldmVsKGNhc3QuZnJhbWV3b3JrLkxvZ2dlckxldmVsLkRFQlVHKTtcbiAgICAvKiogZm9yIFRvdWNoIGRldmljZXMgKiovXG4gICAgLy8gdGhpcy5fcGxheWVyRGF0YSA9IG5ldyBjYXN0LmZyYW1ld29yay51aS5QbGF5ZXJEYXRhKCk7XG4gICAgLy8gdGhpcy5fcGxheWVyRGF0YUJpbmRlciA9IG5ldyBjYXN0LmZyYW1ld29yay51aS5QbGF5ZXJEYXRhQmluZGVyKHRoaXMuX3BsYXllckRhdGEpO1xuICAgIC8vIHRoaXMuX3RvdWNoQ29udHJvbHMgPSBuZXcgY2FzdC5mcmFtZXdvcmsudWkuQ29udHJvbHMuZ2V0SW5zdGFuY2UoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGNvbnN0IHBsYXliYWNrQ29uZmlnID0gbmV3IGNhc3QuZnJhbWV3b3JrLlBsYXliYWNrQ29uZmlnKCk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IG5ldyBjYXN0LmZyYW1ld29yay5DYXN0UmVjZWl2ZXJPcHRpb25zKCk7XG5cbiAgICB0aGlzLl9jb250ZXh0LnN0YXJ0KHtcbiAgICAgIHBsYXliYWNrQ29uZmlnOiBwbGF5YmFja0NvbmZpZyxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICB9KTtcbiAgICB0aGlzLl9jYXN0RGVidWdMb2dnZXIuaW5mbygnTXlBcHAuTE9HJywgJ1NUQVJUJyk7XG4gIH1cblxuICBvbkxvYWRNZWRpYShyZXF1ZXN0KSB7XG4gICAgdGhpcy5fY2FzdERlYnVnTG9nZ2VyLmluZm8oJ015QXBwLkxPRycsICdJbnRlcmNlcHRpbmcgTE9BRCByZXF1ZXN0Jyk7XG4gICAgLy8gdGhpcy5fcmVzZXQoKTtcbiAgICAvLyBGZXRjaCBjb250ZW50IHJlcG9zaXRvcnkgYnkgcmVxdWVzdGVkIGNvbnRlbnRJZFxuICAgIHRoaXMuX2Nhc3REZWJ1Z0xvZ2dlci5pbmZvKCdNeUFwcC5MT0cnLCAnY29udGVudElkJywgcmVxdWVzdC5tZWRpYS5jb250ZW50SWQpO1xuICAgIHRoaXMuYXBpQ2xpZW50KCdHRVQnLCAnaHR0cHM6Ly90c2Utc3VtbWl0LmZpcmViYXNlaW8uY29tL2NvbnRlbnQuanNvbj9vcmRlckJ5PSUyMiRrZXklMjImZXF1YWxUbz0lMjInKyByZXF1ZXN0Lm1lZGlhLmNvbnRlbnRJZCArICclMjInKVxuICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBjb25zdCBpdGVtID0gZGF0YVtyZXF1ZXN0Lm1lZGlhLmNvbnRlbnRJZF07XG4gICAgICBpZighaXRlbSkge1xuICAgICAgICB0aGlzLl9jYXN0RGVidWdMb2dnZXIuaW5mbygnTXlBcHAuTE9HJywgJ25vdCBpdGVtJyk7XG4gICAgICAgIHJlamVjdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQWRqdXN0aW5nIHJlcXVlc3QgdG8gbWFrZSByZXF1ZXN0ZWQgY29udGVudCBwbGF5YWJsZVxuICAgICAgICAvLyByZXF1ZXN0Lm1lZGlhLmNvbnRlbnRJZCA9IGl0ZW0uc3RyZWFtLmhscztcbiAgICAgICAgLy8gcmVxdWVzdC5tZWRpYS5jb250ZW50VHlwZSA9ICdhcHBsaWNhdGlvbi94LW1wZWd1cmwnO1xuXG4gICAgICAgIC8vIC8vIEFkZCBtZXRhZGF0YVxuICAgICAgICAvLyBjb25zdCBtZXRhZGF0YSA9IG5ldyBjYXN0LmZyYW1ld29yay5tZXNzYWdlcy5NZWRpYU1ldGFkYXRhKCk7XG4gICAgICAgIC8vIG1ldGFkYXRhLm1ldGFkYXRhVHlwZSA9IGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLk1ldGFkYXRhVHlwZS5HRU5FUklDO1xuICAgICAgICAvLyBtZXRhZGF0YS50aXRsZSA9IGl0ZW0udGl0bGU7XG4gICAgICAgIC8vIG1ldGFkYXRhLnN1YnRpdGxlID0gaXRlbS5hdXRob3I7XG5cbiAgICAgICAgLy8gcmVxdWVzdC5tZWRpYS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICB0aGlzLl9jYXN0RGVidWdMb2dnZXIuaW5mbygnTXlBcHAuTE9HJywgJ3JlcXVlc3QnLCByZXF1ZXN0Lm1lZGlhLm1ldGFkYXRhKTtcbiAgICAgICAgcmVzb2x2ZShyZXF1ZXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFwaUNsaWVudChtZXRob2QsIHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsKTtcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB4aHIuc2VuZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgX3Jlc2V0KCkge1xuICAgIHRoaXMuX3BsYXllci5yZXNldCgpO1xuICB9XG5cbiAgX2FkZExpc3RlbmVycygpIHtcbiAgICAvLyB0aGlzLl9jYXN0RGVidWdMb2dnZXIuaW5mbygnTXlBcHAuTE9HJywgJ2FkZCBsaXN0ZW5lcnMnKTtcbiAgICB0aGlzLl9wbGF5ZXIuc2V0TWVzc2FnZUludGVyY2VwdG9yKFxuICAgICAgY2FzdC5mcmFtZXdvcmsubWVzc2FnZXMuTWVzc2FnZVR5cGUuTE9BRCxcbiAgICAgIHJlcXVlc3QgPT4ge1xuICAgICAgICBpZiAocmVxdWVzdC5tZWRpYSAmJiByZXF1ZXN0Lm1lZGlhLmVudGl0eSkge1xuICAgICAgICAgIHRoaXMuX2Nhc3REZWJ1Z0xvZ2dlci5pbmZvKCdNeUFwcC5MT0cnLCAncmVxdWVzdCcpO1xuICAgICAgICAgIHJlcXVlc3QubWVkaWEuY29udGVudElkID0gcmVxdWVzdC5tZWRpYS5lbnRpdHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBpZihyZXF1ZXN0Lm1lZGlhLmNvbnRlbnRUeXBlID09ICd2aWRlby9tcDQnKSB7XG4gICAgICAgICAgICB0aGlzLl9jYXN0RGVidWdMb2dnZXIuaW5mbygnTXlBcHAuTE9HJywgJ3Byb21pc2UnKTtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHJlcXVlc3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9jYXN0RGVidWdMb2dnZXIuaW5mbygnTXlBcHAuTE9HJywgJ2xvYWQgbWVkaWEnKTtcbiAgICAgICAgICB0aGlzLm9uTG9hZE1lZGlhKHJlcXVlc3QpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIF9lbmFibGVMb2dnZXIoKSB7XG4gICAgdGhpcy5fY2FzdERlYnVnTG9nZ2VyID0gY2FzdC5kZWJ1Zy5DYXN0RGVidWdMb2dnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICB0aGlzLl9jYXN0RGVidWdMb2dnZXIuc2V0RW5hYmxlZCh0cnVlKTtcbiAgICB0aGlzLl9jYXN0RGVidWdMb2dnZXIuc2hvd0RlYnVnTG9ncyh0cnVlKTtcbiAgICAvLyBTZXQgdmVyYm9zaXR5IGxldmVsIGZvciBjdXN0b20gdGFnc1xuICAgIHRoaXMuX2Nhc3REZWJ1Z0xvZ2dlci5sb2dnZXJMZXZlbEJ5VGFncyA9IHtcbiAgICAgICdFVkVOVC5DT1JFJzogY2FzdC5mcmFtZXdvcmsuTG9nZ2VyTGV2ZWwuREVCVUcsXG4gICAgICAnTXlBUFAuTE9HJzogY2FzdC5mcmFtZXdvcmsuTG9nZ2VyTGV2ZWwuV0FSTklORyxcbiAgICAgIFwiREVWLkxPR1wiOiBjYXN0LmZyYW1ld29yay5Mb2dnZXJMZXZlbC5JTkZPXG4gICAgfTtcbiAgfVxuXG4gIF9nZXRCcm93c2VJdGVtcygpIHtcbiAgICBjb25zdCBicm93c2VJdGVtcyA9IFtdO1xuICAgIG1ha2VSZXF1ZXN0KCdHRVQnLCAnaHR0cHM6Ly90c2Utc3VtbWl0LmZpcmViYXNlaW8uY29tL2NvbnRlbnQuanNvbicpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBuZXcgY2FzdC5mcmFtZXdvcmsudWkuQnJvd3NlSXRlbSgpO1xuICAgICAgICBpdGVtLmVudGl0eSA9IGtleTtcbiAgICAgICAgaXRlbS50aXRsZSA9IGRhdGFba2V5XS50aXRsZTtcbiAgICAgICAgaXRlbS5zdWJ0aXRsZSA9IGRhdGFba2V5XS5kZXNjcmlwdGlvbjtcbiAgICAgICAgaXRlbS5pbWFnZSA9IG5ldyBjYXN0LmZyYW1ld29yay5tZXNzYWdlcy5JbWFnZShkYXRhW2tleV0ucG9zdGVyKTtcbiAgICAgICAgaXRlbS5pbWFnZVR5cGUgPSBjYXN0LmZyYW1ld29yay51aS5Ccm93c2VJbWFnZVR5cGUuTU9WSUU7XG4gICAgICAgIGJyb3dzZUl0ZW1zLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGJyb3dzZUl0ZW1zO1xuICB9XG5cbiAgX3NldEJyb3dzZUNvbmVudCgpIHtcbiAgICBjb25zdCBicm93c2VDb250ZW50ID0gbmV3IGNhc3QuZnJhbWV3b3JrLnVpLkJyb3dzZUNvbnRlbnQoKTtcbiAgICBicm93c2VDb250ZW50LnRpdGxlID0gJ1VwIE5leHQnO1xuICAgIGJyb3dzZUNvbnRlbnQuaXRlbXMgPSB0aGlzLl9nZXRCcm93c2VJdGVtcygpO1xuICAgIGJyb3dzZUNvbnRlbnQudGFyZ2V0QXNwZWN0UmF0aW8gPVxuICAgICAgY2FzdC5mcmFtZXdvcmsudWkuQnJvd3NlSW1hZ2VBc3BlY3RSYXRpby5MQU5EU0NBUEVfMTZfVE9fOTtcblxuICAgIF90b3VjaENvbnRyb2xzLnNldEJyb3dzZUNvbnRlbnQoYnJvd3NlQ29udGVudCk7XG4gIH1cblxuICBfYXNzaWduU2xvdCgpIHtcbiAgICAvLyBDbGVhciBkZWZhdWx0IGJ1dHRvbnMgYW5kIHJlLWFzc2lnblxuICAgIF90b3VjaENvbnRyb2xzLmNsZWFyRGVmYXVsdFNsb3RBc3NpZ25tZW50cygpOyBcbiAgICAvLyBBc3NpZ24gYnV0dG9ucyB0byBjb250cm9sIHNsb3RzLlxuICAgIGNvbnRyb2xzLmFzc2lnbkJ1dHRvbihcbiAgICAgIGNhc3QuZnJhbWV3b3JrLnVpLkNvbnRyb2xzU2xvdC5TTE9UXzEsXG4gICAgICBjYXN0LmZyYW1ld29yay51aS5Db250cm9sc0J1dHRvbi5RVUVVRV9QUkVWXG4gICAgKVxuICAgIGNvbnRyb2xzLmFzc2lnbkJ1dHRvbihcbiAgICAgIGNhc3QuZnJhbWV3b3JrLnVpLkNvbnRyb2xzU2xvdC5TTE9UXzIsXG4gICAgICBjYXN0LmZyYW1ld29yay51aS5Db250cm9sc0J1dHRvbi5DQVBUSU9OU1xuICAgIClcbiAgICBjb250cm9scy5hc3NpZ25CdXR0b24oXG4gICAgICBjYXN0LmZyYW1ld29yay51aS5Db250cm9sc1Nsb3QuU0xPVF8zLFxuICAgICAgY2FzdC5mcmFtZXdvcmsudWkuQ29udHJvbHNCdXR0b24uU0VFS19GT1JXQVJEXzE1XG4gICAgKVxuICAgIGNvbnRyb2xzLmFzc2lnbkJ1dHRvbihcbiAgICAgIGNhc3QuZnJhbWV3b3JrLnVpLkNvbnRyb2xzU2xvdC5TTE9UXzQsXG4gICAgICBjYXN0LmZyYW1ld29yay51aS5Db250cm9sc0J1dHRvbi5RVUVVRV9ORVhUXG4gICAgKVxuICB9XG59Il0sInNvdXJjZVJvb3QiOiIifQ==