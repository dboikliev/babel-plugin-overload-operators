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
  'u.+': function u(a) {
    return +a;
  },
  'u.-': function u(a) {
    return -a;
  },
  'u.++': function u(a) {
    return ++a;
  },
  'u.--': function u(a) {
    return --a;
  },
  'u.~': function u(a) {
    return ~a;
  },
  'u.!': function u(a) {
    return !a;
  },
  'u.typeof': function uTypeof(a) {
    return typeof a;
  },
  'u.void': function uVoid(a) {
    return void a;
  }
};
var _binary__primitives = {
  'b.+': function b(a, _b) {
    return a + _b;
  },
  'b.-': function b(a, _b2) {
    return a - _b2;
  },
  'b.*': function b(a, _b3) {
    return a * _b3;
  },
  'b./': function b(a, _b4) {
    return a / _b4;
  },
  'b.%': function b(a, _b5) {
    return a / _b5;
  },
  'b.^': function b(a, _b6) {
    return a ^ _b6;
  },
  'b.|': function b(a, _b7) {
    return a | _b7;
  },
  'b.&': function b(a, _b8) {
    return a & _b8;
  },
  'b.||': function b(a, _b9) {
    return a || _b9;
  },
  'b.&&': function b(a, _b10) {
    return a && _b10;
  },
  'b.==': function b(a, _b11) {
    return a == _b11;
  },
  'b.!=': function b(a, _b12) {
    return a != _b12;
  },
  'b.===': function b(a, _b13) {
    return a === _b13;
  },
  'b.!==': function b(a, _b14) {
    return a !== _b14;
  },
  'b.>': function b(a, _b15) {
    return a > _b15;
  },
  'b.>=': function b(a, _b16) {
    return a >= _b16;
  },
  'b.<': function b(a, _b17) {
    return a < _b17;
  },
  'b.<=': function b(a, _b18) {
    return a <= _b18;
  },
  'b.>>': function b(a, _b19) {
    return a >> _b19;
  },
  'b.<<': function b(a, _b20) {
    return a << _b20;
  },
  'b.**': function b(a, _b21) {
    return a ** _b21;
  },
  'b.instanceof': function bInstanceof(a, b) {
    return a instanceof b;
  },
  'b.in': function bIn(a, b) {
    return a in b;
  }
};
var a = {};
var b = {};
a = _bop(a, b, "b.+");
a = _bop(a, b, "b.-");
a = _bop(a, b, "b.*");
a = _bop(a, b, "b./");
a = _bop(a, b, "b.%");
a = _bop(a, b, "b.|");
a = _bop(a, b, "b.&");
a = _bop(a, b, "b.^");
a = _bop(a, b, "b.>>");
a = _bop(a, b, "b.<<");
a = _bop(a, b, "b.**");

_bop(a, b, "b.+");

_bop(a, b, "b.-");

_bop(a, b, "b.*");

_bop(a, b, "b./");

_bop(a, b, "b.%");

_bop(a, b, "b.|");

_bop(a, b, "b.&");

_bop(a, b, "b.^");

_bop(a, b, "b.||");

_bop(a, b, "b.&&");

_bop(a, b, "b.==");

_bop(a, b, "b.===");

_bop(a, b, "b.!=");

_bop(a, b, "b.!==");

_bop(a, b, "b.>");

_bop(a, b, "b.<");

_bop(a, b, "b.>=");

_bop(a, b, "b.<=");

_bop(a, b, "b.>>");

_bop(a, b, "b.<<");

_bop(a, b, "b.**");

_bop(a, b, "b.instanceof");

_bop(a, b, "b.in");

_uop(a, "u.+");

_uop(a, "u.-");

a = _uop(a, "u.++");
a = _uop(a, "u.--");
a = _uop(a, "u.++");
a = _uop(a, "u.--");

_uop(a, "u.~");

_uop(a, "u.!");

_uop(a, "u.typeof");

_uop(a, "u.void");