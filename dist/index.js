"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _template = _interopRequireDefault(require("@babel/template"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defineBinaryPrimitives(binaryPrefix) {
  return (0, _template.default)("const __binary__primitives = {\n        '".concat(binaryPrefix, ".+'(a, b) { return a + b },\n        '").concat(binaryPrefix, ".-'(a, b) { return a - b },\n        '").concat(binaryPrefix, ".*'(a, b) { return a * b },\n        '").concat(binaryPrefix, "./'(a, b) { return a / b },\n        '").concat(binaryPrefix, ".%'(a, b) { return a / b },\n        '").concat(binaryPrefix, ".^'(a, b) { return a ^ b },\n        '").concat(binaryPrefix, ".|'(a, b) { return a | b },\n        '").concat(binaryPrefix, ".&'(a, b) { return a & b },\n        '").concat(binaryPrefix, ".||'(a, b) { return a || b },\n        '").concat(binaryPrefix, ".&&'(a, b) { return a && b },\n        '").concat(binaryPrefix, ".=='(a, b) { return a == b },\n        '").concat(binaryPrefix, ".!='(a, b) { return a != b },\n        '").concat(binaryPrefix, ".==='(a, b) { return a === b },\n        '").concat(binaryPrefix, ".!=='(a, b) { return a !== b },\n        '").concat(binaryPrefix, ".>'(a, b) { return a > b },\n        '").concat(binaryPrefix, ".>='(a, b) { return a >= b },\n        '").concat(binaryPrefix, ".<'(a, b) { return a < b },\n        '").concat(binaryPrefix, ".<='(a, b) { return a <= b },\n        '").concat(binaryPrefix, ".>>'(a, b) { return a >> b },\n        '").concat(binaryPrefix, ".<<'(a, b) { return a << b },\n        '").concat(binaryPrefix, ".**'(a, b) { return a ** b },\n        '").concat(binaryPrefix, ".instanceof'(a, b) { return a instanceof b },\n        '").concat(binaryPrefix, ".in'(a, b) { return a in b }\n    }"));
}

function defineUnaryPrimitives(unaryPrefix) {
  return (0, _template.default)("const __unary__primitives = {\n        '".concat(unaryPrefix, ".+'(a) { return +a },\n        '").concat(unaryPrefix, ".-'(a) { return -a },\n        '").concat(unaryPrefix, ".++'(a) { return ++a },\n        '").concat(unaryPrefix, ".--'(a) { return --a },\n        '").concat(unaryPrefix, ".~'(a) { return ~a },\n        '").concat(unaryPrefix, ".!'(a) { return !a },\n        '").concat(unaryPrefix, ".typeof'(a) { return typeof a },\n        '").concat(unaryPrefix, ".void'(a) { return void a }\n    }"));
}

function bop(primitivesId) {
  var buildCall = (0, _template.default)("\n        function _bop(LEFT, RIGHT, OPERATOR) {\n            if (LEFT !== null && LEFT !== void 0 && LEFT.constructor[OPERATOR]) {\n                return LEFT.constructor[OPERATOR](LEFT, RIGHT);\n            }\n    \n            if (RIGHT !== null && RIGHT !== void 0 && RIGHT.constructor[OPERATOR]) {\n                return RIGHT.constructor[OPERATOR](LEFT, RIGHT);\n            }\n            \n            return ".concat(primitivesId, "[OPERATOR](LEFT, RIGHT);\n        }\n    "));
  return buildCall;
}

function uop(primitivesId) {
  var buildCall = (0, _template.default)("\n        function _uop(ARG, OPERATOR) {\n            if (ARG !== null && ARG !== void 0 && ARG.constructor[OPERATOR]) {\n                return ARG.constructor[OPERATOR](ARG);\n            }\n            return ".concat(primitivesId, "[OPERATOR](ARG);\n        }\n    "));
  return buildCall;
}

