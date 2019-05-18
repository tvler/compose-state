"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.composeDerivedStateFromProps = exports.composeState = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var composeStateFactory = function composeStateFactory(stateIndex) {
  return function () {
    for (var _len = arguments.length, updaters = new Array(_len), _key = 0; _key < _len; _key++) {
      updaters[_key] = arguments[_key];
    }

    return updaters.reduceRight(function (accumulator, current) {
      return function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var accumulatedState = accumulator.apply(void 0, args);
        var currentState = current instanceof Function ? current.apply(void 0, _toConsumableArray(args.slice(0, stateIndex)).concat([_objectSpread({}, args[stateIndex], accumulatedState)], _toConsumableArray(args.slice(stateIndex + 1)))) : current;
        return currentState || accumulatedState ? _objectSpread({}, accumulatedState, currentState) : null;
      };
    }, function () {
      return null;
    });
  };
};

var composeState = composeStateFactory(0);
exports.composeState = composeState;
var composeDerivedStateFromProps = composeStateFactory(1);
exports.composeDerivedStateFromProps = composeDerivedStateFromProps;
var _default = composeState;
exports.default = _default;
