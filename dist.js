"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.composeDerivedStateFromProps = exports.composeState = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var composeStateFactory = function composeStateFactory(stateIndex) {
  return function () {
    for (var _len = arguments.length, updaters = new Array(_len), _key = 0; _key < _len; _key++) {
      updaters[_key] = arguments[_key];
    }

    return updaters.reduceRight(function (accumulator, current) {
      return function (stateOrProps1, stateOrProps2) {
        var accumulatedState = accumulator(stateOrProps1, stateOrProps2);
        var currentState = current instanceof Function ? stateIndex === 0 ? current(_objectSpread({}, stateOrProps1, {}, accumulatedState), stateOrProps2) : current(stateOrProps1, _objectSpread({}, stateOrProps2, {}, accumulatedState)) : current;
        return currentState || accumulatedState ? _objectSpread({}, accumulatedState, {}, currentState) : null;
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
exports["default"] = _default;