function _default(_ref) {
  var t = _ref.types;
  return {
    visitor: {
      Program: function Program(path, state) {
        var prefixes = state.opts.prefixes;
        var unary = 'unary';
        var binary = 'binary';

        if (prefixes) {
          unary = prefixes.unary || unary;
          binary = prefixes.binary || binary;
        }

        this.unaryPrefix = unary;
        this.binaryPrefix = binary;
        var binaryPrimitives = defineBinaryPrimitives(this.binaryPrefix)();
        var unaryPrimitives = defineUnaryPrimitives(this.unaryPrefix)();
        binaryPrimitives.declarations[0].id = path.scope.generateUidIdentifierBasedOnNode(binaryPrimitives.declarations[0].id);
        unaryPrimitives.declarations[0].id = path.scope.generateUidIdentifierBasedOnNode(unaryPrimitives.declarations[0].id);
        this.bop = bop(binaryPrimitives.declarations[0].id.name)({
          LEFT: path.scope.generateUidIdentifier('left'),
          RIGHT: path.scope.generateUidIdentifier('right'),
          OPERATOR: path.scope.generateUidIdentifier('operator')
        });
        this.uop = uop(unaryPrimitives.declarations[0].id.name)({
          ARG: path.scope.generateUidIdentifier('arg'),
          OPERATOR: path.scope.generateUidIdentifier('operator')
        });
        this.bop.id = path.scope.generateUidIdentifierBasedOnNode(this.bop.id);
        this.uop.id = path.scope.generateUidIdentifierBasedOnNode(this.uop.id);
        path.unshiftContainer('body', binaryPrimitives);
        path.unshiftContainer('body', unaryPrimitives);
        path.unshiftContainer('body', this.bop);
        path.unshiftContainer('body', this.uop);
      },
      FunctionDeclaration: function FunctionDeclaration(path) {
        if (path.node.id.name === this.bop.id.name || path.node.id.name === this.uop.id.name) {
          path.skip();
        }
      },
      'BinaryExpression|LogicalExpression': function BinaryExpressionLogicalExpression(path) {
        if (path.node.loc == null) {
          path.skip();
          return;
        }

        path.replaceWith(t.callExpression(this.bop.id, [path.node.left, path.node.right, t.stringLiteral("".concat(this.binaryPrefix, ".").concat(path.node.operator))]));
      },
      UnaryExpression: function UnaryExpression(path) {
        if (path.node.loc == null) {
          path.skip();
          return;
        }

        var op = t.stringLiteral("".concat(this.unaryPrefix, ".").concat(path.node.operator));
        path.replaceWith(t.callExpression(this.uop.id, [path.node.argument, op]));
      },
      UpdateExpression: function UpdateExpression(path) {
        if (path.node.loc == null) {
          path.skip();
          return;
        }

        var op = t.stringLiteral("".concat(this.unaryPrefix, ".").concat(path.node.operator));
        path.replaceWith(t.assignmentExpression('=', path.node.argument, t.callExpression(this.uop.id, [path.node.argument, op])));
      },
      AssignmentExpression: function AssignmentExpression(path) {
        if (path.node.loc == null) {
          path.skip();
          return;
        }

        var assignmentOperstors = new Set(['+=', '-=', '*=', '/=', '%=', '|=', '&=', '^=', '>>=', '<<=', '**=']);
        var operator = path.node.operator;

        if (!assignmentOperstors.has(operator)) {
          return;
        }

        var correspondingOperator = operator.substring(0, operator.length - 1);
        var op = t.stringLiteral("binary.".concat(correspondingOperator));
        var bopCall = t.callExpression(this.bop.id, [path.node.left, path.node.right, op]);
        path.replaceWith(t.assignmentExpression('=', path.node.left, bopCall));
      },
      TemplateLiteral: function TemplateLiteral(path) {
        path.node.expressions = path.node.expressions && path.node.expressions.map(function (e) {
          return t.callExpression(t.identifier('String'), [e]);
        });
      }
    }
  };
}