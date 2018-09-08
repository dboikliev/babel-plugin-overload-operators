"use strict";

function _uop(_arg, _operator2) {
  if (_arg !== null && _arg !== void 0 && _arg.constructor[_operator2]) {
    return _arg.constructor[_operator2](_arg);
  }

  return _unary__primitives[_operator2](_arg);
}

function _bop(_left, _right, _operator) {
  if (_left !== null && _left !== void 0 && _left.constructor[_operator]) {
    return _left.constructor[_operator](_left, _right);
  }

  if (_right !== null && _right !== void 0 && _right.constructor[_operator]) {
    return _right.constructor[_operator](_left, _right);
  }

  return _binary__primitives[_operator](_left, _right);
}

var _unary__primitives = {
  'unary.+': function unary(a) {
    return +a;
  },
  'unary.-': function unary(a) {
    return -a;
  },
  'unary.++': function unary(a) {
    return ++a;
  },
  'unary.--': function unary(a) {
    return --a;
  },
  'unary.~': function unary(a) {
    return ~a;
  },
  'unary.!': function unary(a) {
    return !a;
  },
  'unary.typeof': function unaryTypeof(a) {
    return typeof a;
  },
  'unary.void': function unaryVoid(a) {
    return void a;
  }
};
var _binary__primitives = {
  'binary.+': function binary(a, b) {
    return a + b;
  },
  'binary.-': function binary(a, b) {
    return a - b;
  },
  'binary.*': function binary(a, b) {
    return a * b;
  },
  'binary./': function binary(a, b) {
    return a / b;
  },
  'binary.%': function binary(a, b) {
    return a / b;
  },
  'binary.^': function binary(a, b) {
    return a ^ b;
  },
  'binary.|': function binary(a, b) {
    return a | b;
  },
  'binary.&': function binary(a, b) {
    return a & b;
  },
  'binary.||': function binary(a, b) {
    return a || b;
  },
  'binary.&&': function binary(a, b) {
    return a && b;
  },
  'binary.==': function binary(a, b) {
    return a == b;
  },
  'binary.!=': function binary(a, b) {
    return a != b;
  },
  'binary.===': function binary(a, b) {
    return a === b;
  },
  'binary.!==': function binary(a, b) {
    return a !== b;
  },
  'binary.>': function binary(a, b) {
    return a > b;
  },
  'binary.>=': function binary(a, b) {
    return a >= b;
  },
  'binary.<': function binary(a, b) {
    return a < b;
  },
  'binary.<=': function binary(a, b) {
    return a <= b;
  },
  'binary.>>': function binary(a, b) {
    return a >> b;
  },
  'binary.<<': function binary(a, b) {
    return a << b;
  },
  'binary.**': function binary(a, b) {
    return a ** b;
  },
  'binary.instanceof': function binaryInstanceof(a, b) {
    return a instanceof b;
  },
  'binary.in': function binaryIn(a, b) {
    return a in b;
  }
};
"Some template ".concat(a, ".");
"Some template ".concat(_bop(a, 1, "binary.+"), ".");