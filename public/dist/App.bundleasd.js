/******/ (function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function (exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        /******/ configurable: false,
        /******/ enumerable: true,
        /******/ get: getter,
        /******/
      });
      /******/
    }
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function (module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module["default"];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, "a", getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
  /******/
  /******/ /******/ return __webpack_require__((__webpack_require__.s = 21));
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var _typeof =
        typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
          ? function (obj) {
              return typeof obj;
            }
          : function (obj) {
              return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
            };

      var bind = __webpack_require__(7);
      var isBuffer = __webpack_require__(30);

      /*global toString:true*/

      // utils is a library of generic helper functions non-specific to axios

      var toString = Object.prototype.toString;

      /**
       * Determine if a value is an Array
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is an Array, otherwise false
       */
      function isArray(val) {
        return toString.call(val) === "[object Array]";
      }

      /**
       * Determine if a value is an ArrayBuffer
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is an ArrayBuffer, otherwise false
       */
      function isArrayBuffer(val) {
        return toString.call(val) === "[object ArrayBuffer]";
      }

      /**
       * Determine if a value is a FormData
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is an FormData, otherwise false
       */
      function isFormData(val) {
        return typeof FormData !== "undefined" && val instanceof FormData;
      }

      /**
       * Determine if a value is a view on an ArrayBuffer
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
       */
      function isArrayBufferView(val) {
        var result;
        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
          result = ArrayBuffer.isView(val);
        } else {
          result = val && val.buffer && val.buffer instanceof ArrayBuffer;
        }
        return result;
      }

      /**
       * Determine if a value is a String
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a String, otherwise false
       */
      function isString(val) {
        return typeof val === "string";
      }

      /**
       * Determine if a value is a Number
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Number, otherwise false
       */
      function isNumber(val) {
        return typeof val === "number";
      }

      /**
       * Determine if a value is undefined
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if the value is undefined, otherwise false
       */
      function isUndefined(val) {
        return typeof val === "undefined";
      }

      /**
       * Determine if a value is an Object
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is an Object, otherwise false
       */
      function isObject(val) {
        return (
          val !== null &&
          (typeof val === "undefined" ? "undefined" : _typeof(val)) === "object"
        );
      }

      /**
       * Determine if a value is a Date
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Date, otherwise false
       */
      function isDate(val) {
        return toString.call(val) === "[object Date]";
      }

      /**
       * Determine if a value is a File
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a File, otherwise false
       */
      function isFile(val) {
        return toString.call(val) === "[object File]";
      }

      /**
       * Determine if a value is a Blob
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Blob, otherwise false
       */
      function isBlob(val) {
        return toString.call(val) === "[object Blob]";
      }

      /**
       * Determine if a value is a Function
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Function, otherwise false
       */
      function isFunction(val) {
        return toString.call(val) === "[object Function]";
      }

      /**
       * Determine if a value is a Stream
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Stream, otherwise false
       */
      function isStream(val) {
        return isObject(val) && isFunction(val.pipe);
      }

      /**
       * Determine if a value is a URLSearchParams object
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a URLSearchParams object, otherwise false
       */
      function isURLSearchParams(val) {
        return (
          typeof URLSearchParams !== "undefined" &&
          val instanceof URLSearchParams
        );
      }

      /**
       * Trim excess whitespace off the beginning and end of a string
       *
       * @param {String} str The String to trim
       * @returns {String} The String freed of excess whitespace
       */
      function trim(str) {
        return str.replace(/^\s*/, "").replace(/\s*$/, "");
      }

      /**
       * Determine if we're running in a standard browser environment
       *
       * This allows axios to run in a web worker, and react-native.
       * Both environments support XMLHttpRequest, but not fully standard globals.
       *
       * web workers:
       *  typeof window -> undefined
       *  typeof document -> undefined
       *
       * react-native:
       *  navigator.product -> 'ReactNative'
       * nativescript
       *  navigator.product -> 'NativeScript' or 'NS'
       */
      function isStandardBrowserEnv() {
        if (
          typeof navigator !== "undefined" &&
          (navigator.product === "ReactNative" ||
            navigator.product === "NativeScript" ||
            navigator.product === "NS")
        ) {
          return false;
        }
        return typeof window !== "undefined" && typeof document !== "undefined";
      }

      /**
       * Iterate over an Array or an Object invoking a function for each item.
       *
       * If `obj` is an Array callback will be called passing
       * the value, index, and complete array for each item.
       *
       * If 'obj' is an Object callback will be called passing
       * the value, key, and complete object for each property.
       *
       * @param {Object|Array} obj The object to iterate
       * @param {Function} fn The callback to invoke for each item
       */
      function forEach(obj, fn) {
        // Don't bother if no value provided
        if (obj === null || typeof obj === "undefined") {
          return;
        }

        // Force an array if not already something iterable
        if (
          (typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object"
        ) {
          /*eslint no-param-reassign:0*/
          obj = [obj];
        }

        if (isArray(obj)) {
          // Iterate over array values
          for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
          }
        } else {
          // Iterate over object keys
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              fn.call(null, obj[key], key, obj);
            }
          }
        }
      }

      /**
       * Accepts varargs expecting each argument to be an object, then
       * immutably merges the properties of each object and returns result.
       *
       * When multiple objects contain the same key the later object in
       * the arguments list will take precedence.
       *
       * Example:
       *
       * ```js
       * var result = merge({foo: 123}, {foo: 456});
       * console.log(result.foo); // outputs 456
       * ```
       *
       * @param {Object} obj1 Object to merge
       * @returns {Object} Result of all merge properties
       */
      function merge() /* obj1, obj2, obj3, ... */ {
        var result = {};
        function assignValue(val, key) {
          if (
            _typeof(result[key]) === "object" &&
            (typeof val === "undefined" ? "undefined" : _typeof(val)) ===
              "object"
          ) {
            result[key] = merge(result[key], val);
          } else {
            result[key] = val;
          }
        }

        for (var i = 0, l = arguments.length; i < l; i++) {
          forEach(arguments[i], assignValue);
        }
        return result;
      }

      /**
       * Function equal to merge with the difference being that no reference
       * to original objects is kept.
       *
       * @see merge
       * @param {Object} obj1 Object to merge
       * @returns {Object} Result of all merge properties
       */
      function deepMerge() /* obj1, obj2, obj3, ... */ {
        var result = {};
        function assignValue(val, key) {
          if (
            _typeof(result[key]) === "object" &&
            (typeof val === "undefined" ? "undefined" : _typeof(val)) ===
              "object"
          ) {
            result[key] = deepMerge(result[key], val);
          } else if (
            (typeof val === "undefined" ? "undefined" : _typeof(val)) ===
            "object"
          ) {
            result[key] = deepMerge({}, val);
          } else {
            result[key] = val;
          }
        }

        for (var i = 0, l = arguments.length; i < l; i++) {
          forEach(arguments[i], assignValue);
        }
        return result;
      }

      /**
       * Extends object a by mutably adding to it the properties of object b.
       *
       * @param {Object} a The object to be extended
       * @param {Object} b The object to copy properties from
       * @param {Object} thisArg The object to bind function to
       * @return {Object} The resulting value of object a
       */
      function extend(a, b, thisArg) {
        forEach(b, function assignValue(val, key) {
          if (thisArg && typeof val === "function") {
            a[key] = bind(val, thisArg);
          } else {
            a[key] = val;
          }
        });
        return a;
      }

      module.exports = {
        isArray: isArray,
        isArrayBuffer: isArrayBuffer,
        isBuffer: isBuffer,
        isFormData: isFormData,
        isArrayBufferView: isArrayBufferView,
        isString: isString,
        isNumber: isNumber,
        isObject: isObject,
        isUndefined: isUndefined,
        isDate: isDate,
        isFile: isFile,
        isBlob: isBlob,
        isFunction: isFunction,
        isStream: isStream,
        isURLSearchParams: isURLSearchParams,
        isStandardBrowserEnv: isStandardBrowserEnv,
        forEach: forEach,
        merge: merge,
        deepMerge: deepMerge,
        extend: extend,
        trim: trim,
      };

      /***/
    },
    /* 1 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _axios = __webpack_require__(5);

      var _axios2 = _interopRequireDefault(_axios);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function ajaxGetData(url) {
        // e.preventDefault();

        var result = _axios2.default
          .get(url)
          .then(function (response) {
            // returning the data here allows the caller to get it through another .then(...)
            //console.log(response.data);
            return response.data;
          })
          .catch(function (error) {
            // handle error
            return error.response;
          })
          .finally(function () {});

        return result;
      }

      exports.default = ajaxGetData;

      /***/
    },
    /* 2 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _typeof =
        typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
          ? function (obj) {
              return typeof obj;
            }
          : function (obj) {
              return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
            };

      exports.get = get;
      exports.has = has;
      exports.valueByString = valueByString;
      exports.toFormData = toFormData;
      exports.formatDate = formatDate;
      exports.formatDatetime = formatDatetime;
      exports.bindValue = bindValue;
      exports.activeModel = activeModel;
      exports.uniqueid = uniqueid;
      /* 
 To get nested object properties.
 admin = {
    location: {
        lat: 50,
        long: 9
    }
 }

 get(admin, 'location.lat')     // 50
 get(admin, 'location.foo.bar') // undefined
*/

      function get(obj, key) {
        return key.split(".").reduce(function (o, x) {
          return o === undefined || o === null ? o : o[x];
        }, obj);

        // key.split('.').reduce(function(o, x) {
        //     return (o === undefined || o === null) ? o : o[x];
        //   }, obj);
      }

      Object.byString = function (o, s) {
        s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
        s = s.replace(/^\./, ""); // strip a leading dot
        var a = s.split(".");
        for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i];
          if (o != null) {
            if (k in o) {
              o = o[k];
            } else {
              return;
            }
          } else {
            return;
          }
        }
        return o;
      };

      /* 
 To check only if a property exists, without getting its value. It similer get function.
*/
      function has(obj, key) {
        return key.split(".").every(function (x) {
          if (
            (typeof obj === "undefined" ? "undefined" : _typeof(obj)) !=
              "object" ||
            obj === null ||
            x in obj === false
          )
            /// !x in obj or  x in obj === true *** if you find any bug
            return false;
          obj = obj[x];
          return true;
        });
      }

      /* 
 convert indexes to properties
*/
      function valueByString(obj, string, devider) {
        if (devider == undefined) {
          devider = "|";
        }
        return string
          .split(devider)
          .map(function (key) {
            return get(obj, key);
          })
          .join(" ");
      }

      /*
 Submit multi-part form using ajax.
*/
      function toFormData(form) {
        var formData = new FormData();
        var elements = form.querySelectorAll("input, select, textarea");
        for (var i = 0; i < elements.length; ++i) {
          var element = elements[i];
          var name = element.name;

          if (name && element.dataset.disabled != "true") {
            if (element.type == "file") {
              var file = element.files[0];
              formData.append(name, file);
            } else {
              var value = element.value;
              if (value && value.trim()) {
                formData.append(name, value);
              }
            }
          }
        }

        return formData;
      }

      /*
 Format Date to display admin
*/
      function formatDate(param) {
        var date = new Date(param);
        var day = date.getDate().toString();
        var month = (date.getMonth() + 1).toString();
        var year = date.getFullYear();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        var fullDate = day + "/" + month + "/" + year;
        return fullDate;
      }

      /*
 Format Datetime to display admin
*/
      function formatDatetime(param) {
        var time = new Date(param).toLocaleTimeString();
        return formatDate(param) + " " + time;
      }

      /*
 Set object value in html
*/
      function bindValue(obj, parentElement) {
        parentElement
          .querySelectorAll("[data-property]")
          .forEach(function (element) {
            var type = element.dataset.type;
            var value = valueByString(obj, element.dataset.property);
            console.log({ type: type });
            switch (type) {
              case "date":
                value = formatDate(value);
                break;

              case "datetime":
                value = formatDatetime(value);
                break;

              case "currency":
                value = value
                  .toFixed(2)
                  .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                break;

              default:
                break;
            }
            element.innerHTML = value;
          });
      }

      function activeModel(params) {
        var models = document.querySelectorAll(".model");
        [].forEach.call(models, function (model) {
          model.classList.add("hidden");
        });
        var model = document.querySelector(
          '.model[data-model="' + params + '"]'
        );
        if (model) {
          model.classList.remove("hidden");
        }
      }

      function uniqueid() {
        // always start with a letter (for DOM friendlyness)
        var idstr = String.fromCharCode(Math.floor(Math.random() * 25 + 65));
        do {
          // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
          var ascicode = Math.floor(Math.random() * 42 + 48);
          if (ascicode < 58 || ascicode > 64) {
            // exclude all chars between : (58) and @ (64)
            idstr += String.fromCharCode(ascicode);
          }
        } while (idstr.length < 32);

        return idstr;
      }

      /***/
    },
    /* 3 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      // lib from https://github.com/zenorocha/delegate/

      var DOCUMENT_NODE_TYPE = 9;

      /**
       * A polyfill for Element.matches()
       */
      if (typeof Element !== "undefined" && !Element.prototype.matches) {
        var proto = Element.prototype;

        proto.matches =
          proto.matchesSelector ||
          proto.mozMatchesSelector ||
          proto.msMatchesSelector ||
          proto.oMatchesSelector ||
          proto.webkitMatchesSelector;
      }

      function closest(element, selector) {
        while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
          if (
            typeof element.matches === "function" &&
            element.matches(selector)
          ) {
            return element;
          }
          element = element.parentNode;
        }
      }

      function _delegate(element, selector, type, callback, useCapture) {
        var listenerFn = listener.apply(this, arguments);

        element.addEventListener(type, listenerFn, useCapture);

        return {
          destroy: function destroy() {
            element.removeEventListener(type, listenerFn, useCapture);
          },
        };
      }

      function delegate(elements, selector, type, callback, useCapture) {
        // Handle the regular Element usage
        if (typeof elements.addEventListener === "function") {
          return _delegate.apply(null, arguments);
        }

        // Handle Element-less usage, it defaults to global delegation
        if (typeof type === "function") {
          // Use `document` as the first parameter, then apply arguments
          // This is a short way to .unshift `arguments` without running into deoptimizations
          return _delegate.bind(null, document).apply(null, arguments);
        }

        // Handle Selector-based usage
        if (typeof elements === "string") {
          elements = document.querySelectorAll(elements);
        }

        // Handle Array-like based usage
        return Array.prototype.map.call(elements, function (element) {
          return _delegate(element, selector, type, callback, useCapture);
        });
      }

      function listener(element, selector, type, callback) {
        return function (e) {
          e.delegateTarget = closest(e.target, selector);

          if (e.delegateTarget) {
            callback.call(element, e);
          }
        };
      }

      module.exports = delegate;

      /***/
    },
    /* 4 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      function activeTab() {
        var filter =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {};

        //console.log(component);
        var tabs = document.querySelectorAll(".tab-content");
        var tabLinks = document.querySelectorAll(".tab-link");
        var edits = document.querySelectorAll(".edit");
        var reads = document.querySelectorAll(".read");
        var accordions = document.querySelectorAll(".accordionForm");
        var panels = document.querySelectorAll(
          '.component[data-component="panel"]'
        );

        [].forEach.call(panels, function (panel) {
          panel.querySelector(".panel").classList.remove("hide");
          panel.querySelector(".panelButton").classList.remove("panelHidden");
          document.querySelector(".content").classList.remove("wide");
        });

        [].forEach.call(tabs, function (tab) {
          tab.classList.remove("is-active");
        });
        [].forEach.call(tabLinks, function (tabLink) {
          tabLink.classList.remove("is-active");
        });

        [].forEach.call(tabs, function () {
          tabs[0].classList.add("is-active");
        });
        [].forEach.call(tabLinks, function () {
          tabLinks[0].classList.add("is-active");
        });

        if (filter.includes("read")) {
          [].forEach.call(edits, function (edit) {
            edit.classList.add("hidden");
          });
          [].forEach.call(reads, function (read) {
            read.classList.remove("hidden");
          });
        }
        if (filter.includes("edit")) {
          [].forEach.call(reads, function (read) {
            read.classList.add("hidden");
          });
          [].forEach.call(edits, function (edit) {
            edit.classList.remove("hidden");
          });
        }

        [].forEach.call(accordions, function () {
          accordions[0].classList.add("disabled");
        });
      }
      exports.default = activeTab;

      /***/
    },
    /* 5 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      module.exports = __webpack_require__(29);

      /***/
    },
    /* 6 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _ajaxGetData = __webpack_require__(1);

      var _ajaxGetData2 = _interopRequireDefault(_ajaxGetData);

      var _viewItem = __webpack_require__(15);

      var _viewItem2 = _interopRequireDefault(_viewItem);

      var _editItem = __webpack_require__(17);

      var _editItem2 = _interopRequireDefault(_editItem);

      var _removeItem = __webpack_require__(18);

      var _removeItem2 = _interopRequireDefault(_removeItem);

      var _delegate = __webpack_require__(3);

      var _delegate2 = _interopRequireDefault(_delegate);

      var _helper = __webpack_require__(2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var render = {
        grid: function grid(res, table, col) {
          console.log(res);
          var datas = res.data;
          var paginationData = res.pagination;

          table.querySelector("ul.tableBody").innerHTML = "";
          table.querySelector("#pagination .prev").dataset.action = "";
          table.querySelector("#pagination .next").dataset.action = "";

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (
              var _iterator = datas[Symbol.iterator](), _step;
              !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
              _iteratorNormalCompletion = true
            ) {
              var data = _step.value;

              var listItem = document.createElement("li");
              listItem.dataset.id = data._id;
              var orgdropdown = table.querySelector(".dropdown");
              var dropdown = orgdropdown.cloneNode(true);
              dropdown.querySelector("li.remove").dataset.id = data._id;
              dropdown.querySelector("li.remove").dataset.displayLabel = (0,
              _helper.valueByString)(
                data,
                dropdown.querySelector("li.remove").dataset.label || ""
              );
              dropdown.querySelector("li.edit").dataset.id = data._id;
              dropdown.querySelector("li.read").dataset.id = data._id;

              for (var i = 0; i < col.length; ++i) {
                var variable = (0, _helper.valueByString)(data, col[i]);

                listItem.appendChild(
                  document.createElement("p")
                ).textContent = variable;
              }
              listItem.appendChild(dropdown).classList.remove("hidden");

              table.querySelector("ul.tableBody").appendChild(listItem);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          var prev = "";
          if (paginationData.page > 1) {
            prev = parseInt(paginationData.page) - 1;
          } else prev = "";
          table.querySelector("#pagination .prev").dataset.action =
            table.dataset.action + prev;
          var next = "";
          if (paginationData.page < paginationData.pages) {
            next = parseInt(paginationData.page) + 1;
          } else next = "";
          table.querySelector("#pagination .next").dataset.action =
            table.dataset.action + next;
        },
        pagination: function pagination(res, table) {
          var paginationData = res.pagination;

          table.querySelector("#pagination ul.pages").innerHTML = "";

          for (var i = 1; i <= paginationData.pages; ++i) {
            var listPag = document.createElement("li");
            listPag.innerHTML = i;
            listPag.dataset.action = table.dataset.action + i;

            if (i === paginationData.page) {
              listPag.classList.add("active");
            }
            table.querySelector("#pagination ul.pages").appendChild(listPag);
          }
        },
        activePagination: function activePagination(page) {
          var i = page;
          var pag = document.querySelectorAll("#pagination ul.pages li");
          for (var _i = 0; _i < pag.length; ++_i) {
            pag[_i].classList.remove("active");
          }
          pag[i - 1].classList.add("active");
        },
      };

      var dataGrid = {
        init: function init(component, tableName, panelFormName) {
          var form = document.querySelector(panelFormName);
          var table = component.querySelector(tableName);
          var col = JSON.parse(table.dataset.col);
          var actionEdit = table.dataset.show;
          var actionRead = table.dataset.show;
          var removeUrl = table.dataset.remove;
          var viewType = table.dataset.viewtype;
          var searchInput = document.querySelector(
            '.component[data-component="search-input"]'
          );

          var action = table.dataset.action;
          var result = (0, _ajaxGetData2.default)(action);

          result.then(function (res) {
            render.grid(res, table, col);
            render.pagination(res, table);
          });

          (0, _delegate2.default)(
            document.body,
            ".tableBody li .dropdown .edit",
            "click",
            function (e) {
              console.log("delegate .edit");
              var actionClic = actionEdit + e.delegateTarget.dataset.id;
              (0, _editItem2.default)(
                actionClic,
                form,
                e.delegateTarget.dataset.id
              );
            },
            false
          );

          (0, _delegate2.default)(
            document.body,
            ".tableBody li .dropdown .read",
            "click",
            function (e) {
              console.log("delegate .read");
              (0, _viewItem2.default)(
                actionRead + e.delegateTarget.dataset.id,
                viewType
              );
            },
            false
          );

          (0, _delegate2.default)(
            document.body,
            ".tableBody li .dropdown .remove",
            "click",
            function (e) {
              console.log("delegate .remove");
              var removeAction = removeUrl + e.delegateTarget.dataset.id;
              var displayLabel = e.delegateTarget.dataset.displayLabel;
              (0, _removeItem2.default)(removeAction, displayLabel);
            },
            false
          );

          (0, _delegate2.default)(
            document.body,
            "#pagination ul.pages li",
            "click",
            function (e) {
              var actionClic = e.delegateTarget.dataset.action;
              var result = (0, _ajaxGetData2.default)(actionClic);
              result.then(function (res) {
                render.grid(res, table, col);
                render.activePagination(res.pagination.page);
              });
            },
            false
          );

          table.querySelector("#pagination .next").addEventListener(
            "click",
            function () {
              console.log("#pagination .next");
              var actionClic = this.dataset.action;
              var result = (0, _ajaxGetData2.default)(actionClic);
              result.then(function (res) {
                render.grid(res, table, col);
                render.activePagination(res.pagination.page);
              });
            },
            false
          );

          table.querySelector("#pagination .prev").addEventListener(
            "click",
            function () {
              console.log("#pagination .prev");
              var actionClic = this.dataset.action;
              var result = (0, _ajaxGetData2.default)(actionClic);
              result.then(function (res) {
                render.grid(res, table, col);
                render.activePagination(res.pagination.page);
              });
            },
            false
          );
          if (searchInput) {
            searchInput.addEventListener(
              "select",
              function (event) {
                var url = searchInput.dataset.read;
                var detail = event.detail;

                (0, _viewItem2.default)(url + detail.id, viewType);
              },
              false
            );
          } else {
            console.error(
              'cant find .component[data-component="search-input"]'
            );
          }
        },

        refresh: function refresh(component) {
          var table = component.querySelector(".table");
          var col = JSON.parse(table.dataset.col);
          var currentActivePage = document.querySelector(
            "#pagination ul.pages li.active"
          );
          if (currentActivePage) {
            var actionClic = currentActivePage.dataset.action;
            var result = (0, _ajaxGetData2.default)(actionClic);
            result.then(function (res) {
              render.grid(res, table, col);
              render.pagination(res, table);
              render.activePagination(res.pagination.page);
            });
          }
        },
      };
      exports.default = dataGrid;

      /***/
    },
    /* 7 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      module.exports = function bind(fn, thisArg) {
        return function wrap() {
          var args = new Array(arguments.length);
          for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
          }
          return fn.apply(thisArg, args);
        };
      };

      /***/
    },
    /* 8 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var utils = __webpack_require__(0);

      function encode(val) {
        return encodeURIComponent(val)
          .replace(/%40/gi, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",")
          .replace(/%20/g, "+")
          .replace(/%5B/gi, "[")
          .replace(/%5D/gi, "]");
      }

      /**
       * Build a URL by appending params to the end
       *
       * @param {string} url The base of the url (e.g., http://www.google.com)
       * @param {object} [params] The params to be appended
       * @returns {string} The formatted url
       */
      module.exports = function buildURL(url, params, paramsSerializer) {
        /*eslint no-param-reassign:0*/
        if (!params) {
          return url;
        }

        var serializedParams;
        if (paramsSerializer) {
          serializedParams = paramsSerializer(params);
        } else if (utils.isURLSearchParams(params)) {
          serializedParams = params.toString();
        } else {
          var parts = [];

          utils.forEach(params, function serialize(val, key) {
            if (val === null || typeof val === "undefined") {
              return;
            }

            if (utils.isArray(val)) {
              key = key + "[]";
            } else {
              val = [val];
            }

            utils.forEach(val, function parseValue(v) {
              if (utils.isDate(v)) {
                v = v.toISOString();
              } else if (utils.isObject(v)) {
                v = JSON.stringify(v);
              }
              parts.push(encode(key) + "=" + encode(v));
            });
          });

          serializedParams = parts.join("&");
        }

        if (serializedParams) {
          var hashmarkIndex = url.indexOf("#");
          if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex);
          }

          url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
        }

        return url;
      };

      /***/
    },
    /* 9 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      module.exports = function isCancel(value) {
        return !!(value && value.__CANCEL__);
      };

      /***/
    },
    /* 10 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";
      /* WEBPACK VAR INJECTION */ (function (process) {
        var utils = __webpack_require__(0);
        var normalizeHeaderName = __webpack_require__(36);

        var DEFAULT_CONTENT_TYPE = {
          "Content-Type": "application/x-www-form-urlencoded",
        };

        function setContentTypeIfUnset(headers, value) {
          if (
            !utils.isUndefined(headers) &&
            utils.isUndefined(headers["Content-Type"])
          ) {
            headers["Content-Type"] = value;
          }
        }

        function getDefaultAdapter() {
          var adapter;
          // Only Node.JS has a process variable that is of [[Class]] process
          if (
            typeof process !== "undefined" &&
            Object.prototype.toString.call(process) === "[object process]"
          ) {
            // For node use HTTP adapter
            adapter = __webpack_require__(11);
          } else if (typeof XMLHttpRequest !== "undefined") {
            // For browsers use XHR adapter
            adapter = __webpack_require__(11);
          }
          return adapter;
        }

        var defaults = {
          adapter: getDefaultAdapter(),

          transformRequest: [
            function transformRequest(data, headers) {
              normalizeHeaderName(headers, "Accept");
              normalizeHeaderName(headers, "Content-Type");
              if (
                utils.isFormData(data) ||
                utils.isArrayBuffer(data) ||
                utils.isBuffer(data) ||
                utils.isStream(data) ||
                utils.isFile(data) ||
                utils.isBlob(data)
              ) {
                return data;
              }
              if (utils.isArrayBufferView(data)) {
                return data.buffer;
              }
              if (utils.isURLSearchParams(data)) {
                setContentTypeIfUnset(
                  headers,
                  "application/x-www-form-urlencoded;charset=utf-8"
                );
                return data.toString();
              }
              if (utils.isObject(data)) {
                setContentTypeIfUnset(
                  headers,
                  "application/json;charset=utf-8"
                );
                return JSON.stringify(data);
              }
              return data;
            },
          ],

          transformResponse: [
            function transformResponse(data) {
              /*eslint no-param-reassign:0*/
              if (typeof data === "string") {
                try {
                  data = JSON.parse(data);
                } catch (e) {
                  /* Ignore */
                }
              }
              return data;
            },
          ],

          /**
           * A timeout in milliseconds to abort a request. If set to 0 (default) a
           * timeout is not created.
           */
          timeout: 0,

          xsrfCookieName: "XSRF-TOKEN",
          xsrfHeaderName: "X-XSRF-TOKEN",

          maxContentLength: -1,

          validateStatus: function validateStatus(status) {
            return status >= 200 && status < 300;
          },
        };

        defaults.headers = {
          common: {
            Accept: "application/json, text/plain, */*",
          },
        };

        utils.forEach(["delete", "get", "head"], function forEachMethodNoData(
          method
        ) {
          defaults.headers[method] = {};
        });

        utils.forEach(["post", "put", "patch"], function forEachMethodWithData(
          method
        ) {
          defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
        });

        module.exports = defaults;
        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(35)));

      /***/
    },
    /* 11 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var utils = __webpack_require__(0);
      var settle = __webpack_require__(37);
      var buildURL = __webpack_require__(8);
      var parseHeaders = __webpack_require__(39);
      var isURLSameOrigin = __webpack_require__(40);
      var createError = __webpack_require__(12);

      module.exports = function xhrAdapter(config) {
        return new Promise(function dispatchXhrRequest(resolve, reject) {
          var requestData = config.data;
          var requestHeaders = config.headers;

          if (utils.isFormData(requestData)) {
            delete requestHeaders["Content-Type"]; // Let the browser set it
          }

          var request = new XMLHttpRequest();

          // HTTP basic authentication
          if (config.auth) {
            var adminname = config.auth.adminname || "";
            var password = config.auth.password || "";
            requestHeaders.Authorization =
              "Basic " + btoa(adminname + ":" + password);
          }

          request.open(
            config.method.toUpperCase(),
            buildURL(config.url, config.params, config.paramsSerializer),
            true
          );

          // Set the request timeout in MS
          request.timeout = config.timeout;

          // Listen for ready state
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (
              request.status === 0 &&
              !(
                request.responseURL &&
                request.responseURL.indexOf("file:") === 0
              )
            ) {
              return;
            }

            // Prepare the response
            var responseHeaders =
              "getAllResponseHeaders" in request
                ? parseHeaders(request.getAllResponseHeaders())
                : null;
            var responseData =
              !config.responseType || config.responseType === "text"
                ? request.responseText
                : request.response;
            var response = {
              data: responseData,
              status: request.status,
              statusText: request.statusText,
              headers: responseHeaders,
              config: config,
              request: request,
            };

            settle(resolve, reject, response);

            // Clean up request
            request = null;
          };

          // Handle browser request cancellation (as opposed to a manual cancellation)
          request.onabort = function handleAbort() {
            if (!request) {
              return;
            }

            reject(
              createError("Request aborted", config, "ECONNABORTED", request)
            );

            // Clean up request
            request = null;
          };

          // Handle low level network errors
          request.onerror = function handleError() {
            // Real errors are hidden from us by the browser
            // onerror should only fire if it's a network error
            reject(createError("Network Error", config, null, request));

            // Clean up request
            request = null;
          };

          // Handle timeout
          request.ontimeout = function handleTimeout() {
            reject(
              createError(
                "timeout of " + config.timeout + "ms exceeded",
                config,
                "ECONNABORTED",
                request
              )
            );

            // Clean up request
            request = null;
          };

          // Add xsrf header
          // This is only done if running in a standard browser environment.
          // Specifically not if we're in a web worker, or react-native.
          if (utils.isStandardBrowserEnv()) {
            var cookies = __webpack_require__(41);

            // Add xsrf header
            var xsrfValue =
              (config.withCredentials || isURLSameOrigin(config.url)) &&
              config.xsrfCookieName
                ? cookies.read(config.xsrfCookieName)
                : undefined;

            if (xsrfValue) {
              requestHeaders[config.xsrfHeaderName] = xsrfValue;
            }
          }

          // Add headers to the request
          if ("setRequestHeader" in request) {
            utils.forEach(requestHeaders, function setRequestHeader(val, key) {
              if (
                typeof requestData === "undefined" &&
                key.toLowerCase() === "content-type"
              ) {
                // Remove Content-Type if data is undefined
                delete requestHeaders[key];
              } else {
                // Otherwise add header to the request
                request.setRequestHeader(key, val);
              }
            });
          }

          // Add withCredentials to request if needed
          if (config.withCredentials) {
            request.withCredentials = true;
          }

          // Add responseType to request if needed
          if (config.responseType) {
            try {
              request.responseType = config.responseType;
            } catch (e) {
              // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
              // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
              if (config.responseType !== "json") {
                throw e;
              }
            }
          }

          // Handle progress if needed
          if (typeof config.onDownloadProgress === "function") {
            request.addEventListener("progress", config.onDownloadProgress);
          }

          // Not all browsers support upload events
          if (typeof config.onUploadProgress === "function" && request.upload) {
            request.upload.addEventListener(
              "progress",
              config.onUploadProgress
            );
          }

          if (config.cancelToken) {
            // Handle cancellation
            config.cancelToken.promise.then(function onCanceled(cancel) {
              if (!request) {
                return;
              }

              request.abort();
              reject(cancel);
              // Clean up request
              request = null;
            });
          }

          if (requestData === undefined) {
            requestData = null;
          }

          // Send the request
          request.send(requestData);
        });
      };

      /***/
    },
    /* 12 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var enhanceError = __webpack_require__(38);

      /**
       * Create an Error with the specified message, config, error code, request and response.
       *
       * @param {string} message The error message.
       * @param {Object} config The config.
       * @param {string} [code] The error code (for example, 'ECONNABORTED').
       * @param {Object} [request] The request.
       * @param {Object} [response] The response.
       * @returns {Error} The created error.
       */
      module.exports = function createError(
        message,
        config,
        code,
        request,
        response
      ) {
        var error = new Error(message);
        return enhanceError(error, config, code, request, response);
      };

      /***/
    },
    /* 13 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var utils = __webpack_require__(0);

      /**
       * Config-specific merge-function which creates a new config-object
       * by merging two configuration objects together.
       *
       * @param {Object} config1
       * @param {Object} config2
       * @returns {Object} New object resulting from merging config2 to config1
       */
      module.exports = function mergeConfig(config1, config2) {
        // eslint-disable-next-line no-param-reassign
        config2 = config2 || {};
        var config = {};

        utils.forEach(
          ["url", "method", "params", "data"],
          function valueFromConfig2(prop) {
            if (typeof config2[prop] !== "undefined") {
              config[prop] = config2[prop];
            }
          }
        );

        utils.forEach(
          ["headers", "auth", "proxy"],
          function mergeDeepProperties(prop) {
            if (utils.isObject(config2[prop])) {
              config[prop] = utils.deepMerge(config1[prop], config2[prop]);
            } else if (typeof config2[prop] !== "undefined") {
              config[prop] = config2[prop];
            } else if (utils.isObject(config1[prop])) {
              config[prop] = utils.deepMerge(config1[prop]);
            } else if (typeof config1[prop] !== "undefined") {
              config[prop] = config1[prop];
            }
          }
        );

        utils.forEach(
          [
            "baseURL",
            "transformRequest",
            "transformResponse",
            "paramsSerializer",
            "timeout",
            "withCredentials",
            "adapter",
            "responseType",
            "xsrfCookieName",
            "xsrfHeaderName",
            "onUploadProgress",
            "onDownloadProgress",
            "maxContentLength",
            "validateStatus",
            "maxRedirects",
            "httpAgent",
            "httpsAgent",
            "cancelToken",
            "socketPath",
          ],
          function defaultToConfig2(prop) {
            if (typeof config2[prop] !== "undefined") {
              config[prop] = config2[prop];
            } else if (typeof config1[prop] !== "undefined") {
              config[prop] = config1[prop];
            }
          }
        );

        return config;
      };

      /***/
    },
    /* 14 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      /**
       * A `Cancel` is an object that is thrown when an operation is canceled.
       *
       * @class
       * @param {string=} message The message.
       */

      function Cancel(message) {
        this.message = message;
      }

      Cancel.prototype.toString = function toString() {
        return "Cancel" + (this.message ? ": " + this.message : "");
      };

      Cancel.prototype.__CANCEL__ = true;

      module.exports = Cancel;

      /***/
    },
    /* 15 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _ajaxGetData = __webpack_require__(1);

      var _ajaxGetData2 = _interopRequireDefault(_ajaxGetData);

      var _activeTab = __webpack_require__(4);

      var _activeTab2 = _interopRequireDefault(_activeTab);

      var _setCurrentRecord = __webpack_require__(16);

      var _setCurrentRecord2 = _interopRequireDefault(_setCurrentRecord);

      var _ajaxDataRead = __webpack_require__(46);

      var _ajaxDataRead2 = _interopRequireDefault(_ajaxDataRead);

      var _consultationComponent = __webpack_require__(20);

      var _consultationComponent2 = _interopRequireDefault(
        _consultationComponent
      );

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      // import { toForm } from './editItem';

      function viewItem(url) {
        var viewType =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : ["standard"];

        console.log(viewType);
        var result = (0, _ajaxGetData2.default)(url);
        return result.then(function (res) {
          (0, _setCurrentRecord2.default)(res);
          (0, _activeTab2.default)(["read"]);
          // toForm(res);

          if (viewType.includes("consultation")) {
            var infoDivs = document.querySelectorAll(
              '.component[data-component="consultationInfo"]'
            );
            [].forEach.call(infoDivs, function (infoDiv) {
              console.log("viewType consultation");
              _consultationComponent2.default.info(infoDiv, res);
            });
          } else {
            var _infoDivs = document.querySelectorAll(
              '.component[data-component="information"]'
            );
            [].forEach.call(_infoDivs, function (infoDiv) {
              console.log("viewType standard");
              (0, _ajaxDataRead2.default)(infoDiv, "ul.info", res);
            });
          }
          return res;
        });
      }
      exports.default = viewItem;

      /***/
    },
    /* 16 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _editItem = __webpack_require__(17);

      var _editItem2 = _interopRequireDefault(_editItem);

      var _removeItem = __webpack_require__(18);

      var _removeItem2 = _interopRequireDefault(_removeItem);

      var _helper = __webpack_require__(2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function setCurrentRecord(res) {
        var data = res.data;

        var viewInfo = document.querySelector(
          '.component[data-component="view-details"]'
        );
        var infoTitle = viewInfo.querySelector(".info-title");
        var metaActions = viewInfo.querySelector(".meta-actions");

        viewInfo.querySelector(".panel-body").classList.remove("hidden");

        if (viewInfo.dataset.page == "patient") {
          viewInfo.querySelectorAll(".tab-link").forEach(function (el, index) {
            // var name = el.textContent;
            var tabContent = viewInfo.querySelectorAll(".tab-content")[index];
            var itemList = tabContent.querySelector(".item-list");
            el.dataset.loaded = false;

            /////// >>>>>> remove event and make it without event
            if (itemList) {
              el.addEventListener("click", function () {
                console.log("event added to tabs");
                var url = itemList.dataset.get + "/" + data._id;
                itemList.dataset.getUrl = url;
              });
            }
          });
        }

        if (infoTitle) {
          if (infoTitle.dataset.key) {
            var title = (0, _helper.valueByString)(data, infoTitle.dataset.key);
            infoTitle.innerHTML = infoTitle.dataset.prefix + " " + title;
          }
        }

        if (metaActions.querySelector(".meta-edit")) {
          metaActions.querySelector(".meta-edit").dataset.id = data._id;
          metaActions
            .querySelector(".meta-edit")
            .removeEventListener("click", handleEdit, false);
          metaActions
            .querySelector(".meta-edit")
            .addEventListener("click", handleEdit, false);
        }
        if (metaActions.querySelector(".meta-remove")) {
          metaActions.querySelector(".meta-remove").dataset.id = data._id;
          if (metaActions.querySelector(".meta-remove").dataset.label) {
            metaActions.querySelector(".meta-remove").dataset.displayLabel = (0,
            _helper.valueByString)(
              data,
              metaActions.querySelector(".meta-remove").dataset.label
            );
          }
          metaActions
            .querySelector(".meta-remove")
            .removeEventListener("click", handleDelete, false);
          metaActions
            .querySelector(".meta-remove")
            .addEventListener("click", handleDelete, false);
        }
        if (metaActions.querySelector(".meta-print")) {
          metaActions.querySelector(".meta-print").dataset.id = data._id;
        }
      }

      function handleEdit() {
        var viewInfo = document.querySelector(
          '.component[data-component="view-details"]'
        );
        var actionClic = this.dataset.actionUrl + this.dataset.id;
        var form = viewInfo.querySelector("form.ajax");
        // if (type != 'edit') {
        (0, _editItem2.default)(actionClic, form, this.dataset.id);
        // }
      }

      function handleDelete() {
        var actionClic = this.dataset.actionUrl + this.dataset.id;
        var displayLabel = this.dataset.displayLabel;
        (0, _removeItem2.default)(actionClic, displayLabel);
      }
      exports.default = setCurrentRecord;

      /***/
    },
    /* 17 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _typeof =
        typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
          ? function (obj) {
              return typeof obj;
            }
          : function (obj) {
              return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
            };
      // import ajaxDataRead from './ajaxDataRead';

      exports.toForm = toForm;

      var _ajaxGetData = __webpack_require__(1);

      var _ajaxGetData2 = _interopRequireDefault(_ajaxGetData);

      var _activeTab = __webpack_require__(4);

      var _activeTab2 = _interopRequireDefault(_activeTab);

      var _helper = __webpack_require__(2);

      var _setCurrentRecord = __webpack_require__(16);

      var _setCurrentRecord2 = _interopRequireDefault(_setCurrentRecord);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function toForm(result, form) {
        console.log(result.data);
        if (!form) {
          form = document.querySelector("form.ajax");
        }
        if (!form) {
          return;
        }
        var elements = form.querySelectorAll("input, select, textarea");

        var _loop = function _loop(i) {
          console.log(elements[i]);
          var element = elements[i];
          if (element.classList.contains("ajaxResult")) {
            value = result.data[element.name];

            element.dataset.value = value._id;
          } else {
            if (element.classList.contains("ajaxSelect")) {
              variable = result.data[element.name];

              element.value = variable._id || variable;
              setTimeout(function () {
                var e = new Event("change");
                element.dispatchEvent(e);
              }, 100);
            } else if (element.classList.contains("searchAjax")) {
              _id = result.data[element.name];
              // var variable = "";

              if (
                element.dataset.label &&
                _typeof(result.data[element.name]) == "object"
              ) {
                variable = (0, _helper.valueByString)(
                  result.data[element.name],
                  element.dataset.label
                );
                console.log(variable);
                _id = result.data[element.name]._id;
              }

              element.value = variable;
              element.dataset.value = _id;
              var inpSelect = document.createElement("SELECT");
              inpSelect.name = element.name;
              inpSelect.hidden = true;
              inpSelect.setAttribute("id", "hiddenSelect");
              inpSelect.options[0] = new Option(variable, _id);
              element.parentNode.appendChild(inpSelect);
              // var event = new CustomEvent("setValue", {
              //     detail: {
              //         display: variable,
              //         id: _id,
              //     }
              // });
              // element.dispatchEvent(event);

              // element.addEventListener("setValue", function(event) {
              //     const { detail } = event;
              //     element.value= detail.display;
              // }, false);
            } else {
              console.log(element.name);
              var name = element.dataset.name || element.name;
              variable = (0, _helper.valueByString)(result.data, name);
              //const json =  JSON.stringify(variable);
              console.log(variable);
              element.value = variable._id || variable;
            }
          }
        };

        for (var i = 0; i < elements.length; ++i) {
          var value;
          var variable;

          var _id;

          _loop(i);
        }
      }

      function editItem(action, form, id) {
        if (!form) {
          form = document.querySelector("form.ajax");
        }

        var viewInfo = document.querySelector(
          '.component[data-component="view-details"]'
        );
        if (viewInfo) {
          viewInfo.querySelector(".panel-body").classList.remove("hidden");
        }

        form.action = form.dataset.edit + id;
        form.dataset.id = id;
        var result = (0, _ajaxGetData2.default)(action);
        result.then(function (res) {
          (0, _setCurrentRecord2.default)(res);
          (0, _activeTab2.default)(["edit"]);
          toForm(res, form);
          // const infoDivs = document.querySelectorAll('.component[data-component="information"]');
          // [].forEach.call(infoDivs, function (infoDiv) {
          //     ajaxDataRead(infoDiv, 'ul.info', res);
          // });
        });
      }
      exports.default = editItem;

      /***/
    },
    /* 18 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _ajaxGetData = __webpack_require__(1);

      var _ajaxGetData2 = _interopRequireDefault(_ajaxGetData);

      var _dataGrid = __webpack_require__(6);

      var _dataGrid2 = _interopRequireDefault(_dataGrid);

      var _accordionModel = __webpack_require__(19);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function removeItem(removeAction, displaylabel) {
        if (displaylabel != undefined) {
          document
            .getElementById("delete-record")
            .querySelector(".row-info").innerHTML = " : " + displaylabel;
        }

        window.modal.open("delete-record");

        var currentModal = document.querySelector(".current-modal");
        if (currentModal) {
          var confirmButton = currentModal.querySelector(".delete-confirm");

          if (confirmButton) {
            confirmButton.removeEventListener(
              "click",
              handleDeleteConfirm,
              false
            );
            confirmButton.addEventListener("click", handleDeleteConfirm, false);
          }
        }

        function handleDeleteConfirm() {
          var result = (0, _ajaxGetData2.default)(removeAction);
          result.then(function () {
            (0, _accordionModel.accordionBar)();
            document
              .querySelector('[data-component="accordionForm"]')
              .querySelector(".accordionForm")
              .classList.remove("disabled");
            var dataTables = document.querySelectorAll(
              '.component[data-component="dataTable"]'
            );
            [].forEach.call(dataTables, function (component) {
              _dataGrid2.default.refresh(component);
            });
            window.modal.close();
          });
        }
      }
      exports.default = removeItem;

      /***/
    },
    /* 19 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.accordionBar = accordionBar;
      function accordionBar() {
        var tabs = document.querySelectorAll(".tab-content");
        // const tabLinks = document.querySelectorAll('.tab-link');
        var viewComponent = document.querySelectorAll(
          '.component[data-component="view-details"]'
        );
        [].forEach.call(tabs, function (tab) {
          tab.classList.remove("is-active");
        });
        // [].forEach.call(tabLinks, function (tabLink) {
        //     tabLink.classList.remove('is-active');
        // });

        [].forEach.call(viewComponent, function (el) {
          el.querySelector(".panel-body").classList.add("hidden");
        });
      }

      function accordionModel(component, accordionModelName) {
        var addNew = document.querySelector(".add-click");
        if (addNew) {
          addNew.addEventListener(
            "click",
            function () {
              accordionBar();
              component
                .querySelector(accordionModelName)
                .classList.remove("disabled");
            },
            false
          );
        }

        component.querySelector(accordionModelName + "Header").addEventListener(
          "click",
          function () {
            accordionBar();
            component
              .querySelector(accordionModelName)
              .classList.toggle("disabled");
          },
          false
        );
      }

      exports.default = accordionModel;

      /***/
    },
    /* 20 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _axios = __webpack_require__(5);

      var _axios2 = _interopRequireDefault(_axios);

      var _activeTab = __webpack_require__(4);

      var _activeTab2 = _interopRequireDefault(_activeTab);

      var _helper = __webpack_require__(2);

      var _delegate = __webpack_require__(3);

      var _delegate2 = _interopRequireDefault(_delegate);

      var _audioRecorder = __webpack_require__(47);

      var _audioRecorder2 = _interopRequireDefault(_audioRecorder);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      // import prescriptionList from './prescriptionList';

      //////// ***** medicament Module  : add , edit , remove , render ***** //////////

      var medicamentGrid = {
        toObject: function toObject(row) {
          var obj = {};

          var elements = row.querySelectorAll("input, select, textarea");
          for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            var name = element.name;
            var value = element.value;

            if (name) {
              obj[name] = value;
            }
          }

          return obj;
        },

        rowToForm: function rowToForm(jsonTxt, row, idRow) {
          console.log(idRow);
          var obj = JSON.parse(jsonTxt);
          row.dataset.action = "edit";
          row.dataset.id = idRow;
          var elements = row.querySelectorAll("input, select, textarea");
          for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            element.value = obj[element.name];
          }

          return obj;
        },

        reset: function reset(component) {
          var currentRow = component.querySelector(".currentRow");
          currentRow.dataset.action = "new";
          currentRow.dataset.id = null;
          var elements = currentRow.querySelectorAll("input, select,textarea");
          var autocompletes = currentRow.querySelectorAll(".autocomplete");
          for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            element.value = "";
            element.dataset.value = "";
          }
          [].forEach.call(autocompletes, function (autocomplete) {
            var select = autocomplete.querySelector("select");
            if (select != null) {
              if (select.parentNode) {
                select.parentNode.removeChild(select);
              }
            }
          });
        },
        validate: function validate(row) {
          var elements = row.querySelectorAll("input, select, textarea");
          for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            if (element.hasAttribute("required")) {
              if (element.value.length == 0) {
                return false;
              }
            }
          }

          return true;
        },
        add: function add(component) {
          var currentRow = component.querySelector(".currentRow");
          var medicamentRow = component.querySelector(".medicament-row");
          var form = component.querySelector("form");
          var orgdropdown = form.querySelector(".orgdropdown");
          var newObj = medicamentGrid.toObject(currentRow);
          var newID = (0, _helper.uniqueid)();
          var action = currentRow.dataset.action;
          console.log(newObj);
          if (medicamentGrid.validate(currentRow)) {
            var editedID = currentRow.dataset.id || null;
            var editClassName = '.calculation-row[data-row="' + editedID + '"]';
            var editedRow = medicamentRow.querySelector(editClassName);

            if (action == "edit" && editedRow != null) {
              editedRow.dataset.medicament = JSON.stringify(newObj);
              editedRow.innerHTML =
                '\n        <div class="col-5"><span>' +
                newObj.medicamentName +
                '</span></div>\n        <div class="col-3"><span>' +
                newObj.boxesNumber +
                ' Boite</span></div>\n        <div class="col-3"><span>' +
                newObj.daysNumber +
                ' Jours</span></div>\n        <div class="col-3"><span>' +
                newObj.drugsNumber +
                ' cp</span></div>\n        <div class="col-3"><span>' +
                newObj.times +
                ' fois</span></div>\n        <div class="col-5"><span>' +
                newObj.note +
                "</span></div>\n        ";

              var dropdown = orgdropdown.cloneNode(true);
              dropdown.className = "dropdown";
              dropdown.querySelector("li.remove").dataset.id = editedID;
              dropdown.querySelector("li.edit").dataset.id = editedID;
              editedRow.appendChild(dropdown);
            }
            if (action == "new") {
              var newRow =
                '<div class="content-row calculation-row" data-medicament=\'' +
                JSON.stringify(newObj) +
                "' data-row='" +
                newID +
                '\'>\n        <div class="col-5"><span>' +
                newObj.medicamentName +
                '</span></div>\n        <div class="col-3"><span>' +
                newObj.boxesNumber +
                ' Boite</span></div>\n        <div class="col-3"><span>' +
                newObj.daysNumber +
                ' Jours</span></div>\n        <div class="col-3"><span>' +
                newObj.drugsNumber +
                ' cp</span></div>\n        <div class="col-3"><span>' +
                newObj.times +
                ' fois</span></div>\n        <div class="col-5"><span>' +
                newObj.note +
                "</span></div>\n        </div>\n        ";

              medicamentRow.innerHTML += newRow;
              var className = '.calculation-row[data-row="' + newID + '"]';
              var lastRow = medicamentRow.querySelector(className);
              var _dropdown = orgdropdown.cloneNode(true);
              _dropdown.className = "dropdown";
              _dropdown.querySelector("li.remove").dataset.id = newID;
              _dropdown.querySelector("li.edit").dataset.id = newID;
              lastRow.appendChild(_dropdown);
            }

            medicamentGrid.reset(component);
          }
        },
        edit: function edit(component, element) {
          var id = element.dataset.id;
          var currentRow = component.querySelector(".currentRow");
          var className = '.calculation-row[data-row="' + id + '"]';
          var selected = component.querySelector(className);
          var jsonTxt = selected.dataset.medicament;
          medicamentGrid.rowToForm(jsonTxt, currentRow, id);
        },
        remove: function remove(component, element) {
          var id = element.dataset.id;

          var className = '.calculation-row[data-row="' + id + '"]';
          var selected = component.querySelector(className);

          if (selected.parentNode) {
            selected.parentNode.removeChild(selected);
          }
        },
        record: function record(component, medicament) {
          var form = component.querySelector("form");
          var orgdropdown = form.querySelector(".orgdropdown");
          var newID = (0, _helper.uniqueid)();
          var result =
            '<div class="content-row calculation-row" data-medicament=\'' +
            JSON.stringify(medicament) +
            "' data-row='" +
            newID +
            '\'>\n    <div class="col-5"><span>' +
            medicament.medicamentName +
            '</span></div>\n    <div class="col-3"><span>' +
            medicament.boxesNumber +
            ' Boite</span></div>\n    <div class="col-3"><span>' +
            medicament.daysNumber +
            ' Jours</span></div>\n    <div class="col-3"><span>' +
            medicament.drugsNumber +
            ' cp</span></div>\n    <div class="col-3"><span>' +
            medicament.times +
            ' fois</span></div>\n    <div class="col-5"><span>' +
            medicament.note +
            "</span></div>\n    </div>\n    ";
          var dom = document.createElement("div");
          dom.innerHTML = result;
          var row = dom.querySelector(".calculation-row");
          var dropdown = orgdropdown.cloneNode(true);
          dropdown.className = "dropdown";
          dropdown.querySelector("li.remove").dataset.id = newID;
          dropdown.querySelector("li.edit").dataset.id = newID;
          row.appendChild(dropdown);
          return dom.innerHTML;
        },
        render: function render(component, data) {
          var medicamentRow = component.querySelector(".medicament-row");
          var medicamentsList = data.medicamentsList;

          var content = medicamentsList.map(function (item) {
            return medicamentGrid.record(component, item);
          });
          // inner data to #dataCont
          medicamentRow.innerHTML = content.join("");
        },
      };

      //////// ***** prescription Module  : type , edit , remove , download ***** //////////
      /* eslint-disable no-unused-vars */

      var prescriptionGrid = {
        type: function type(component, element) {
          console.log("prescriptionType event dispatched");
          var value = element.value;
          var form = component.querySelector("form");
          var type = component.querySelector("." + value);
          var prescriptionForms = component.querySelectorAll(
            ".prescriptionForm"
          );
          if (type) {
            [].forEach.call(prescriptionForms, function (prescriptionForm) {
              prescriptionForm.classList.add("hidden");
              form.action = form.dataset.add;
              form.dataset.status = "new";
              medicamentGrid.reset(component);
              prescriptionGrid.resetForm(prescriptionForm);
            });
            type.classList.remove("hidden");
          }
        },
        resetForm: function resetForm(prescriptionForm) {
          var elements = prescriptionForm.querySelectorAll(
            "input, select,textarea"
          );
          var medicamentRow = prescriptionForm.querySelector(".medicament-row");
          for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            element.value = "";
            element.dataset.value = "";
          }
          if (medicamentRow) {
            medicamentRow.innerHTML = "";
          }
        },
        formToObject: function formToObject(form) {
          var obj = {};
          var elements = form.querySelectorAll("input, select, textarea");
          for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            var name = element.name;
            var value = element.value;

            if (name && element.dataset.disabled != "true") {
              obj[name] = value;
            }
          }
          return obj;
        },

        edit: function edit(component, element) {
          var id = element.dataset.id;
          console.log("editPrescription : " + id);
          var form = component.querySelector("form");
          var prescriptionType = component.querySelector(".prescriptionType");
          var action = form.dataset.read + id;
          _axios2.default.get(action).then(function (res) {
            // Rest all prescriptionForm
            // [].forEach.call(prescriptionForms, function(prescriptionForm) {
            //   reset(currentRow);
            //   resetForm(prescriptionForm);
            // });
            console.log(res.data);
            if (res.data.success == 1) {
              console.log(res.data);
              (0, _helper.activeModel)("prescription");

              // form.dataset.consultationId = res.data.data.consultation._id;

              var consultation = component.querySelector(
                'input[name="consultation"]'
              );
              var patient = component.querySelector('input[name="patient"]');
              var doctor = component.querySelector('input[name="doctor"]');
              var prescriptionTitle = component.querySelector(".page-title");
              var letterFrom = component.querySelector(".letter");
              consultation.value = res.data.data.consultation._id;
              patient.value = res.data.data.patient._id;
              doctor.value = res.data.data.doctor._id;
              consultation.dataset.id = res.data.data.consultation._id;
              patient.dataset.id = res.data.data.patient._id;
              doctor.dataset.id = res.data.data.doctor._id;
              prescriptionTitle.innerHTML =
                "Ordonnance #1 " +
                (res.data.data.patient.name +
                  " " +
                  res.data.data.patient.surname);

              var type = res.data.data.type;

              if (type == "letter") {
                prescriptionType.value = type;
                prescriptionType.dispatchEvent(new Event("change"));
                form.action = form.dataset.edit + id;
                form.dataset.status = "update";
                letterFrom.querySelector("textarea").value =
                  res.data.data.letter;
              } else {
                prescriptionType.value = type;
                console.log(prescriptionType.value);
                prescriptionType.dispatchEvent(new Event("change"));
                form.action = form.dataset.edit + id;
                form.dataset.status = "update";
                medicamentGrid.render(component, res.data.data);
              }
            }
          });
        },
        remove: function remove(component, element) {
          var prescriptionType = component.querySelector(".prescriptionType");
          var form = component.querySelector("form");
          var id = element.dataset.id;
          var action = form.dataset.delete + id;

          document
            .getElementById("delete-record")
            .querySelector(".row-info").innerHTML = " : " + id;

          window.modal.open("delete-record");
          var currentModal = document.querySelector(".current-modal");
          if (currentModal) {
            var confirmButton = currentModal.querySelector(".delete-confirm");

            if (confirmButton) {
              confirmButton.removeEventListener(
                "click",
                prescriptionDeleteConfirm,
                false
              );
              confirmButton.addEventListener(
                "click",
                prescriptionDeleteConfirm,
                false
              );
            }
          }
          function prescriptionDeleteConfirm() {
            _axios2.default.get(action).then(function (res) {
              //Rest all prescriptionForm
              prescriptionType.dispatchEvent(new Event("change"));
              form.action = form.dataset.add;
              form.dataset.status = "new";
              if (res.data.success == 1) {
                var className = '.prescriptionItem[data-id="' + id + '"]';
                console.log(className);
                var selected = document.querySelector(className);
                console.log(selected);
                if (selected) {
                  selected.parentNode.removeChild(selected);
                }
                window.modal.close();
              }
            });
          }
        },
        download: function download(element) {
          var id = element.dataset.id;
          var link = element.dataset.path + "-" + id + ".pdf";
          console.log(link);
          window.open(link, "_blank");
          //prescriptionItem.setAttribute('href',`/api/prescription/pdf/${res.data.data._id}`)
        },
        renderList: function renderList(component, datas) {
          console.log(datas);

          var orgprescriptionItem = component.querySelector(
            ".template .prescriptionItem"
          );
          var prescriptionItemList = component.querySelector(
            ".prescriptionItemList"
          );
          // prescriptionItemList.dataset.nbr=0;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (
              var _iterator = datas[Symbol.iterator](), _step;
              !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
              _iteratorNormalCompletion = true
            ) {
              var data = _step.value;

              console.log(data);
              var prescriptionItem = orgprescriptionItem.cloneNode(true);

              //const reportList = component.querySelector('.reportList');
              var date = data.created;

              var nbr = parseInt(prescriptionItemList.dataset.nbr, 10) + 1 || 1;
              prescriptionItemList.dataset.nbr = nbr;
              prescriptionItem.querySelector(
                "span[data-prescriptionNbr]"
              ).innerHTML = "Ordonnance #" + nbr;
              prescriptionItem.querySelector(
                "span[data-prescriptionDate]"
              ).innerHTML = (0, _helper.formatDate)(date);
              prescriptionItem.dataset.id = data._id;
              prescriptionItem.querySelector(".edit").dataset.id = data._id;
              prescriptionItem.querySelector(".download").dataset.id = data._id;
              prescriptionItem.querySelector(".remove").dataset.id = data._id;

              console.log(prescriptionItem);

              prescriptionItemList.appendChild(prescriptionItem);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        },
      };
      //////// ***** report Module  : remove ***** //////////
      var reportGrid = {
        recorder: function recorder(component) {
          console.log("consultationAudioRecorder");
          console.log(component);
          var isRecording = false;
          var recordingIndex = 1;
          var recordButton = component;
          var oldLabel = recordButton.innerHTML;
          // var recordingsList = document.querySelector(component.dataset.listSelector);
          // var template = recordingsList.querySelector('.single-item.template');
          var recordingsStatus = component;
          recordButton.addEventListener("click", function () {
            if (!isRecording) {
              isRecording = true;
              recordButton.disabled = true;
              startRecording();
            } else {
              isRecording = false;
              stopRecording();
            }
          });

          var audioRecorder = (0, _audioRecorder2.default)({
            onStop: function onStop(_ref) {
              var blob = _ref.blob;

              createDownloadLink(blob, "mp3");
              recordButton.innerHTML = oldLabel;
            },
            onReady: function onReady() {
              this.isReady = true;
              recordButton.disabled = false;
            },
            onStatus: function onStatus(string, type) {
              if (type != "init") {
                recordingsStatus.innerHTML = string;
              }
            },
          });

          function startRecording() {
            audioRecorder.startRecording();
          }

          function stopRecording() {
            audioRecorder.stopRecording();
          }

          function createDownloadLink(blob, encoding) {
            // const name = new Date().toISOString() + '.' + encoding;
            if (component.dataset.saveAction) {
              var formData = new FormData();

              formData.append("name", "Recording " + recordingIndex);
              recordingIndex++;
              formData.append("audioFile", blob);
              formData.append("consultation", component.dataset.id);

              _axios2.default
                .post(component.dataset.saveAction, formData, {
                  // onUploadProgress: function (progressEvent) {
                  //     var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                  //     recordingsList.querySelector('.upload-progress').innerHTML = "Uploading " + percentCompleted + "%";
                  // },
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                })
                .then(function (response) {
                  // recordingsList.querySelector('.upload-progress').innerHTML = "";
                  // console.log(response)
                  var datas = [];
                  datas.push(response.data.data);
                  var consultation = document.querySelector(
                    '.component[data-component="consultationInfo"]'
                  );
                  if (consultation) {
                    reportGrid.renderList(consultation, datas);
                  }
                });
            }
          }
        },

        play: function play(el) {
          var isPlaying = false;
          var audioEl = document.createElement("audio");
          audioEl.src = el.dataset.src;
          audioEl.classList.add("hidden");
          el.append(audioEl);
          el.addEventListener("click", function (e) {
            e.stopPropagation();
            if (isPlaying) {
              pause();
            } else {
              play();
            }
          });

          audioEl.addEventListener("play", function () {
            isPlaying = true;
            el.querySelector(".play").classList.add("hidden");
            el.querySelector(".pause").classList.remove("hidden");
          });
          audioEl.addEventListener("pause", function () {
            isPlaying = false;
            el.querySelector(".play").classList.remove("hidden");
            el.querySelector(".pause").classList.add("hidden");
          });
          function pause() {
            audioEl.pause();
          }
          function play() {
            document.querySelectorAll("audio").forEach(function (audio) {
              audio.pause();
            });
            audioEl.play();
          }
        },
        remove: function remove(element) {
          var id = element.dataset.id;
          var action = element.dataset.removeAction;

          document
            .getElementById("delete-record")
            .querySelector(".row-info").innerHTML = " : " + id;

          window.modal.open("delete-record");
          var currentModal = document.querySelector(".current-modal");
          if (currentModal) {
            var confirmButton = currentModal.querySelector(".delete-confirm");

            if (confirmButton) {
              confirmButton.removeEventListener(
                "click",
                reportDeleteConfirm,
                false
              );
              confirmButton.addEventListener(
                "click",
                reportDeleteConfirm,
                false
              );
            }
          }
          function reportDeleteConfirm() {
            _axios2.default.get(action).then(function (res) {
              console.log(res);
              if (res.data.success == 1) {
                var className = '.report[data-id="' + res.data.data._id + '"]';
                console.log(className);
                var selected = document.querySelector(className);
                console.log(selected);
                if (selected) {
                  selected.parentNode.removeChild(selected);
                }
                window.modal.close();
              }
            });
          }
        },
        renderList: function renderList(component, datas) {
          var orgreport = component.querySelector(".template .report");
          var reportItemList = component.querySelector(".reportItemList");
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (
              var _iterator2 = datas[Symbol.iterator](), _step2;
              !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
              _iteratorNormalCompletion2 = true
            ) {
              var data = _step2.value;

              // console.log(data)
              var report = orgreport.cloneNode(true);
              var nbr = parseInt(reportItemList.dataset.nbr, 10) + 1 || 1;
              reportItemList.dataset.nbr = nbr;
              report.dataset.id = data._id;
              report.querySelector("span[data-reportnbr]").innerHTML =
                "Rapport #" + nbr;
              report.querySelector("span[data-reportdate]").innerHTML = (0,
              _helper.formatDate)(data.created);
              var playComponent = report.querySelector(".playPushButton");
              var removeRecord = report.querySelector(".remove");

              if (playComponent) {
                playComponent.dataset.src = "/" + data.audioFile;
                reportGrid.play(playComponent);
              }

              if (removeRecord) {
                removeRecord.dataset.id = data._id;
                removeRecord.dataset.displaylabel = data.audioFile;
                removeRecord.dataset.removeAction =
                  reportItemList.dataset.removeAction + data._id;
              }

              reportItemList.appendChild(report);
              // console.log(reportItemList);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        },
      };

      function resetPrescriptionGrid(prescriptionGrid) {
        var currentRow = prescriptionGrid.querySelector(".currentRow");
        var medicamentRow = prescriptionGrid.querySelector(".medicament-row");
        if (medicamentRow) {
          medicamentRow.innerHTML = "";
        } else {
          return;
        }
        if (currentRow) {
          currentRow.dataset.action = "new";
          currentRow.dataset.id = null;
        } else {
          return;
        }
        var elements = currentRow.querySelectorAll("input, select, textarea");
        for (var i = 0; i < elements.length; ++i) {
          var element = elements[i];
          element.value = "";
          element.dataset.value = "";
        }

        var autocompletes = currentRow.querySelectorAll(".autocomplete");

        [].forEach.call(autocompletes, function (autocomplete) {
          var select = autocomplete.querySelector("select");
          if (select != null) {
            if (select.parentNode) {
              select.parentNode.removeChild(select);
            }
          }
        });
      }

      //////// ***** Main Component  : prescriptionComponent ***** //////////

      var consultationComponent = {
        init: function init(component) {
          var addNewRow = component.querySelector("button.newMedicament");
          var savePrescription = component.querySelector(".savePrescription");
          var prescriptionType = component.querySelector(".prescriptionType");
          var back = component.querySelector(".back");
          var prescriptionForms = component.querySelectorAll(
            ".prescriptionForm"
          );
          var recorderToggle = document.querySelector(
            '.component[data-component="recorder-toggle"]'
          );
          var form = component.querySelector("form");

          (0, _delegate2.default)(
            document.body,
            ".prescriptionItem .remove",
            "click",
            function (e) {
              prescriptionGrid.remove(component, e.delegateTarget);
            },
            false
          );
          (0, _delegate2.default)(
            document.body,
            ".prescriptionItem .edit",
            "click",
            function (e) {
              prescriptionGrid.edit(component, e.delegateTarget);
            },
            false
          );
          (0, _delegate2.default)(
            document.body,
            ".prescriptionItem .download",
            "click",
            function (e) {
              prescriptionGrid.download(e.delegateTarget);
            },
            false
          );

          (0, _delegate2.default)(
            document.body,
            ".report .remove",
            "click",
            function (e) {
              reportGrid.remove(e.delegateTarget);
            },
            false
          );

          (0, _delegate2.default)(
            document.body,
            ".medicament-row .edit",
            "click",
            function (e) {
              medicamentGrid.edit(component, e.delegateTarget);
            },
            false
          );
          (0, _delegate2.default)(
            document.body,
            ".medicament-row .remove",
            "click",
            function (e) {
              medicamentGrid.remove(component, e.delegateTarget);
            },
            false
          );

          if (prescriptionType) {
            prescriptionType.addEventListener("change", function () {
              prescriptionGrid.type(component, this);
            });
          }

          if (back) {
            back.addEventListener("click", function () {
              form.action = form.dataset.add;
              form.dataset.status = "new";
              medicamentGrid.reset(component);
              [].forEach.call(prescriptionForms, function (prescriptionForm) {
                prescriptionGrid.resetForm(prescriptionForm);
              });
              (0, _helper.activeModel)("dataTable");
            });
          }
          if (recorderToggle) {
            reportGrid.recorder(recorderToggle);
          }

          addNewRow.addEventListener("click", function () {
            medicamentGrid.add(component);
          });

          form.addEventListener("keydown", function (event) {
            if (event.keyCode == 13) {
              event.preventDefault();
              return false;
            }
          });

          savePrescription.addEventListener(
            "click",
            function (event) {
              event.preventDefault();
              medicamentGrid.reset(component); // make new medicament row empty
              var calculationRows = component.querySelectorAll(
                ".calculation-row"
              );
              var letterFrom = component.querySelector(".letter");
              // const infoDivs = document.querySelectorAll('.component[data-component="consultationInfo"]');
              var form = component.querySelector("form");
              var prescriptionData = prescriptionGrid.formToObject(form);
              var type = prescriptionType.value;
              var status = form.dataset.status;

              if (type == "letter") {
                var letter = letterFrom.querySelector("textarea");
                prescriptionData.letter = letter.value;
              } else {
                // type PrescriptionForm
                var medicamentList = [];

                [].forEach.call(calculationRows, function (calculationRow) {
                  var data = calculationRow.dataset.medicament;
                  console.log(data);
                  if (data != undefined) {
                    var dataObj = JSON.parse(data);
                    medicamentList.push(dataObj);
                  }
                });

                prescriptionData.medicamentsList = medicamentList;
              }

              _axios2.default
                .post(form.action, prescriptionData)
                .then(function (res) {
                  // Rest all prescriptionForm
                  form.action = form.dataset.add;
                  form.dataset.status = "new";
                  [].forEach.call(prescriptionForms, function (
                    prescriptionForm
                  ) {
                    medicamentGrid.reset(component);
                    prescriptionGrid.resetForm(prescriptionForm);
                  });
                  if (res.data.success == 1) {
                    (0, _helper.activeModel)("dataTable");
                    (0, _activeTab2.default)(["read"]);
                    if (status == "new") {
                      var datas = [];
                      datas.push(res.data.data);
                      var consultation = document.querySelector(
                        '.component[data-component="consultationInfo"]'
                      );
                      if (consultation) {
                        // console.log(consultation);
                        prescriptionGrid.renderList(consultation, datas);
                      }
                    }
                  }
                });
            },
            false
          );
        },
        info: function info(component, res) {
          var filter =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : ["new"];

          console.log(res);
          var patientIds = component.querySelectorAll(
            ".item-data[data-patientId]"
          );
          var patientNames = component.querySelectorAll(
            ".item-data[data-patientName]"
          );
          var newPrescription = component.querySelector("#newPrescription");
          var prescriptionGridComponent = document.querySelector(
            '.component[data-component="prescriptionGrid"]'
          );
          var prescriptionItemList = component.querySelector(
            ".prescriptionItemList"
          );
          var reportItemList = component.querySelector(".reportItemList");

          var prescriptionApi =
            "/api/prescription/find/consultation/" + res.data._id;
          var reportApi =
            "/api/consultation-recording/find/consultation/" + res.data._id;

          console.log(prescriptionApi);
          (0, _helper.activeModel)("dataTable");

          document.querySelector(
            '[data-component="recorder-toggle"]'
          ).dataset.id = res.data._id;

          if (filter.includes("new")) {
            [].forEach.call(patientIds, function (patientId) {
              patientId.innerHTML =
                res.data.patient.patientId || res.data.patient._id;
            });

            [].forEach.call(patientNames, function (patientName) {
              patientName.innerHTML =
                res.data.patient.name + " " + res.data.patient.surname;
            });
            prescriptionItemList.innerHTML = "";
            prescriptionItemList.dataset.nbr = 0;
            _axios2.default
              .get(prescriptionApi)
              .then(function (response) {
                console.log(response);
                var datas = response.data.data;
                prescriptionGrid.renderList(component, datas);
                // prescriptionGrid.renderList(component,datas);
              })
              .catch(function (error) {
                // handle error
                return error.response;
              });

            reportItemList.innerHTML = "";
            reportItemList.dataset.nbr = 0;
            _axios2.default
              .get(reportApi)
              .then(function (response) {
                console.log(response);
                var datas = response.data.data;
                reportGrid.renderList(component, datas);
              })
              .catch(function (error) {
                // handle error
                return error.response;
              });
          }

          // if (filter.includes('saved')) {
          //   /////
          // }

          if (newPrescription) {
            newPrescription.addEventListener(
              "click",
              function () {
                console.log(res);

                if (prescriptionGridComponent) {
                  var form = prescriptionGridComponent.querySelector("form");
                  form.dataset.consultationId = res.data._id;
                  var consultation = prescriptionGridComponent.querySelector(
                    'input[name="consultation"]'
                  );
                  var patient = prescriptionGridComponent.querySelector(
                    'input[name="patient"]'
                  );
                  var doctor = prescriptionGridComponent.querySelector(
                    'input[name="doctor"]'
                  );
                  var prescriptionTitle = prescriptionGridComponent.querySelector(
                    ".page-title"
                  );
                  consultation.value = res.data._id;
                  patient.value = res.data.patient._id;
                  doctor.value = res.data.doctor._id;
                  consultation.dataset.id = res.data._id;
                  patient.dataset.id = res.data.patient._id;
                  doctor.dataset.id = res.data.doctor._id;
                  prescriptionTitle.innerHTML =
                    "Ordonnance #1 " +
                    (res.data.patient.name + " " + res.data.patient.surname);
                  resetPrescriptionGrid(prescriptionGridComponent);
                }

                (0, _helper.activeModel)("prescription");
              },
              false
            );
          }
        },
      };
      exports.default = consultationComponent;

      /***/
    },
    /* 21 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      __webpack_require__(22);

      var _docReady = __webpack_require__(23);

      var _docReady2 = _interopRequireDefault(_docReady);

      var _dropdown = __webpack_require__(24);

      var _dropdown2 = _interopRequireDefault(_dropdown);

      var _modal = __webpack_require__(25);

      var _modal2 = _interopRequireDefault(_modal);

      var _inputFunction = __webpack_require__(26);

      var _inputFunction2 = _interopRequireDefault(_inputFunction);

      var _ajaxFormSubmit = __webpack_require__(28);

      var _ajaxFormSubmit2 = _interopRequireDefault(_ajaxFormSubmit);

      var _dataGrid = __webpack_require__(6);

      var _dataGrid2 = _interopRequireDefault(_dataGrid);

      var _ajaxSelectInput = __webpack_require__(48);

      var _ajaxSelectInput2 = _interopRequireDefault(_ajaxSelectInput);

      var _ajaxAutocomplete = __webpack_require__(49);

      var _ajaxAutocomplete2 = _interopRequireDefault(_ajaxAutocomplete);

      var _searchItem = __webpack_require__(50);

      var _searchItem2 = _interopRequireDefault(_searchItem);

      var _tabPanel = __webpack_require__(51);

      var _tabPanel2 = _interopRequireDefault(_tabPanel);

      var _navApp = __webpack_require__(53);

      var _navApp2 = _interopRequireDefault(_navApp);

      var _subMenuDrawer = __webpack_require__(54);

      var _subMenuDrawer2 = _interopRequireDefault(_subMenuDrawer);

      var _panelModel = __webpack_require__(55);

      var _panelModel2 = _interopRequireDefault(_panelModel);

      var _datepicker = __webpack_require__(56);

      var _datepicker2 = _interopRequireDefault(_datepicker);

      var _accordionModel = __webpack_require__(19);

      var _accordionModel2 = _interopRequireDefault(_accordionModel);

      var _fileUpload = __webpack_require__(57);

      var _fileUpload2 = _interopRequireDefault(_fileUpload);

      var _consultationComponent = __webpack_require__(20);

      var _consultationComponent2 = _interopRequireDefault(
        _consultationComponent
      );

      var _patientFolder = __webpack_require__(58);

      var _patientFolder2 = _interopRequireDefault(_patientFolder);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      (0, _docReady2.default)(function () {
        // const allPages = $('#pageId');
        var inputs = document.querySelectorAll("input");

        var dataTables = document.querySelectorAll(
          '.component[data-component="dataTable"]'
        );
        var ajaxForms = document.querySelectorAll(
          '.component[data-component="ajaxForm"]'
        );
        var ajaxSelects = document.querySelectorAll(
          '.component[data-component="ajaxSelect"]'
        );
        var ajaxSearchs = document.querySelectorAll(
          '.component[data-component="ajaxSearch"]'
        );
        var searchLists = document.querySelectorAll(
          '.component[data-component="searchList"]'
        );
        var tabContents = document.querySelectorAll(
          '.component[data-component="tabContent"]'
        );
        var navigations = document.querySelectorAll(
          '.component[data-component="navigation"]'
        );
        var panels = document.querySelectorAll(
          '.component[data-component="panel"]'
        );
        var accordions = document.querySelectorAll(
          '.component[data-component="accordionForm"]'
        );
        // const recorderToggle = document.querySelectorAll('.component[data-component="recorder-toggle"]');
        var fileUploadComponent = document.querySelectorAll(
          '.component[data-component="file-upload"]'
        );
        var prescriptions = document.querySelectorAll(
          '.component[data-component="prescriptionGrid"]'
        );
        var itemListComponent = document.querySelectorAll(
          '.component[data-component="item-list"]'
        );

        _modal2.default.init();
        window.modal = _modal2.default;
        (0, _dropdown2.default)();
        (0, _subMenuDrawer2.default)();

        [].forEach.call(inputs, function (input) {
          (0, _inputFunction2.default)(input);
        });

        (0, _datepicker2.default)(".datepicker");

        [].forEach.call(dataTables, function (dataTable) {
          _dataGrid2.default.init(dataTable, ".table", "form.ajax");
        });

        [].forEach.call(ajaxForms, function (ajaxForm) {
          (0, _ajaxFormSubmit2.default)(ajaxForm, "form.ajax");
        });

        [].forEach.call(ajaxSelects, function (ajaxSelect) {
          (0,
          _ajaxSelectInput2.default)(ajaxSelect, ".ajaxSelect", ".ajaxResult");
        });

        [].forEach.call(ajaxSearchs, function (ajaxSearch) {
          (0, _ajaxAutocomplete2.default)(ajaxSearch, ".searchAjax");
        });

        [].forEach.call(searchLists, function (searchList) {
          (0, _searchItem2.default)(searchList, ".searchAjax");
        });

        [].forEach.call(navigations, function (navigation) {
          (0, _navApp2.default)(navigation, ".toggle");
        });

        [].forEach.call(accordions, function (accordion) {
          (0, _accordionModel2.default)(accordion, ".accordionForm");
        });

        [].forEach.call(tabContents, function (tabContent) {
          (0, _tabPanel2.default)(tabContent, "#tabs1");
        });

        [].forEach.call(panels, function (panel) {
          (0, _panelModel2.default)(panel, ".panel", ".panelButton");
        });

        [].forEach.call(prescriptions, function (prescription) {
          _consultationComponent2.default.init(prescription);
        });

        // [].forEach.call(recorderToggle, function(el) {
        //     consultationAudioRecorder(el);
        // });

        [].forEach.call(fileUploadComponent, function (el) {
          (0, _fileUpload2.default)(el);
        });

        [].forEach.call(itemListComponent, function (el) {
          (0, _patientFolder2.default)(el);
        });
      });
      // import consultationAudioRecorder from './modules/consultationAudioRecorder';

      // import { $$ } from './lib/bling';

      /***/
    },
    /* 22 */
    /***/ function (module, exports) {
      // removed by extract-text-webpack-plugin
      /***/
    },
    /* 23 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      //https://github.com/jfriend00/docReady

      (function (funcName, baseObj) {
        "use strict";
        // The public function name defaults to window.docReadyfunc
        // but you can modify the last line of this function to pass in a different object or method name
        // if you want to put them in a different namespace and those will be used instead of
        // window.docReadyfunc(...)

        funcName = funcName || "docReadyfunc";
        baseObj = baseObj || window;
        var readyList = [];
        var readyFired = false;
        var readyEventHandlersInstalled = false;

        // call this when the document is ready
        // this function protects itself against being called more than once
        function ready() {
          if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
              // if a callback here happens to add new ready handlers,
              // the docReadyfunc() function will see that it already fired
              // and will schedule the callback to run right after
              // this event loop finishes so all handlers will still execute
              // in order and no new ones will be added to the readyList
              // while we are processing the list
              readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
          }
        }

        function readyStateChange() {
          if (document.readyState === "complete") {
            ready();
          }
        }

        // This is the one public interface
        // docReadyfunc(fn, context);
        // the context argument is optional - if present, it will be passed
        // as an argument to the callback
        baseObj[funcName] = function (callback, context) {
          if (typeof callback !== "function") {
            throw new TypeError(
              "callback for docReadyfunc(fn) must be a function"
            );
          }
          // if ready has already fired, then just schedule the callback
          // to fire asynchronously, but right away
          if (readyFired) {
            setTimeout(function () {
              callback(context);
            }, 1);
            return;
          } else {
            // add the function and context to the list
            readyList.push({ fn: callback, ctx: context });
          }
          // if document already ready to go, schedule the ready function to run
          // IE only safe when readyState is "complete", others safe when readyState is "interactive"
          if (
            document.readyState === "complete" ||
            (!document.attachEvent && document.readyState === "interactive")
          ) {
            setTimeout(ready, 1);
          } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
              // first choice is DOMContentLoaded event
              document.addEventListener("DOMContentLoaded", ready, false);
              // backup is window load event
              window.addEventListener("load", ready, false);
            } else {
              // must be IE
              document.attachEvent("onreadystatechange", readyStateChange);
              window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
          }
        };
      })("docReadyfunc", window);

      var docReady = window.docReadyfunc;
      // modify this previous line to pass in your own method name
      // and object for the method to be attached to
      exports.default = docReady;

      /***/
    },
    /* 24 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _delegate = __webpack_require__(3);

      var _delegate2 = _interopRequireDefault(_delegate);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function dataOption(current) {
        // console.log(this);

        var result = current
          .querySelector(".toggleOption")
          .classList.contains("show");

        var toggleOptions = document.querySelectorAll(".toggleOption.show");
        [].forEach.call(toggleOptions, function (toggleOption) {
          toggleOption.classList.remove("show");
        });
        if (result) {
          current.querySelector(".toggleOption").classList.remove("show");
        } else {
          current.querySelector(".toggleOption").classList.add("show");
        }
      }
      function dropdown() {
        (0, _delegate2.default)(
          document.body,
          ".dropdown",
          "click",
          function (e) {
            dataOption(e.delegateTarget);
          },
          false
        );

        document.addEventListener(
          "click",
          function (event) {
            if (event.target.closest(".dropdown")) {
              return;
            }

            var toggleOptions = document.querySelectorAll(".toggleOption.show");
            [].forEach.call(toggleOptions, function (toggleOption) {
              console.log("outside dropdown click");
              toggleOption.classList.remove("show");
            });
          },
          false
        );
      }
      exports.default = dropdown;

      /***/
    },
    /* 25 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      function outsideClick(e) {
        if (e.target.closest(".modal-inner")) {
          return;
        }
        var modalVisible = document.querySelector(".modal-visible");
        if (modalVisible) {
          closeModal();
        }
      }
      function escKey(e) {
        if (e.keyCode == 27) {
          closeModal();
        }
      }

      function closeClick(e) {
        if (e.target.classList.contains("closeModal")) {
          closeModal();
        } else return;
      }

      var closeModal = function closeModal() {
        var vanillaModal = document.querySelector(".vanilla-modal");
        if (vanillaModal) {
          vanillaModal.classList.remove("modal-visible");
          document.getElementById("modal-content").innerHTML = "";
          document.getElementById("modal-content").style = "";
        }

        document.removeEventListener("keydown", escKey);
        document.removeEventListener("click", outsideClick, true);
        document.removeEventListener("click", closeClick);
      };

      var modal = {
        init: function init() {
          // console.log("init function executed")
          var prerendredModal = document.createElement("div");
          prerendredModal.classList.add("vanilla-modal");
          var htmlModal =
            '         \n       <div class="modal">\n       <div class="modal-inner"\n       ><div id="modal-content"></div></div></div>';
          prerendredModal.innerHTML = htmlModal;
          document.body.appendChild(prerendredModal);
        },
        open: function open(idContent) {
          var option =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : { default: null };

          var vanillaModal = document.querySelector(".vanilla-modal");
          if (!vanillaModal) {
            console.log("there is no vanilla modal class");
            modal.init();
            vanillaModal = document.querySelector(".vanilla-modal");
          }

          var content = document.getElementById(idContent);
          var currentModalContent = content.cloneNode(true);
          currentModalContent.classList.add("current-modal");
          currentModalContent.style = "";
          document
            .getElementById("modal-content")
            .appendChild(currentModalContent);

          if (!option.default) {
            if (option.width && option.height) {
              document.getElementById("modal-content").style.width =
                option.width;
              document.getElementById("modal-content").style.height =
                option.height;
            }
          }
          vanillaModal.classList.add("modal-visible");

          document.addEventListener("click", outsideClick, true);
          document.addEventListener("keydown", escKey);
          document
            .getElementById("modal-content")
            .addEventListener("click", closeClick);
        },

        close: function close() {
          closeModal();
        },
      };

      exports.default = modal;

      /***/
    },
    /* 26 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _inputmask = __webpack_require__(27);

      var _inputmask2 = _interopRequireDefault(_inputmask);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function inputFunction(component) {
        var date = component.classList.contains("date");
        var datepicker = component.classList.contains("datepicker");
        if (date || datepicker) {
          (0, _inputmask2.default)(component);
        }
      }

      exports.default = inputFunction;

      /***/
    },
    /* 27 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      function inputmask(input) {
        var that = input;

        that.addEventListener("keyup", function (e) {
          // Prepend 0 to Month when press the key 2 or any more then 2 number because Month will not starting form 2 or more.
          if (that.value.length == 1 && parseInt(e.key) >= 2) {
            that.value = "0" + e.key;
          }

          // Prepend 0 to Day when press the key 4 or any more then 4 number because Date will not starting form 4 or more.
          if (that.value.length == 4 && parseInt(e.key) >= 4) {
            that.value = that.value.slice(0, 3) + "0" + e.key;
          }
        });

        that.addEventListener("keypress", function (e) {
          var len = that.value.length;
          // Stop typing when length 10
          if (len >= 10) {
            e.preventDefault();
          }
        });

        that.addEventListener("keydown", function (e) {
          if (e.keyCode < 47 || e.keyCode > 57) {
            e.preventDefault();
          }

          var len = that.value.length;
          // If we're at a particular place, let the admin type the slash
          // i.e., 12/12/1212
          if (len !== 1 || len !== 3) {
            if (e.keyCode == 47) {
              e.preventDefault();
            }
          }

          // If they don't add the slash, do it for them...
          if (len === 2) {
            that.value += "/";
          }

          // If they don't add the slash, do it for them...
          if (len === 5) {
            that.value += "/";
          }

          if (e.keyCode == 8) {
            that.value = "";
          }
        });
      }

      exports.default = inputmask;

      /***/
    },
    /* 28 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _axios = __webpack_require__(5);

      var _axios2 = _interopRequireDefault(_axios);

      var _activeTab = __webpack_require__(4);

      var _activeTab2 = _interopRequireDefault(_activeTab);

      var _viewItem = __webpack_require__(15);

      var _viewItem2 = _interopRequireDefault(_viewItem);

      var _dataGrid = __webpack_require__(6);

      var _dataGrid2 = _interopRequireDefault(_dataGrid);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      // convert form data to json
      function toJson(form) {
        var obj = {};

        var elements = form.querySelectorAll("input, select, textarea");
        for (var i = 0; i < elements.length; ++i) {
          var element = elements[i];
          var name = element.name;
          var value = element.value;

          if (name && element.dataset.disabled != "true") {
            obj[name] = value;
          }
        }
        return obj;
      }

      function ajaxForm(form, component) {
        //e.preventDefault();
        var dataTable = document.querySelector(
          '.component[data-component="dataTable"]'
        );
        var element = component.querySelector(".loaderWarpper");
        var alertSuccess = component.querySelector(".alert-success");
        var alertError = component.querySelector(".alert-error");
        element.classList.add("show");

        var json = toJson(form);

        //if element iput was empty convert his value to undefined
        for (var key in json) {
          if (json.hasOwnProperty(key)) {
            var field = json[key];
            if (!field || !field.trim()) {
              json[key] = undefined;
              delete json[key];
            }
          }
        }

        _axios2.default
          .post(form.action, json)
          .then(function (res) {
            alertSuccess.innerHTML = res.data;
            element.classList.remove("show");
            // Refresh table when adding/updating an entry
            var activePaginationButton = document.querySelector(
              "#pagination > ul > li.active"
            );
            activePaginationButton
              ? _dataGrid2.default.refresh(dataTable)
              : _dataGrid2.default.init(dataTable, ".table", "form.ajax");
            var actionClic = form.dataset.read + res.data.data._id;
            var formtype = form.dataset.formtype || "standard";
            (0, _viewItem2.default)(actionClic, [formtype]);
            setTimeout(function () {
              // alertSuccess.classList.add("show");
              // Show updated or new data
              // we have option to show res data , but since we didnt populate data after save , we call api again
            }, 200);
          })
          .catch(function (error) {
            console.log(error);
            alertError.classList.add("show");
            setTimeout(function () {
              element.classList.remove("show");
            }, 1000);
          });
      }

      function ajaxFormSubmit(component, formName) {
        component.querySelector("button.cancel").addEventListener(
          "click",
          function (e) {
            (0, _activeTab2.default)(["read"]);
          },
          false
        );

        component.querySelector(".alert").addEventListener(
          "click",
          function (e) {
            this.classList.remove("show");
          },
          false
        );
        component.querySelector(".loaderWarpper").addEventListener(
          "click",
          function (e) {
            this.classList.remove("show");
          },
          false
        );

        var form = component.querySelector(formName);
        //form.on('submit', ajaxForm)
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          ajaxForm(form, component);
        });
      }

      exports.default = ajaxFormSubmit;

      /***/
    },
    /* 29 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var utils = __webpack_require__(0);
      var bind = __webpack_require__(7);
      var Axios = __webpack_require__(31);
      var mergeConfig = __webpack_require__(13);
      var defaults = __webpack_require__(10);

      /**
       * Create an instance of Axios
       *
       * @param {Object} defaultConfig The default config for the instance
       * @return {Axios} A new instance of Axios
       */
      function createInstance(defaultConfig) {
        var context = new Axios(defaultConfig);
        var instance = bind(Axios.prototype.request, context);

        // Copy axios.prototype to instance
        utils.extend(instance, Axios.prototype, context);

        // Copy context to instance
        utils.extend(instance, context);

        return instance;
      }

      // Create the default instance to be exported
      var axios = createInstance(defaults);

      // Expose Axios class to allow class inheritance
      axios.Axios = Axios;

      // Factory for creating new instances
      axios.create = function create(instanceConfig) {
        return createInstance(mergeConfig(axios.defaults, instanceConfig));
      };

      // Expose Cancel & CancelToken
      axios.Cancel = __webpack_require__(14);
      axios.CancelToken = __webpack_require__(44);
      axios.isCancel = __webpack_require__(9);

      // Expose all/spread
      axios.all = function all(promises) {
        return Promise.all(promises);
      };
      axios.spread = __webpack_require__(45);

      module.exports = axios;

      // Allow use of default import syntax in TypeScript
      module.exports.default = axios;

      /***/
    },
    /* 30 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      /*!
       * Determine if an object is a Buffer
       *
       * @author   Feross Aboukhadijeh <https://feross.org>
       * @license  MIT
       */

      module.exports = function isBuffer(obj) {
        return (
          obj != null &&
          obj.constructor != null &&
          typeof obj.constructor.isBuffer === "function" &&
          obj.constructor.isBuffer(obj)
        );
      };

      /***/
    },
    /* 31 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var utils = __webpack_require__(0);
      var buildURL = __webpack_require__(8);
      var InterceptorManager = __webpack_require__(32);
      var dispatchRequest = __webpack_require__(33);
      var mergeConfig = __webpack_require__(13);

      /**
       * Create a new instance of Axios
       *
       * @param {Object} instanceConfig The default config for the instance
       */
      function Axios(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
          request: new InterceptorManager(),
          response: new InterceptorManager(),
        };
      }

      /**
       * Dispatch a request
       *
       * @param {Object} config The config specific for this request (merged with this.defaults)
       */
      Axios.prototype.request = function request(config) {
        /*eslint no-param-reassign:0*/
        // Allow for axios('example/url'[, config]) a la fetch API
        if (typeof config === "string") {
          config = arguments[1] || {};
          config.url = arguments[0];
        } else {
          config = config || {};
        }

        config = mergeConfig(this.defaults, config);
        config.method = config.method ? config.method.toLowerCase() : "get";

        // Hook up interceptors middleware
        var chain = [dispatchRequest, undefined];
        var promise = Promise.resolve(config);

        this.interceptors.request.forEach(function unshiftRequestInterceptors(
          interceptor
        ) {
          chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        this.interceptors.response.forEach(function pushResponseInterceptors(
          interceptor
        ) {
          chain.push(interceptor.fulfilled, interceptor.rejected);
        });

        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      };

      Axios.prototype.getUri = function getUri(config) {
        config = mergeConfig(this.defaults, config);
        return buildURL(
          config.url,
          config.params,
          config.paramsSerializer
        ).replace(/^\?/, "");
      };

      // Provide aliases for supported request methods
      utils.forEach(
        ["delete", "get", "head", "options"],
        function forEachMethodNoData(method) {
          /*eslint func-names:0*/
          Axios.prototype[method] = function (url, config) {
            return this.request(
              utils.merge(config || {}, {
                method: method,
                url: url,
              })
            );
          };
        }
      );

      utils.forEach(["post", "put", "patch"], function forEachMethodWithData(
        method
      ) {
        /*eslint func-names:0*/
        Axios.prototype[method] = function (url, data, config) {
          return this.request(
            utils.merge(config || {}, {
              method: method,
              url: url,
              data: data,
            })
          );
        };
      });

      module.exports = Axios;

      /***/
    },
    /* 32 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var utils = __webpack_require__(0);

      function InterceptorManager() {
        this.handlers = [];
      }

      /**
       * Add a new interceptor to the stack
       *
       * @param {Function} fulfilled The function to handle `then` for a `Promise`
       * @param {Function} rejected The function to handle `reject` for a `Promise`
       *
       * @return {Number} An ID used to remove interceptor later
       */
      InterceptorManager.prototype.use = function use(fulfilled, rejected) {
        this.handlers.push({
          fulfilled: fulfilled,
          rejected: rejected,
        });
        return this.handlers.length - 1;
      };

      /**
       * Remove an interceptor from the stack
       *
       * @param {Number} id The ID that was returned by `use`
       */
      InterceptorManager.prototype.eject = function eject(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      };

      /**
       * Iterate over all the registered interceptors
       *
       * This method is particularly useful for skipping over any
       * interceptors that may have become `null` calling `eject`.
       *
       * @param {Function} fn The function to call for each interceptor
       */
      InterceptorManager.prototype.forEach = function forEach(fn) {
        utils.forEach(this.handlers, function forEachHandler(h) {
          if (h !== null) {
            fn(h);
          }
        });
      };

      module.exports = InterceptorManager;

      /***/
    },
    /* 33 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var utils = __webpack_require__(0);
      var transformData = __webpack_require__(34);
      var isCancel = __webpack_require__(9);
      var defaults = __webpack_require__(10);
      var isAbsoluteURL = __webpack_require__(42);
      var combineURLs = __webpack_require__(43);

      /**
       * Throws a `Cancel` if cancellation has been requested.
       */
      function throwIfCancellationRequested(config) {
        if (config.cancelToken) {
          config.cancelToken.throwIfRequested();
        }
      }

      /**
       * Dispatch a request to the server using the configured adapter.
       *
       * @param {object} config The config that is to be used for the request
       * @returns {Promise} The Promise to be fulfilled
       */
      module.exports = function dispatchRequest(config) {
        throwIfCancellationRequested(config);

        // Support baseURL config
        if (config.baseURL && !isAbsoluteURL(config.url)) {
          config.url = combineURLs(config.baseURL, config.url);
        }

        // Ensure headers exist
        config.headers = config.headers || {};

        // Transform request data
        config.data = transformData(
          config.data,
          config.headers,
          config.transformRequest
        );

        // Flatten headers
        config.headers = utils.merge(
          config.headers.common || {},
          config.headers[config.method] || {},
          config.headers || {}
        );

        utils.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          function cleanHeaderConfig(method) {
            delete config.headers[method];
          }
        );

        var adapter = config.adapter || defaults.adapter;

        return adapter(config).then(
          function onAdapterResolution(response) {
            throwIfCancellationRequested(config);

            // Transform response data
            response.data = transformData(
              response.data,
              response.headers,
              config.transformResponse
            );

            return response;
          },
          function onAdapterRejection(reason) {
            if (!isCancel(reason)) {
              throwIfCancellationRequested(config);

              // Transform response data
              if (reason && reason.response) {
                reason.response.data = transformData(
                  reason.response.data,
                  reason.response.headers,
                  config.transformResponse
                );
              }
            }

            return Promise.reject(reason);
          }
        );
      };

      /***/
    },
    /* 34 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var utils = __webpack_require__(0);

      /**
       * Transform the data for a request or a response
       *
       * @param {Object|String} data The data to be transformed
       * @param {Array} headers The headers for the request or response
       * @param {Array|Function} fns A single function or Array of functions
       * @returns {*} The resulting transformed data
       */
      module.exports = function transformData(data, headers, fns) {
        /*eslint no-param-reassign:0*/
        utils.forEach(fns, function transform(fn) {
          data = fn(data, headers);
        });

        return data;
      };

      /***/
    },
    /* 35 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      // shim for using process in browser
      var process = (module.exports = {});

      // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;

      function defaultSetTimout() {
        throw new Error("setTimeout has not been defined");
      }
      function defaultClearTimeout() {
        throw new Error("clearTimeout has not been defined");
      }
      (function () {
        try {
          if (typeof setTimeout === "function") {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === "function") {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if (
          (cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) &&
          setTimeout
        ) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if (
          (cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) &&
          clearTimeout
        ) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;

      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }

      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }

      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };

      // v8 likes predictible objects
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };
      process.title = "browser";
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ""; // empty string to avoid regexp issues
      process.versions = {};

      function noop() {}

      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;

      process.listeners = function (name) {
        return [];
      };

      process.binding = function (name) {
        throw new Error("process.binding is not supported");
      };

      process.cwd = function () {
        return "/";
      };
      process.chdir = function (dir) {
        throw new Error("process.chdir is not supported");
      };
      process.umask = function () {
        return 0;
      };

      /***/
    },
    /* 36 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var utils = __webpack_require__(0);

      module.exports = function normalizeHeaderName(headers, normalizedName) {
        utils.forEach(headers, function processHeader(value, name) {
          if (
            name !== normalizedName &&
            name.toUpperCase() === normalizedName.toUpperCase()
          ) {
            headers[normalizedName] = value;
            delete headers[name];
          }
        });
      };

      /***/
    },
    /* 37 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var createError = __webpack_require__(12);

      /**
       * Resolve or reject a Promise based on response status.
       *
       * @param {Function} resolve A function that resolves the promise.
       * @param {Function} reject A function that rejects the promise.
       * @param {object} response The response.
       */
      module.exports = function settle(resolve, reject, response) {
        var validateStatus = response.config.validateStatus;
        if (!validateStatus || validateStatus(response.status)) {
          resolve(response);
        } else {
          reject(
            createError(
              "Request failed with status code " + response.status,
              response.config,
              null,
              response.request,
              response
            )
          );
        }
      };

      /***/
    },
    /* 38 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      /**
       * Update an Error with the specified config, error code, and response.
       *
       * @param {Error} error The error to update.
       * @param {Object} config The config.
       * @param {string} [code] The error code (for example, 'ECONNABORTED').
       * @param {Object} [request] The request.
       * @param {Object} [response] The response.
       * @returns {Error} The error.
       */

      module.exports = function enhanceError(
        error,
        config,
        code,
        request,
        response
      ) {
        error.config = config;
        if (code) {
          error.code = code;
        }

        error.request = request;
        error.response = response;
        error.isAxiosError = true;

        error.toJSON = function () {
          return {
            // Standard
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Axios
            config: this.config,
            code: this.code,
          };
        };
        return error;
      };

      /***/
    },
    /* 39 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var utils = __webpack_require__(0);

      // Headers whose duplicates are ignored by node
      // c.f. https://nodejs.org/api/http.html#http_message_headers
      var ignoreDuplicateOf = [
        "age",
        "authorization",
        "content-length",
        "content-type",
        "etag",
        "expires",
        "from",
        "host",
        "if-modified-since",
        "if-unmodified-since",
        "last-modified",
        "location",
        "max-forwards",
        "proxy-authorization",
        "referer",
        "retry-after",
        "admin-agent",
      ];

      /**
       * Parse headers into an object
       *
       * ```
       * Date: Wed, 27 Aug 2014 08:58:49 GMT
       * Content-Type: application/json
       * Connection: keep-alive
       * Transfer-Encoding: chunked
       * ```
       *
       * @param {String} headers Headers needing to be parsed
       * @returns {Object} Headers parsed into an object
       */
      module.exports = function parseHeaders(headers) {
        var parsed = {};
        var key;
        var val;
        var i;

        if (!headers) {
          return parsed;
        }

        utils.forEach(headers.split("\n"), function parser(line) {
          i = line.indexOf(":");
          key = utils.trim(line.substr(0, i)).toLowerCase();
          val = utils.trim(line.substr(i + 1));

          if (key) {
            if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
              return;
            }
            if (key === "set-cookie") {
              parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
            } else {
              parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
            }
          }
        });

        return parsed;
      };

      /***/
    },
    /* 40 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var utils = __webpack_require__(0);

      module.exports = utils.isStandardBrowserEnv()
        ? // Standard browser envs have full support of the APIs needed to test
          // whether the request URL is of the same origin as current location.
          (function standardBrowserEnv() {
            var msie = /(msie|trident)/i.test(navigator.adminAgent);
            var urlParsingNode = document.createElement("a");
            var originURL;

            /**
             * Parse a URL to discover it's components
             *
             * @param {String} url The URL to be parsed
             * @returns {Object}
             */
            function resolveURL(url) {
              var href = url;

              if (msie) {
                // IE needs attribute set twice to normalize properties
                urlParsingNode.setAttribute("href", href);
                href = urlParsingNode.href;
              }

              urlParsingNode.setAttribute("href", href);

              // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
              return {
                href: urlParsingNode.href,
                protocol: urlParsingNode.protocol
                  ? urlParsingNode.protocol.replace(/:$/, "")
                  : "",
                host: urlParsingNode.host,
                search: urlParsingNode.search
                  ? urlParsingNode.search.replace(/^\?/, "")
                  : "",
                hash: urlParsingNode.hash
                  ? urlParsingNode.hash.replace(/^#/, "")
                  : "",
                hostname: urlParsingNode.hostname,
                port: urlParsingNode.port,
                pathname:
                  urlParsingNode.pathname.charAt(0) === "/"
                    ? urlParsingNode.pathname
                    : "/" + urlParsingNode.pathname,
              };
            }

            originURL = resolveURL(window.location.href);

            /**
             * Determine if a URL shares the same origin as the current location
             *
             * @param {String} requestURL The URL to test
             * @returns {boolean} True if URL shares the same origin, otherwise false
             */
            return function isURLSameOrigin(requestURL) {
              var parsed = utils.isString(requestURL)
                ? resolveURL(requestURL)
                : requestURL;
              return (
                parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host
              );
            };
          })()
        : // Non standard browser envs (web workers, react-native) lack needed support.
          (function nonStandardBrowserEnv() {
            return function isURLSameOrigin() {
              return true;
            };
          })();

      /***/
    },
    /* 41 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var utils = __webpack_require__(0);

      module.exports = utils.isStandardBrowserEnv()
        ? // Standard browser envs support document.cookie
          (function standardBrowserEnv() {
            return {
              write: function write(
                name,
                value,
                expires,
                path,
                domain,
                secure
              ) {
                var cookie = [];
                cookie.push(name + "=" + encodeURIComponent(value));

                if (utils.isNumber(expires)) {
                  cookie.push("expires=" + new Date(expires).toGMTString());
                }

                if (utils.isString(path)) {
                  cookie.push("path=" + path);
                }

                if (utils.isString(domain)) {
                  cookie.push("domain=" + domain);
                }

                if (secure === true) {
                  cookie.push("secure");
                }

                document.cookie = cookie.join("; ");
              },

              read: function read(name) {
                var match = document.cookie.match(
                  new RegExp("(^|;\\s*)(" + name + ")=([^;]*)")
                );
                return match ? decodeURIComponent(match[3]) : null;
              },

              remove: function remove(name) {
                this.write(name, "", Date.now() - 86400000);
              },
            };
          })()
        : // Non standard browser env (web workers, react-native) lack needed support.
          (function nonStandardBrowserEnv() {
            return {
              write: function write() {},
              read: function read() {
                return null;
              },
              remove: function remove() {},
            };
          })();

      /***/
    },
    /* 42 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      /**
       * Determines whether the specified URL is absolute
       *
       * @param {string} url The URL to test
       * @returns {boolean} True if the specified URL is absolute, otherwise false
       */

      module.exports = function isAbsoluteURL(url) {
        // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
        // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
        // by any combination of letters, digits, plus, period, or hyphen.
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
      };

      /***/
    },
    /* 43 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      /**
       * Creates a new URL by combining the specified URLs
       *
       * @param {string} baseURL The base URL
       * @param {string} relativeURL The relative URL
       * @returns {string} The combined URL
       */

      module.exports = function combineURLs(baseURL, relativeURL) {
        return relativeURL
          ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
          : baseURL;
      };

      /***/
    },
    /* 44 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      var Cancel = __webpack_require__(14);

      /**
       * A `CancelToken` is an object that can be used to request cancellation of an operation.
       *
       * @class
       * @param {Function} executor The executor function.
       */
      function CancelToken(executor) {
        if (typeof executor !== "function") {
          throw new TypeError("executor must be a function.");
        }

        var resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
          resolvePromise = resolve;
        });

        var token = this;
        executor(function cancel(message) {
          if (token.reason) {
            // Cancellation has already been requested
            return;
          }

          token.reason = new Cancel(message);
          resolvePromise(token.reason);
        });
      }

      /**
       * Throws a `Cancel` if cancellation has been requested.
       */
      CancelToken.prototype.throwIfRequested = function throwIfRequested() {
        if (this.reason) {
          throw this.reason;
        }
      };

      /**
       * Returns an object that contains a new `CancelToken` and a function that, when called,
       * cancels the `CancelToken`.
       */
      CancelToken.source = function source() {
        var cancel;
        var token = new CancelToken(function executor(c) {
          cancel = c;
        });
        return {
          token: token,
          cancel: cancel,
        };
      };

      module.exports = CancelToken;

      /***/
    },
    /* 45 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      /**
       * Syntactic sugar for invoking a function and expanding an array for arguments.
       *
       * Common use case would be to use `Function.prototype.apply`.
       *
       *  ```js
       *  function f(x, y, z) {}
       *  var args = [1, 2, 3];
       *  f.apply(null, args);
       *  ```
       *
       * With `spread` this example can be re-written.
       *
       *  ```js
       *  spread(function(x, y, z) {})([1, 2, 3]);
       *  ```
       *
       * @param {Function} callback
       * @returns {Function}
       */

      module.exports = function spread(callback) {
        return function wrap(arr) {
          return callback.apply(null, arr);
        };
      };

      /***/
    },
    /* 46 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _helper = __webpack_require__(2);

      function ajaxDataRead(component, divResultName, res) {
        var divResult = component.querySelector(divResultName);
        var list = divResult.dataset.listinfos;
        divResult.innerHTML = "";
        console.log(res);
        var data = res.data;
        var obj = JSON.parse(list);
        console.log(res);

        for (var i = 0; i < obj.length; ++i) {
          var listItem = document.createElement("li");
          var propKey = obj[i].key;
          var propText = obj[i].text;
          var textItem = document.createElement("p");
          var point = document.createElement("p");
          var valueItem = document.createElement("p");
          textItem.textContent = propText;
          point.textContent = ":";
          listItem.appendChild(textItem);
          listItem.appendChild(point);
          valueItem.textContent = (0, _helper.valueByString)(data, propKey);
          listItem.appendChild(valueItem);
          divResult.appendChild(listItem);
        }
      }

      exports.default = ajaxDataRead;

      /***/
    },
    /* 47 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }

      function AudioRecorder(options) {
        var defaultOptios = {
          onProgress: function onProgress(time) {},
          onStart: function onStart(_ref) {
            var gIsRecording = _ref.gIsRecording,
              gNode = _ref.gNode,
              gAudioSrc = _ref.gAudioSrc;
          },
          onStop: function onStop(_ref2) {
            var gIsRecording = _ref2.gIsRecording,
              gNode = _ref2.gNode,
              gAudioSrc = _ref2.gAudioSrc,
              blob = _ref2.blob;
          },
          onReady: function onReady() {},
          onLog: function onLog(string) {},
          onStatus: function onStatus(string) {},
        };
        if (options == undefined) {
          options = {};
        }
        options = Object.assign(defaultOptios, options);

        console.log({ options: options });
        //console.log({recorder});
        //return;
        var maxBuffers = 0;
        var timer = 0;
        var timeInterval = null;
        var gAudio = null; //Audio context
        var gAudioSrc = null; //Audio source
        var gNode = null; //The audio processor node
        var gIsLame = true; //Has lame.min.js been loaded?
        var gLame = null; //The LAME encoder library
        var gEncoder = null; //The MP3 encoder object
        var gStrmMp3 = []; //Collection of MP3 buffers
        var gIsRecording = false;
        var gCfg = {
          //Encoder configuration
          chnlCt: 1, //1=mono, 2=stereo
          bufSz: 4096, //input buffer size (bytes), 16bit signed int.
          sampleRate: 44100, //Input sample rate (samples per second)
          bitRate: 64, //Output bit rate (9-128)
        };
        var gPcmCt = 0; //Total input bytes
        var gMp3Ct = 0; //Total output bytes
        var timeLimit = 2 * 60 * 60 * 1000;

        status("00:00:00", "init");

        function Init() {
          status("Loading...");
          var caps = {
            audio: true,
          };
          try {
            window.AudioContext =
              window.AudioContext || window.webkitAudioContext || AudioContext;
            navigator.getAdminMedia =
              navigator.getAdminMedia ||
              navigator.webkitGetAdminMedia ||
              navigator.mozGetAdminMedia ||
              navigator.msGetAdminMedia ||
              MediaDevices.getAdminMedia;
            if (!(gAudio = new window.AudioContext())) {
              status("OPPS: Unable to create AudioContext.");
            } else {
              navigator.getAdminMedia(
                caps,
                function (stream) {
                  if (!(gAudioSrc = gAudio.createMediaStreamSource(stream))) {
                    status("OPPS: Unable to create audio source.");
                  } else if (!gIsLame) {
                    status("Loading... "); //Fetching encoder...
                    loadScript(
                      "lame",
                      "https://aws.nlited.org/js/lame.js",
                      LameCreate
                    );
                  } else {
                    LameCreate();
                  }
                },
                function (ex) {
                  console.log(ex);
                  status("OPPS: " + ex);
                }
              );
            }
          } catch (ex) {
            status("OPPS: Unable to find any audio support.");
            gAudio = null;
          }
        }
        //Shut everything down.
        function Destory() {
          log("Power down...");
          if (gIsRecording) {
            log("ERR: PowerOff: You need to stop recording first.");
          } else {
            gEncoder = null;
            gLame = null;
            gNode = null;
            gAudioSrc = null;
            gAudio = null;
            log("Power OFF.");
          }
        }
        //Called when audio capture has been created.

        //Called when the lame library has been loaded.
        function LameCreate() {
          gIsLame = true;
          if (!(gEncoder = Mp3Create())) {
            log("OPPS: Unable to create MP3 encoder.");
          } else {
            gStrmMp3 = [];
            gPcmCt = 0;
            gMp3Ct = 0;
            if (options.onReady) {
              options.onReady();
            }
            proccessRecording();
          }
        }
        //Create the mp3 encoder object.
        function Mp3Create() {
          if (!(gLame = new lamejs())) {
            log("OPPS: Unable to create LAME object.");
          } else if (
            !(gEncoder = new gLame.Mp3Encoder(
              gCfg.chnlCt,
              gCfg.sampleRate,
              gCfg.bitRate
            ))
          ) {
            log("OPPS: Unable to create MP3 encoder.");
          } else {
            log("MP3 encoder created.");
          }
          return gEncoder;
        }

        function convertSeconds(sec) {
          sec = parseInt(sec);
          var hrs = Math.floor(sec / 3600);
          var min = Math.floor((sec - hrs * 3600) / 60);
          var seconds = sec - hrs * 3600 - min * 60;
          seconds = Math.round(seconds * 100) / 100;

          var result = hrs < 10 ? "0" + hrs : hrs;
          result += ":" + (min < 10 ? "0" + min : min);
          result += ":" + (seconds < 10 ? "0" + seconds : seconds);
          return result;
        }

        function startRecording() {
          Init();
        }
        function proccessRecording() {
          var creator;
          //status("Start recording...");

          if (!gAudio) {
            status("ERR: No Audio source.");
          } else if (!gEncoder) {
            log("OPPS: No encoder.");
          } else if (gIsRecording) {
            log("OPPS: Already recording.");
          } else {
            //Create the audio capture node.
            if (!gNode) {
              if (
                !(creator =
                  gAudioSrc.context.createScriptProcessor ||
                  gAudioSrc.createJavaScriptNode)
              ) {
                log("OPPS: No processor creator?");
              } else if (
                !(gNode = creator.call(
                  gAudioSrc.context,
                  gCfg.bufSz,
                  gCfg.chnlCt,
                  gCfg.chnlCt
                ))
              ) {
                log("OPPS: Unable to create processor node.");
              }
            }
            if (!gNode) {
              log("OPPS: onRecord: No processor node.");
            } else {
              var processor = gAudioSrc.context;
              maxBuffers = Math.ceil((timeLimit * processor.sampleRate) / 1024);
              //Set callbacks, connect the node between the audio source and destination.
              gNode.onaudioprocess = onAudioProcess;
              gAudioSrc.connect(gNode);
              gNode.connect(gAudioSrc.context.destination);
              gIsRecording = true;

              var timer = 0;
              log("RECORD");
              status("00:00:00");
              timeInterval = setInterval(function () {
                timer++;
                var time = convertSeconds(timer);
                if (options.onProgress) {
                  options.onProgress(time);
                }
                status("" + time);
              }, 1000);

              if (options.onStart) {
                options.onStart({
                  gIsRecording: gIsRecording,
                  gNode: gNode,
                  gAudioSrc: gAudioSrc,
                });
              }
            }
          }
        }

        //Stop recording
        function stopRecording(btn) {
          log("Stop recording...");
          if (!gAudio) {
            log("OPPS: onStop: No audio.");
          } else if (!gAudioSrc) {
            log("OPPS: onStop: No audio source.");
          } else if (!gIsRecording) {
            log("OPPS: onStop: Not recording.");
          } else {
            //Disconnect the node
            gNode.onaudioprocess = null;
            gAudioSrc.disconnect(gNode);
            gNode.disconnect();
            gIsRecording = false;
            //Flush the last mp3 buffer.
            var mp3 = gEncoder.flush();
            if (mp3.length > 0) gStrmMp3.push(mp3);
            //Present the mp3 stream on the page.
            var blob = new Blob(gStrmMp3, {
              type: "audio/mp3",
            });
            clearInterval(timeInterval);
            Destory();
            if (options.onStop) {
              var _options$onStop;

              options.onStop(
                ((_options$onStop = {
                  blob: blob,
                  gNode: gNode,
                  gAudioSrc: gAudioSrc,
                }),
                _defineProperty(_options$onStop, "gNode", gNode),
                _defineProperty(_options$onStop, "gIsRecording", gIsRecording),
                _options$onStop)
              );
            }
            log("STOP");
          }
        }
        //Process a single audio buffer.
        //Input is an array of floating-point samples.
        function onAudioProcess(e) {
          if (gMp3Ct > maxBuffers) return;

          var inBuf = e.inputBuffer;
          var samples = inBuf.getChannelData(0);
          var sampleCt = samples.length;
          //Convert floating-point to 16bit signed int.
          //This may modify the number of samples.
          var samples16 = convertFloatToInt16(samples);
          if (samples16.length > 0) {
            gPcmCt += samples16.length * 2;
            //Encode PCM to mp3
            var mp3buf = gEncoder.encodeBuffer(samples16);
            var mp3Ct = mp3buf.length;
            if (mp3Ct > 0) {
              //Add buffer to in-memory output stream.
              gStrmMp3.push(mp3buf);
              gMp3Ct += mp3Ct;
            }
            var pre = (gMp3Ct * 100) / gPcmCt;
          }
        }
        //Convert floating point to 16bit signed int.
        function convertFloatToInt16(inFloat) {
          var sampleCt = inFloat.length;
          var outInt16 = new Int16Array(sampleCt);
          for (var n1 = 0; n1 < sampleCt; n1++) {
            //This is where I can apply waveform modifiers.
            var sample16 = 0x8000 * inFloat[n1];
            //Clamp value to avoid integer overflow, which causes audible pops and clicks.
            sample16 =
              sample16 < -32767 ? -32767 : sample16 > 32767 ? 32767 : sample16;
            outInt16[n1] = sample16;
          }
          return outInt16;
        }

        function loadScript(name, path, cb) {
          var node = document.createElement("SCRIPT");
          node.type = "text/javascript";
          node.src = path;
          var head = document.getElementsByTagName("HEAD");
          if (head[0] != null) head[0].appendChild(node);
          if (cb != null) {
            node.onreadystagechange = cb;
            node.onload = cb;
          }
        }

        function log(fmt) {
          console.log("log", fmt);
          if (options.onLog) {
            options.onLog(fmt);
          }
        }

        function status(fmt, type) {
          console.log("status", fmt);
          if (options.onStatus) {
            options.onStatus(fmt, type);
          }
        }

        return {
          init: Init,
          destory: Destory,
          startRecording: startRecording,
          stopRecording: stopRecording,
        };
      }
      exports.default = AudioRecorder;

      /***/
    },
    /* 48 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _ajaxGetData = __webpack_require__(1);

      var _ajaxGetData2 = _interopRequireDefault(_ajaxGetData);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function ajaxSelectInput(component, ajaxSelectName, ajaxResultName) {
        var ajaxSelect = component.querySelector(ajaxSelectName);
        var resultId = ajaxSelect.dataset.id;
        var className = ajaxResultName + '[data-id="' + resultId + '"]';
        var ajaxResult = document.querySelector(className);

        ajaxSelect.addEventListener(
          "change",
          function () {
            console.log("e.target.value = " + this.value);
            // const id =this.dataset.id;

            var actionClic = this.dataset.ajax + this.value;

            ajaxResult.disabled = true;
            ajaxResult.selectedIndex = 0;
            ajaxResult.options.length = 0;

            var result = (0, _ajaxGetData2.default)(actionClic);

            result.then(function (res) {
              if (res.success == 1) {
                var datas = res.data;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (
                    var _iterator = datas[Symbol.iterator](), _step;
                    !(_iteratorNormalCompletion = (_step = _iterator.next())
                      .done);
                    _iteratorNormalCompletion = true
                  ) {
                    var data = _step.value;

                    ajaxResult.options[ajaxResult.options.length] = new Option(
                      data.name + " " + data.surname,
                      data._id
                    );
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }

                if (ajaxResult.options.length >= 1) {
                  ajaxResult.disabled = false;
                }
                if (ajaxResult.dataset.value) {
                  ajaxResult.value = ajaxResult.dataset.value;
                  var e = new Event("change");
                  ajaxResult.dispatchEvent(e);
                }
              } else {
                return;
              }
            });
          },
          false
        );
      }

      exports.default = ajaxSelectInput;

      /***/
    },
    /* 49 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _ajaxGetData = __webpack_require__(1);

      var _ajaxGetData2 = _interopRequireDefault(_ajaxGetData);

      var _helper = __webpack_require__(2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function ajaxAutocomplete(component, inputName) {
        /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
        var inp = component.querySelector(inputName);
        var currentFocus;

        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
          removeHiddenSelect();

          var that = this;
          var a,
            b,
            i,
            val = this.value;
          var inpSelect = document.createElement("SELECT");
          inpSelect.name = this.dataset.name;
          var output = this.dataset.output || "_id";
          inpSelect.hidden = true;
          inpSelect.setAttribute("id", "hiddenSelect");

          /*close any already open lists of autocompleted values*/
          closeAllLists();
          if (!val) {
            return false;
          }
          currentFocus = -1;
          /*create a DIV element that will contain the items (values):*/
          a = document.createElement("DIV");
          a.setAttribute("id", this.id + "autocomplete-list");
          a.setAttribute("class", "autocomplete-items");
          /*append the DIV element as a child of the autocomplete container:*/
          this.parentNode.appendChild(a);
          /*for each item in the array...*/

          var actionClic = this.dataset.ajax + this.value;
          var result = (0, _ajaxGetData2.default)(actionClic);
          result.then(function (res) {
            var list = new Array(res.data.length);
            var listID = new Array(res.data.length);
            if (res.data.length) {
              var _loop = function _loop(_i) {
                var data = res.data[_i];
                displayLabel = "";

                if (that.dataset.label) {
                  displayLabel = (0, _helper.valueByString)(
                    res.data[_i],
                    that.dataset.label
                  );
                } else {
                  displayLabel = res.data[_i];
                }
                listID[_i] = data[output];

                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = displayLabel.substr(0, val.length);
                b.innerHTML += displayLabel.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML +=
                  "<input type='hidden' value='" +
                  displayLabel +
                  "' data-value='" +
                  listID[_i] +
                  "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/

                b.addEventListener("click", function (e) {
                  /*insert the value for the autocomplete text field:*/
                  inp.value = this.getElementsByTagName("input")[0].value;
                  inp.dataset.value = this.getElementsByTagName(
                    "input"
                  )[0].dataset.value;
                  var valOption = this.getElementsByTagName("input")[0].dataset
                    .value;
                  var textOption = this.getElementsByTagName("input")[0].value;
                  inpSelect.options[0] = new Option(textOption, valOption);
                  that.parentNode.appendChild(inpSelect);

                  if (inp.dataset.change) {
                    var event = new CustomEvent("select", {
                      detail: {
                        display: displayLabel,
                        id: data._id,
                        data: data,
                      },
                    });
                    inp.dispatchEvent(event);
                  }
                  /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
                  closeAllLists();
                });
                a.appendChild(b);
              };

              for (var _i = 0; _i < res.data.length; _i++) {
                var displayLabel;

                _loop(_i);
              }
            } else {
              b = document.createElement("DIV");
              var noFoundMessage =
                component.getAttribute("data-error-message") ||
                "No result found";
              /*make the matching letters bold:*/
              b.classList.add("no-select");
              b.innerHTML = noFoundMessage;
              /*execute a function when someone clicks on the item value (DIV element):*/
              a.appendChild(b);
            }
          });
        });

        function removeHiddenSelect() {
          var rmvElement = document.querySelectorAll("#hiddenSelect");
          console.log(rmvElement);
          if (rmvElement.length != 0) {
            rmvElement[0].parentNode.removeChild(rmvElement[0]);
          }
        }
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
          var x = document.getElementById(this.id + "autocomplete-list");
          if (x) x = x.getElementsByTagName("div");
          if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 38) {
            //up
            /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
              /*and simulate a click on the "active" item:*/
              if (x) x[currentFocus].click();
            }
          } else if (e.keyCode == 27 || e.keyCode == 9) {
            closeAllLists();
          } else if (e.keyCode == 8) {
            closeAllLists();
            inp.value = "";
            delete inp.dataset.id;
            removeHiddenSelect();
          }
        });
        function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = x.length - 1;
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
    except the one passed as an argument:*/

          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
              x[i].parentNode.removeChild(x[i]);
            }
          }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
          closeAllLists(e.target);
        });
      }

      exports.default = ajaxAutocomplete;

      /***/
    },
    /* 50 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _ajaxGetData = __webpack_require__(1);

      var _ajaxGetData2 = _interopRequireDefault(_ajaxGetData);

      var _helper = __webpack_require__(2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function searchItem(component, inputName) {
        /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
        var inp = component.querySelector(inputName);
        var currentFocus;

        inp.addEventListener("setValue", function (_ref) {
          var detail = _ref.detail;

          var inpSelect = document.createElement("SELECT");
          inpSelect.name = this.dataset.name;
          inpSelect.hidden = true;
          inpSelect.setAttribute("id", "hiddenSelect");
          inpSelect.options[0] = new Option(detail.display, detail.id);
          console.log(detail);
          inp.parentNode.appendChild(inpSelect);
        });
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function () {
          removeHiddenSelect();

          var that = this;
          var a,
            b,
            val = this.value;
          var inpSelect = document.createElement("SELECT");
          inpSelect.name = this.dataset.name;
          var output = this.dataset.output || "_id";
          inpSelect.hidden = true;
          inpSelect.setAttribute("id", "hiddenSelect");

          /*close any already open lists of autocompleted values*/
          closeAllLists();
          if (!val) {
            return false;
          }
          currentFocus = -1;
          /*create a DIV element that will contain the items (values):*/
          a = document.createElement("DIV");
          a.setAttribute("id", this.id + "autocomplete-list");
          a.setAttribute("class", "autocomplete-items");
          /*append the DIV element as a child of the autocomplete container:*/
          this.parentNode.appendChild(a);
          /*for each item in the array...*/

          var actionClic = this.dataset.ajax + this.value;
          var result = (0, _ajaxGetData2.default)(actionClic);
          result.then(function (res) {
            var list = new Array(res.data.length);
            var listID = new Array(res.data.length);

            var arr = list;
            if (arr.length > 0) {
              var _loop = function _loop(i) {
                var data = res.data[i];
                displayLabel = "";

                if (that.dataset.label) {
                  displayLabel = (0, _helper.valueByString)(
                    res.data[i],
                    that.dataset.label
                  );
                } else if (res.data[i].name) {
                  displayLabel = res.data[i].name;
                } else {
                  displayLabel = res.data[i].toString();
                }
                listID[i] = data[output];

                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = displayLabel.substr(0, val.length);
                b.innerHTML += displayLabel.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML +=
                  "<input type='hidden' value='" +
                  displayLabel +
                  "' data-value='" +
                  listID[i] +
                  "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/

                b.addEventListener("click", function () {
                  /*insert the value for the autocomplete text field:*/
                  inp.value = this.getElementsByTagName("input")[0].value;
                  inp.dataset.value = this.getElementsByTagName(
                    "input"
                  )[0].dataset.value;
                  var valOption = this.getElementsByTagName("input")[0].dataset
                    .value;
                  var textOption = this.getElementsByTagName("input")[0].value;
                  inpSelect.options[0] = new Option(textOption, valOption);
                  that.parentNode.appendChild(inpSelect);

                  if (inp.dataset.change) {
                    var event = new CustomEvent("select", {
                      detail: {
                        display: displayLabel,
                        id: data._id,
                        data: data,
                      },
                    });
                    inp.dispatchEvent(event);
                  }
                  /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
                  closeAllLists();
                });
                a.appendChild(b);
              };

              for (var i = 0; i < res.data.length; i++) {
                var displayLabel;

                _loop(i);
              }
            } else {
              b = document.createElement("DIV");
              var noFoundMessage =
                component.getAttribute("data-error-message") ||
                "No result found";
              /*make the matching letters bold:*/
              b.classList.add("no-select");
              b.innerHTML = noFoundMessage;
              /*execute a function when someone clicks on the item value (DIV element):*/
              a.appendChild(b);
            }
          });
        });

        function removeHiddenSelect() {
          var rmvElement = document.querySelectorAll("#hiddenSelect");
          console.log(rmvElement);
          if (rmvElement.length != 0) {
            rmvElement[0].parentNode.removeChild(rmvElement[0]);
          }
        }

        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
          var x = document.getElementById(this.id + "autocomplete-list");
          if (x) x = x.getElementsByTagName("div");
          if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 38) {
            //up
            /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
              /*and simulate a click on the "active" item:*/
              if (x) x[currentFocus].click();
            }
          } else if (e.keyCode == 27 || e.keyCode == 9) {
            closeAllLists();
          } else if (e.keyCode == 8) {
            closeAllLists();
            inp.value = "";
            delete inp.dataset.id;
            removeHiddenSelect();
          }
        });
        function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = x.length - 1;
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
    except the one passed as an argument:*/

          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
              x[i].parentNode.removeChild(x[i]);
            }
          }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
          closeAllLists(e.target);
        });
      }

      exports.default = searchItem;

      /***/
    },
    /* 51 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _tabs = __webpack_require__(52);

      var _tabs2 = _interopRequireDefault(_tabs);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function tabPanel(component, tabName) {
        var myTabs = (0, _tabs2.default)({
          el: tabName,
          tabNavigationLinks: ".tab-link",
          tabContentContainers: ".tab-content",
        });

        myTabs.init();
        //   const dropdown = component.querySelector(".toggle")
        //   dropdown.addEventListener("click", function (e) {
        //     this.querySelector('.toggleOption').classList.toggle('show');
        // }, false);

        component.addEventListener(
          "click",
          function () {
            document.querySelector(".accordionForm").classList.add("disabled");
          },
          false
        );
      }

      exports.default = tabPanel;

      /***/
    },
    /* 52 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";
      // store tabs variable

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      var tabs = function tabs(options) {
        var el = document.querySelector(options.el);
        var tabNavigationLinks = el.querySelectorAll(
          options.tabNavigationLinks
        );
        var tabContentContainers = el.querySelectorAll(
          options.tabContentContainers
        );
        var activeIndex = 0;
        var initCalled = false;

        /**
         * init
         *
         * @description Initializes the component by removing the no-js class from
         *   the component, and attaching event listeners to each of the nav items.
         *   Returns nothing.
         */
        var init = function init() {
          if (!initCalled) {
            initCalled = true;
            el.classList.remove("no-js");

            for (var i = 0; i < tabNavigationLinks.length; i++) {
              var link = tabNavigationLinks[i];
              handleClick(link, i);
            }
          }
        };

        /**
         * handleClick
         *
         * @description Handles click event listeners on each of the links in the
         *   tab navigation. Returns nothing.
         * @param {HTMLElement} link The link to listen for events on
         * @param {Number} index The index of that link
         */
        var handleClick = function handleClick(link, index) {
          link.addEventListener("click", function (e) {
            e.preventDefault();
            goToTab(index);
          });
        };

        /**
         * goToTab
         *
         * @description Goes to a specific tab based on index. Returns nothing.
         * @param {Number} index The index of the tab to go to
         */
        var goToTab = function goToTab(index) {
          if (index >= 0 && index <= tabNavigationLinks.length) {
            console.log(activeIndex);

            [].forEach.call(tabNavigationLinks, function (tabNavigationLink) {
              tabNavigationLink.classList.remove("is-active");
            });
            [].forEach.call(tabContentContainers, function (
              tabContentContainer
            ) {
              tabContentContainer.classList.remove("is-active");
            });

            tabNavigationLinks[index].classList.add("is-active");
            tabContentContainers[index].classList.add("is-active");

            activeIndex = index;
          }
        };

        /**
         * Returns init and goToTab
         */
        return {
          init: init,
          goToTab: goToTab,
        };
      };

      /**
       * Attach to global namespace
       */
      window.tabs = tabs;

      exports.default = tabs;

      /***/
    },
    /* 53 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _delegate = __webpack_require__(3);

      var _delegate2 = _interopRequireDefault(_delegate);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function navApp(component, subMenuName) {
        // const navMenu = component.querySelectorAll(subMenuName);
        var subMenus = component.querySelectorAll(".subMenu");

        component.addEventListener("mouseleave", function () {
          [].forEach.call(subMenus, function (subMenu) {
            subMenu.classList.remove("show");
          });
        });

        (0, _delegate2.default)(
          document.body,
          ".navMenu .toggle",
          "click",
          function (e) {
            var current = e.delegateTarget.querySelector(".subMenu");
            var result = current.classList.contains("show");
            //e.preventDefault();
            [].forEach.call(subMenus, function (subMenu) {
              subMenu.classList.remove("show");
            });

            if (result) {
              current.classList.remove("show");
            } else {
              current.classList.add("show");
            }

            //e.stopPropagation();
          },
          false
        );
      }

      exports.default = navApp;

      /***/
    },
    /* 54 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.default = subMenuDrawer;
      function subMenuDrawer() {
        var drawerMenus = document.querySelectorAll(".has-sub-menu-drawer");
        var closeIcon = document.querySelector("nav .close-icon");
        drawerMenus.forEach(function (menu, index) {
          var submenu = menu.querySelector("ul");
          if (!submenu) {
            return;
          }
          var drawerItems = document.createElement("div");
          drawerItems.classList.add("drawer");
          drawerItems.classList.add("drawer-" + index);
          drawerItems.append(submenu.cloneNode(true));
          drawerItems.querySelector("ul").classList.add("navMenu");

          var closeButtom = document.createElement("button");
          closeButtom.classList.add("close");
          var closeIconClone = closeIcon.cloneNode(true);
          closeIconClone.classList.remove("hidden");
          closeButtom.append(closeIconClone);
          // var closeLabel = document.createElement('p');
          // closeLabel.innerHTML = "Close"
          // closeButtom.append(closeLabel);
          drawerItems.prepend(closeButtom);

          menu.querySelector("a").addEventListener("click", function () {
            drawerItems.classList.add("active");
          });
          closeButtom.addEventListener("click", function () {
            drawerItems.classList.remove("active");
          });
          menu.closest(".nav-container").append(drawerItems);
        });
      }

      /***/
    },
    /* 55 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      function panelModel(component, panelModelName, panelButtonName) {
        var contentName =
          arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : ".content";

        var toggleNavBar = function toggleNavBar() {
          component.querySelector(panelModelName).classList.toggle("hide");
          component
            .querySelector(panelButtonName)
            .classList.toggle("panelHidden");
          document.querySelector(contentName).classList.toggle("wide");
        };

        component.querySelector(panelButtonName).addEventListener(
          "click",
          function () {
            toggleNavBar();
          },
          false
        );
      }

      exports.default = panelModel;

      /***/
    },
    /* 56 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _typeof =
        typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
          ? function (obj) {
              return typeof obj;
            }
          : function (obj) {
              return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
            };

      var currentDatepicker = null;

      var datepicker = function datepicker(query, options) {
        if (!(this instanceof datepicker))
          return new datepicker(query, options);

        currentDatepicker = self = this;
        self.options = extend({}, datepicker.defaults, options);
        self.query = query;

        self.__init__();
      };

      datepicker.prototype = {
        constructor: datepicker,

        __init__: function __init__() {
          // Bind display on click
          document.removeEventListener("click", self.bindCalendar, false);
          document.removeEventListener("keypress", self.keypressHandler, false);
          document.addEventListener("click", self.bindCalendar, false);
          document.addEventListener("keypress", self.keypressHandler, false);
        },

        matchesReferers: function matchesReferers(elm) {
          self.referers = document.querySelectorAll(self.query);
          for (var i = 0; i < self.referers.length; i++) {
            if (elm === self.referers[i]) return true;
          }
          return false;
        },

        close: function close() {
          delete self.current;
          delete self.target;
          if (self.picker) self.picker.remove();
        },

        show: function show(target) {
          self.target =
            (typeof target === "undefined" ? "undefined" : _typeof(target)) !=
            (true ? "undefined" : _typeof(undefined))
              ? target
              : self.target;
          if (
            target ||
            _typeof(self.current) == (true ? "undefined" : _typeof(undefined))
          ) {
            var current = new Date();
            if (target) self.selected = null;
            if (target && target.value) {
              var ts = self.parseDate(target.value);
              current = new Date(ts);
              self.selected = {
                year: current.getFullYear(),
                month: current.getMonth(),
                day: current.getDate(),
              };
            }
            self.current = {
              year: current.getFullYear(),
              month: current.getMonth(),
            };
          }
          self.cleanPicker();
          self.drawPicker();
        },

        cleanPicker: function cleanPicker() {
          var picker = document.querySelector(".vanilla-datepicker");
          if (picker) picker.remove();
        },

        drawPicker: function drawPicker() {
          var position = {
            x: self.target.offsetLeft,
            y: self.target.offsetTop + self.target.offsetHeight,
          };
          self.picker = document.createElement("div");
          self.picker.classList.add("vanilla-datepicker");
          self.picker.style.left = position.x + "px";
          self.picker.style.top = position.y + "px";
          self.picker.appendChild(self.drawNavigation());
          self.picker.appendChild(self.drawWeekHeader());
          var weeks = self.getWeeks();
          for (var i = 0; i < weeks.length; i++) {
            self.picker.appendChild(weeks[i]);
          }

          self.target.parentNode.insertBefore(
            self.picker,
            self.target.nextSibling
          );
        },

        drawNavigation: function drawNavigation() {
          var nav = document.createElement("div");
          nav.classList.add("title-nav");
          var previousYear = void 0;
          var nextYear = void 0;
          var previousMonth = void 0;
          var currentMonth = void 0;
          var nextMonth = void 0;
          if (self.options.navigateYear) {
            previousYear = document.createElement("div");
            previousYear.classList.add("year-navigate");
            previousYear.classList.add("nav-items");
            previousYear.classList.add("previous");
            previousYear.setAttribute("tabIndex", 0);
            previousYear.innerHTML =
              '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"> <title></title> <g id="icomoon-ignore"> </g> <path fill="#fff" d="M13.008 543.386l389.18 389.18c17.344 17.342 45.428 17.342 62.772 0 17.342-17.328 17.342-45.444 0-62.772l-357.796-357.794 357.794-357.794c17.342-17.328 17.342-45.444 0-62.772-8.672-8.672-20.022-13.008-31.386-13.008s-22.73 4.336-31.386 13.008l-389.18 389.18c-17.342 17.328-17.342 45.444 0.002 62.772z"></path> <path fill="#fff" d="M559.042 543.386l389.18 389.18c17.328 17.342 45.444 17.342 62.772 0 17.342-17.328 17.342-45.444 0-62.772l-357.78-357.794 357.778-357.794c17.342-17.328 17.342-45.444 0-62.772-8.656-8.672-20.022-13.008-31.386-13.008s-22.73 4.336-31.386 13.008l-389.18 389.18c-17.34 17.328-17.34 45.444 0.002 62.772z"></path> </svg>';

            previousYear.addEventListener("click", self.getPreviousYear, false);

            nextYear = document.createElement("div");
            nextYear.classList.add("year-navigate");
            nextYear.classList.add("next");
            nextYear.classList.add("nav-items");
            nextYear.setAttribute("tabIndex", 0);
            nextYear.innerHTML =
              '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"> <title></title> <g id="icomoon-ignore"> </g> <path fill="#fff" d="M1010.992 480.614l-389.18-389.18c-17.344-17.342-45.428-17.342-62.772 0-17.342 17.328-17.342 45.444 0 62.772l357.796 357.794-357.794 357.794c-17.342 17.328-17.342 45.444 0 62.772 8.672 8.672 20.022 13.008 31.386 13.008s22.73-4.336 31.386-13.008l389.18-389.18c17.342-17.328 17.342-45.444-0.002-62.772z"></path> <path fill="#fff" d="M464.958 480.614l-389.18-389.18c-17.328-17.342-45.444-17.342-62.772 0-17.342 17.328-17.342 45.444 0 62.772l357.78 357.794-357.778 357.794c-17.342 17.328-17.342 45.444 0 62.772 8.656 8.672 20.022 13.008 31.386 13.008s22.73-4.336 31.386-13.008l389.18-389.18c17.34-17.328 17.34-45.444-0.002-62.772z"></path> </svg>';

            nextYear.addEventListener("click", self.getNextYear, false);
          }
          previousMonth = document.createElement("div");
          previousMonth.classList.add("month-navigate");
          previousMonth.classList.add("nav-items");
          previousMonth.classList.add("previous");
          previousMonth.setAttribute("tabIndex", 0);
          previousMonth.innerHTML =
            '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"> <title></title> <g id="icomoon-ignore"> </g> <path fill="#fff" d="M331.295 512.238l444.985-444.985c15.384-15.386 15.384-40.33 0-55.716-15.388-15.381-40.33-15.381-55.716 0l-472.843 472.843c-15.381 15.386-15.381 40.33 0 55.716l472.843 472.843c15.654 15.118 40.598 14.684 55.716-0.97 14.746-15.27 14.746-39.478 0-54.746l-444.985-444.985z"></path> </svg>';

          previousMonth.addEventListener("click", self.getPreviousMonth, false);

          // currentMonth = document.createTextNode(
          //     self.options.months.long[self.current.month] + ' ' + self.current.year
          //     );

          nextMonth = document.createElement("div");
          nextMonth.classList.add("month-navigate");
          nextMonth.classList.add("nav-items");
          nextMonth.classList.add("next");
          nextMonth.setAttribute("tabIndex", 0);
          nextMonth.innerHTML =
            '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"> <title></title> <g id="icomoon-ignore"> </g> <path fill="#fff" d="M776.847 483.9l-473.63-472.32c-15.518-15.466-40.642-15.44-56.134 0.080-15.48 15.518-15.44 40.656 0.080 56.134l445.438 444.208-445.454 444.206c-15.518 15.48-15.558 40.602-0.080 56.122 7.766 7.78 17.94 11.67 28.114 11.67 10.148 0 20.282-3.864 28.034-11.59l473.632-472.308c7.474-7.436 11.668-17.556 11.668-28.1s-4.206-20.652-11.668-28.102z"></path> </svg>';

          nextMonth.addEventListener("click", self.getNextMonth, false);

          currentMonth = document.createElement("div");
          currentMonth.classList.add("month-lable");
          currentMonth.classList.add("nav-items");
          currentMonth.innerHTML =
            self.options.months.long[self.current.month] +
            " " +
            self.current.year;

          //nextMonth.addEventListener('click', self.getNextMonth, false);

          if (self.options.navigateYear) nav.appendChild(previousYear);
          nav.appendChild(previousMonth);
          nav.appendChild(currentMonth);
          nav.appendChild(nextMonth);
          if (self.options.navigateYear) nav.appendChild(nextYear);

          return nav;
        },

        getPreviousYear: function getPreviousYear() {
          var current = new Date(self.current.year - 1, self.current.month);
          self.current = {
            year: current.getFullYear(),
            month: current.getMonth(),
          };
          self.show();
        },

        getNextYear: function getNextYear() {
          var current = new Date(self.current.year + 1, self.current.month);
          self.current = {
            year: current.getFullYear(),
            month: current.getMonth(),
          };
          self.show();
        },

        getPreviousMonth: function getPreviousMonth() {
          var current = new Date(self.current.year, self.current.month - 1);
          self.current = {
            year: current.getFullYear(),
            month: current.getMonth(),
          };
          self.show();
        },

        getNextMonth: function getNextMonth() {
          var current = new Date(self.current.year, self.current.month + 1);
          self.current = {
            year: current.getFullYear(),
            month: current.getMonth(),
          };
          self.show();
        },

        drawWeekHeader: function drawWeekHeader() {
          var weekdays = self.options.weekdays.short
            .slice(self.options.firstDayOfWeek)
            .concat(
              self.options.weekdays.short.slice(0, self.options.firstDayOfWeek)
            );
          var weekHeader = document.createElement("div");
          weekHeader.classList.add("week-header");
          for (var i = 0; i < 7; i++) {
            var dayOfWeek = document.createElement("div");
            dayOfWeek.setAttribute("tabIndex", 0);
            dayOfWeek.innerHTML = weekdays[i];
            weekHeader.appendChild(dayOfWeek);
          }
          return weekHeader;
        },

        getWeeks: function getWeeks() {
          // Get week days according to options
          var weekdays = self.options.weekdays.short
            .slice(self.options.firstDayOfWeek)
            .concat(
              self.options.weekdays.short.slice(0, self.options.firstDayOfWeek)
            );
          // Get first day of month and update acconding to options
          var firstOfMonth = new Date(
            self.current.year,
            self.current.month,
            1
          ).getDay();
          firstOfMonth =
            firstOfMonth < self.options.firstDayOfWeek
              ? 7 + (firstOfMonth - self.options.firstDayOfWeek)
              : firstOfMonth - self.options.firstDayOfWeek;

          var daysInPreviousMonth = new Date(
            self.current.year,
            self.current.month,
            0
          ).getDate();
          var daysInMonth = new Date(
            self.current.year,
            self.current.month + 1,
            0
          ).getDate();

          var days = [],
            weeks = [];
          // Define last days of previous month if current month does not start on `firstOfMonth`
          for (var i = firstOfMonth - 1; i >= 0; i--) {
            var day = document.createElement("div");
            day.classList.add("no-select");
            day.innerHTML = daysInPreviousMonth - i;
            days.push(day);
          }
          // Define days in current month
          for (var i = 0; i < daysInMonth; i++) {
            if (i && (firstOfMonth + i) % 7 === 0) {
              weeks.push(self.addWeek(days));
              days = [];
            }
            var day = document.createElement("div");
            day.classList.add("day");
            if (
              self.selected &&
              self.selected.year == self.current.year &&
              self.selected.month == self.current.month &&
              self.selected.day == i + 1
            ) {
              day.classList.add("selected");
            }
            day.setAttribute("tabIndex", 0);
            day.innerHTML = i + 1;
            days.push(day);
          }
          // Define days of next month if last week is not full
          if (days.length) {
            var len = days.length;
            for (var i = 0; i < 7 - len; i++) {
              var day = document.createElement("div");
              day.classList.add("no-select");
              day.innerHTML = i + 1;
              days.push(day);
            }
            weeks.push(self.addWeek(days));
          }
          return weeks;
        },

        addWeek: function addWeek(days) {
          var week = document.createElement("div");
          week.classList.add("week");
          for (var i = 0; i < days.length; i++) {
            week.appendChild(days[i]);
          }
          return week;
        },

        setDate: function setDate(day) {
          var oldDateValue = self.target.value;
          var dayOfWeek = new Date(
            self.current.year,
            self.current.month,
            day
          ).getDay();
          var date = self.options.outputFormat
            .replace("%a", self.options.weekdays.short[dayOfWeek])
            .replace("%A", self.options.weekdays.long[dayOfWeek])
            .replace("%d", ("0" + day).slice(-2))
            .replace("%e", day)
            .replace("%b", self.options.months.short[self.current.month])
            .replace("%B", self.options.months.long[self.current.month])
            .replace("%m", ("0" + (self.current.month + 1)).slice(-2))
            .replace("%w", dayOfWeek)
            .replace("%Y", self.current.year);
          self.target.value = date;

          if (date !== oldDateValue) {
            if ("createEvent" in document) {
              var changeEvent = document.createEvent("HTMLEvents");
              changeEvent.initEvent("change", false, true);
              self.target.dispatchEvent(changeEvent);
            } else {
              self.target.fireEvent("onchange");
            }
          }
        },

        parseDate: function parseDate(date) {
          var acceptedFormats = [
              "%a",
              "%A",
              "%d",
              "%e",
              "%b",
              "%B",
              "%m",
              "%w",
              "%Y",
            ],
            pattern = new RegExp(
              self.options.outputFormat.replace(/%[a-zA-Z]/g, "(.+)")
            ),
            groups = pattern.exec(self.options.outputFormat),
            matches = pattern.exec(date),
            date = new Date();

          for (var i = 1; i < matches.length; i++) {
            if (acceptedFormats.indexOf(groups[i]) == -1) {
              console.log("DatePicker : Format error");
              break;
            }

            switch (groups[i]) {
              case "%d":
              case "%e":
                date.setDate(matches[i]);
                break;
              case "%m":
                date.setMonth(parseInt(matches[i]) - 1, date.getDate());
                break;
              case "%b":
                var month = self.options.months.short.indexOf(matches[i]);
              case "%B":
                month =
                  month != -1
                    ? month
                    : self.options.months.long.indexOf(matches[i]);
                date.setMonth(month, date.getDate());
                break;
              case "%Y":
                date.setYear(matches[i]);
                break;
            }
          }
          return date;
        },

        bindCalendar: function bindCalendar(event) {
          var target = event.target;

          if (target.classList.contains("day")) {
            self.setDate(target.innerHTML);
            self.close();
          } else {
            while (
              target &&
              !self.matchesReferers(target) &&
              target.className != "vanilla-datepicker"
            ) {
              target = target.parentNode;
            }
            if (target && self.matchesReferers(target)) self.show(target);
            if (!target) self.close();
          }
        },

        keypressHandler: function keypressHandler(event) {
          var keyCode = event.which || event.keyCode;
          if (keyCode === 13) {
            self.bindCalendar(event);
          }
        },
      };

      datepicker.defaults = {
        firstDayOfWeek: 0,
        months: {
          short: [
            "Jan",
            "Fev",
            "Mar",
            "Avr",
            "Mai",
            "Jun",
            "Jul",
            "Aout",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          long: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        },
        navigateYear: true,
        outputFormat: "%d/%m/%Y",
        weekdays: {
          short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
          long: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
      };

      // utils
      var camelCase = function camelCase(string) {
        return string.replace(/-([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });
      };

      var extend = function extend(out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
          if (!arguments[i]) continue;
          for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
          }
        }

        return out;
      };

      var is = function is(el, query) {
        return (
          el.matches ||
          el.matchesSelector ||
          el.msMatchesSelector ||
          el.mozMatchesSelector ||
          el.webkitMatchesSelector ||
          el.oMatchesSelector
        ).call(el, query);
      };

      exports.default = datepicker;

      /***/
    },
    /* 57 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      function FileUpload(component) {
        var inputElement = component.querySelector('[type="file"]');
        inputElement.addEventListener("change", handleFiles, false);
        if (component.dataset.image) {
          preview(component.dataset.image);
        }

        function handleFiles() {
          var file = this.files[0];
          readURL(file)
            .then(function (url) {
              preview(url);
            })
            .catch(function () {
              preview(component.dataset.image);
            });
        }

        function readURL(files) {
          return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (e) {
              resolve(e.target.result);
            };
            reader.onerror = function (e) {
              reject(e);
            };
            reader.readAsDataURL(files); // convert to base64 string
          });
        }

        function preview(url) {
          var container = document.createElement("div");
          container.classList.add("preview");
          if (url) {
            var img = document.createElement("img");
            img.src = url;
            container.appendChild(img);
          }
          component.querySelector(".preview").replaceWith(container);
        }
      }
      exports.default = FileUpload;

      /***/
    },
    /* 58 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _ajaxGetData = __webpack_require__(1);

      var _ajaxGetData2 = _interopRequireDefault(_ajaxGetData);

      var _helper = __webpack_require__(2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function patientFolder(component) {
        var loadedUrl = null;
        var itemTemplate = component
          .querySelector(".single-item")
          .cloneNode(true);
        itemTemplate.classList.remove("hidden");
        component.querySelector(".single-item").remove();

        var intersectionObserver = new IntersectionObserver(function (entries) {
          // If intersectionRatio is 0, the target is out of view
          // and we do not need to do anything.
          if (entries[0].intersectionRatio <= 0) return;
          loadItemsIfNeeded(entries[0].target);
        });

        intersectionObserver.observe(component);

        function loadItemsIfNeeded(itemList) {
          // "getUrl" is the url with patient id, it was set when view item form datatable or search (I.e /api/appointment/find/patient/5d0ac3e893f4dd910e762288)
          // "get" is the row url for the get list data (I.e  /api/appointment/find/patient/, /api/appointment/get)
          var url = itemList.dataset.getUrl || itemList.dataset.get;
          if (loadedUrl == url) {
            return;
          }
          (0, _ajaxGetData2.default)(url).then(function (_ref) {
            var data = _ref.data;

            loadedUrl = url;
            itemList.innerHTML = "";
            if (data.length > 0) {
              data.forEach(function (row) {
                var item = itemTemplate.cloneNode(true);
                item.querySelectorAll("[data-property]").forEach(function (el) {
                  el.innerHTML =
                    (0, _helper.valueByString)(row, el.dataset.property) || "-";
                });
                item.dataset.id = row._id;
                itemList.appendChild(item);
              });
            } else {
              var nodeFoudNode = document.createElement("div");
              nodeFoudNode.classList.add("not-found-item");
              nodeFoudNode.innerHTML = "No " + name + " found.";
              itemList.appendChild(nodeFoudNode);
            }
          });
        }
      }

      exports.default = patientFolder;

      /***/
    },
    /******/
  ]
);
//# sourceMappingURL=App.bundle.js.map
