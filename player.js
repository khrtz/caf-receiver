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
    this._setLogger();
    /** DEBUG **/
    this._context.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);

    /** for Touch devices **/
    this._playerData = new cast.framework.ui.PlayerData();
    this._playerDataBinder = new cast.framework.ui.PlayerDataBinder(playerData);
    this._touchControls = cast.framework.ui.Controls.getInstance();
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

  _setBrowseConent() {
    const browseContent = new cast.framework.ui.BrowseContent();
    browseContent.title = 'Up Next';
    browseContent.items = _getBrowseItems();
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

    // Media browse
    // touchControls.setBrowseContent(browseContent);
    // castDebugLogger.info('DEV.LOG', 'browse items', browseItems[0].imageType);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlY2VpdmVyL2luZGV4Lm1qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVjZWl2ZXIvcmVjZWl2ZXItbWFuYWdlci5tanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQXlEOztBQUV6RCxxQkFBcUIscUVBQWU7QUFDcEMsaUI7Ozs7Ozs7Ozs7OztBQ0hBO0FBQUE7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSzs7O0FBR0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDIiwiZmlsZSI6InBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsImltcG9ydCB7IFJlY2VpdmVyTWFuYWdlciB9IGZyb20gJy4vcmVjZWl2ZXItbWFuYWdlci5tanMnO1xuXG5jb25zdCByZWNlaXZlciA9IG5ldyBSZWNlaXZlck1hbmFnZXIoKTtcbnJlY2VpdmVyLnN0YXJ0KCk7IiwiZXhwb3J0IGNsYXNzIFJlY2VpdmVyTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NvbnRleHQgPSBjYXN0LmZyYW1ld29yay5DYXN0UmVjZWl2ZXJDb250ZXh0LmdldEluc3RhbmNlKCk7XG4gICAgdGhpcy5fcGxheWVyID0gdGhpcy5fY29udGV4dC5nZXRQbGF5ZXJNYW5hZ2VyKCk7XG4gICAgdGhpcy5fYWRkTGlzdGVuZXJzKCk7XG4gICAgdGhpcy5fc2V0TG9nZ2VyKCk7XG4gICAgLyoqIERFQlVHICoqL1xuICAgIHRoaXMuX2NvbnRleHQuc2V0TG9nZ2VyTGV2ZWwoY2FzdC5mcmFtZXdvcmsuTG9nZ2VyTGV2ZWwuREVCVUcpO1xuXG4gICAgLyoqIGZvciBUb3VjaCBkZXZpY2VzICoqL1xuICAgIHRoaXMuX3BsYXllckRhdGEgPSBuZXcgY2FzdC5mcmFtZXdvcmsudWkuUGxheWVyRGF0YSgpO1xuICAgIHRoaXMuX3BsYXllckRhdGFCaW5kZXIgPSBuZXcgY2FzdC5mcmFtZXdvcmsudWkuUGxheWVyRGF0YUJpbmRlcihwbGF5ZXJEYXRhKTtcbiAgICB0aGlzLl90b3VjaENvbnRyb2xzID0gY2FzdC5mcmFtZXdvcmsudWkuQ29udHJvbHMuZ2V0SW5zdGFuY2UoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGNvbnN0IHBsYXliYWNrQ29uZmlnID0gbmV3IGNhc3QuZnJhbWV3b3JrLlBsYXliYWNrQ29uZmlnKCk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IG5ldyBjYXN0LmZyYW1ld29yay5DYXN0UmVjZWl2ZXJPcHRpb25zKCk7XG5cbiAgICB0aGlzLl9jb250ZXh0LnN0YXJ0KHtcbiAgICAgIHBsYXliYWNrQ29uZmlnOiBwbGF5YmFja0NvbmZpZyxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICB9KTtcbiAgICB0aGlzLl9jYXN0RGVidWdMb2dnZXIuaW5mbygnTXlBcHAuTE9HJywgJ1NUQVJUJyk7XG4gIH1cblxuICBvbkxvYWQoKSB7XG4gICAgdGhpcy5fY2FzdERlYnVnTG9nZ2VyLmluZm8oJ015QXBwLkxPRycsICdJbnRlcmNlcHRpbmcgTE9BRCByZXF1ZXN0Jyk7XG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgICAvLyBGZXRjaCBjb250ZW50IHJlcG9zaXRvcnkgYnkgcmVxdWVzdGVkIGNvbnRlbnRJZFxuICAgIGFwaUNsaWVudCgnR0VUJywgJ2h0dHA6Ly9jb21tb25kYXRhc3RvcmFnZS5nb29nbGVhcGlzLmNvbS9ndHYtdmlkZW9zLWJ1Y2tldC9iaWdfYnVja19idW5ueV8xMDgwcC5tcDQnKVxuICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIgaXRlbSA9IGRhdGFbcmVxdWVzdC5tZWRpYS5jb250ZW50SWRdO1xuICAgICAgaWYoIWl0ZW0pIHtcbiAgICAgICAgcmVqZWN0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBZGp1c3RpbmcgcmVxdWVzdCB0byBtYWtlIHJlcXVlc3RlZCBjb250ZW50IHBsYXlhYmxlXG4gICAgICAgIHJlcXVlc3QubWVkaWEuY29udGVudElkID0gaXRlbS5zdHJlYW0uaGxzO1xuICAgICAgICByZXF1ZXN0Lm1lZGlhLmNvbnRlbnRUeXBlID0gJ2FwcGxpY2F0aW9uL3gtbXBlZ3VybCc7XG5cbiAgICAgICAgLy8gQWRkIG1ldGFkYXRhXG4gICAgICAgIHZhciBtZXRhZGF0YSA9IG5ldyBjYXN0LmZyYW1ld29yay5tZXNzYWdlcy5NZWRpYU1ldGFkYXRhKCk7XG4gICAgICAgIG1ldGFkYXRhLm1ldGFkYXRhVHlwZSA9IGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLk1ldGFkYXRhVHlwZS5HRU5FUklDO1xuICAgICAgICBtZXRhZGF0YS50aXRsZSA9IGl0ZW0udGl0bGU7XG4gICAgICAgIG1ldGFkYXRhLnN1YnRpdGxlID0gaXRlbS5hdXRob3I7XG5cbiAgICAgICAgcmVxdWVzdC5tZWRpYS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICByZXNvbHZlKHJlcXVlc3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXBpQ2xpZW50KG1ldGhvZCwgdXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsKTtcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB4aHIuc2VuZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgX3Jlc2V0KCkge1xuICAgIHRoaXMuX3BsYXllci5yZXNldCgpO1xuICB9XG5cbiAgX2FkZExpc3RlbmVycygpIHtcbiAgICB0aGlzLl9wbGF5ZXIuc2V0TWVzc2FnZUludGVyY2VwdG9yKFxuICAgICAgY2FzdC5mcmFtZXdvcmsubWVzc2FnZXMuTWVzc2FnZVR5cGUuTE9BRCxcbiAgICAgIHJlcXVlc3QgPT4ge1xuICAgICAgICBpZiAocmVxdWVzdC5tZWRpYSAmJiByZXF1ZXN0Lm1lZGlhLmVudGl0eSkge1xuICAgICAgICAgIHJlcXVlc3QubWVkaWEuY29udGVudElkID0gcmVxdWVzdC5tZWRpYS5lbnRpdHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBpZihyZXF1ZXN0Lm1lZGlhLmNvbnRlbnRUeXBlID09ICd2aWRlby9tcDQnKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShyZXF1ZXN0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5vbkxvYWQoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBcbiAgfVxuXG4gIF9zZXRMb2dnZXIoKSB7XG4gICAgdGhpcy5fY2FzdERlYnVnTG9nZ2VyID0gY2FzdC5kZWJ1Zy5DYXN0RGVidWdMb2dnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICB0aGlzLl9jYXN0RGVidWdMb2dnZXIuc2V0RW5hYmxlZCh0cnVlKTtcbiAgICB0aGlzLl9jYXN0RGVidWdMb2dnZXIuc2hvd0RlYnVnTG9ncyh0cnVlKTtcbiAgICAvLyBTZXQgdmVyYm9zaXR5IGxldmVsIGZvciBjdXN0b20gdGFnc1xuICAgIHRoaXMuX2Nhc3REZWJ1Z0xvZ2dlci5sb2dnZXJMZXZlbEJ5VGFncyA9IHtcbiAgICAgICdFVkVOVC5DT1JFJzogY2FzdC5mcmFtZXdvcmsuTG9nZ2VyTGV2ZWwuREVCVUcsXG4gICAgICAnTXlBUFAuTE9HJzogY2FzdC5mcmFtZXdvcmsuTG9nZ2VyTGV2ZWwuV0FSTklORyxcbiAgICAgIFwiREVWLkxPR1wiOiBjYXN0LmZyYW1ld29yay5Mb2dnZXJMZXZlbC5JTkZPXG4gICAgfTtcbiAgfVxuXG4gIF9nZXRCcm93c2VJdGVtcygpIHtcbiAgICBjb25zdCBicm93c2VJdGVtcyA9IFtdO1xuICAgIG1ha2VSZXF1ZXN0KCdHRVQnLCAnaHR0cHM6Ly90c2Utc3VtbWl0LmZpcmViYXNlaW8uY29tL2NvbnRlbnQuanNvbicpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBuZXcgY2FzdC5mcmFtZXdvcmsudWkuQnJvd3NlSXRlbSgpO1xuICAgICAgICBpdGVtLmVudGl0eSA9IGtleTtcbiAgICAgICAgaXRlbS50aXRsZSA9IGRhdGFba2V5XS50aXRsZTtcbiAgICAgICAgaXRlbS5zdWJ0aXRsZSA9IGRhdGFba2V5XS5kZXNjcmlwdGlvbjtcbiAgICAgICAgaXRlbS5pbWFnZSA9IG5ldyBjYXN0LmZyYW1ld29yay5tZXNzYWdlcy5JbWFnZShkYXRhW2tleV0ucG9zdGVyKTtcbiAgICAgICAgaXRlbS5pbWFnZVR5cGUgPSBjYXN0LmZyYW1ld29yay51aS5Ccm93c2VJbWFnZVR5cGUuTU9WSUU7XG4gICAgICAgIGJyb3dzZUl0ZW1zLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGJyb3dzZUl0ZW1zO1xuICB9XG5cbiAgX3NldEJyb3dzZUNvbmVudCgpIHtcbiAgICBjb25zdCBicm93c2VDb250ZW50ID0gbmV3IGNhc3QuZnJhbWV3b3JrLnVpLkJyb3dzZUNvbnRlbnQoKTtcbiAgICBicm93c2VDb250ZW50LnRpdGxlID0gJ1VwIE5leHQnO1xuICAgIGJyb3dzZUNvbnRlbnQuaXRlbXMgPSBfZ2V0QnJvd3NlSXRlbXMoKTtcbiAgICBicm93c2VDb250ZW50LnRhcmdldEFzcGVjdFJhdGlvID1cbiAgICAgIGNhc3QuZnJhbWV3b3JrLnVpLkJyb3dzZUltYWdlQXNwZWN0UmF0aW8uTEFORFNDQVBFXzE2X1RPXzk7XG5cbiAgICBfdG91Y2hDb250cm9scy5zZXRCcm93c2VDb250ZW50KGJyb3dzZUNvbnRlbnQpO1xuICB9XG5cbiAgX2Fzc2lnblNsb3QoKSB7XG4gICAgLy8gQ2xlYXIgZGVmYXVsdCBidXR0b25zIGFuZCByZS1hc3NpZ25cbiAgICBfdG91Y2hDb250cm9scy5jbGVhckRlZmF1bHRTbG90QXNzaWdubWVudHMoKTsgXG4gICAgLy8gQXNzaWduIGJ1dHRvbnMgdG8gY29udHJvbCBzbG90cy5cbiAgICBjb250cm9scy5hc3NpZ25CdXR0b24oXG4gICAgICBjYXN0LmZyYW1ld29yay51aS5Db250cm9sc1Nsb3QuU0xPVF8xLFxuICAgICAgY2FzdC5mcmFtZXdvcmsudWkuQ29udHJvbHNCdXR0b24uUVVFVUVfUFJFVlxuICAgIClcbiAgICBjb250cm9scy5hc3NpZ25CdXR0b24oXG4gICAgICBjYXN0LmZyYW1ld29yay51aS5Db250cm9sc1Nsb3QuU0xPVF8yLFxuICAgICAgY2FzdC5mcmFtZXdvcmsudWkuQ29udHJvbHNCdXR0b24uQ0FQVElPTlNcbiAgICApXG4gICAgY29udHJvbHMuYXNzaWduQnV0dG9uKFxuICAgICAgY2FzdC5mcmFtZXdvcmsudWkuQ29udHJvbHNTbG90LlNMT1RfMyxcbiAgICAgIGNhc3QuZnJhbWV3b3JrLnVpLkNvbnRyb2xzQnV0dG9uLlNFRUtfRk9SV0FSRF8xNVxuICAgIClcbiAgICBjb250cm9scy5hc3NpZ25CdXR0b24oXG4gICAgICBjYXN0LmZyYW1ld29yay51aS5Db250cm9sc1Nsb3QuU0xPVF80LFxuICAgICAgY2FzdC5mcmFtZXdvcmsudWkuQ29udHJvbHNCdXR0b24uUVVFVUVfTkVYVFxuICAgIClcblxuICAgIC8vIE1lZGlhIGJyb3dzZVxuICAgIC8vIHRvdWNoQ29udHJvbHMuc2V0QnJvd3NlQ29udGVudChicm93c2VDb250ZW50KTtcbiAgICAvLyBjYXN0RGVidWdMb2dnZXIuaW5mbygnREVWLkxPRycsICdicm93c2UgaXRlbXMnLCBicm93c2VJdGVtc1swXS5pbWFnZVR5cGUpO1xuICB9XG59Il0sInNvdXJjZVJvb3QiOiIifQ==