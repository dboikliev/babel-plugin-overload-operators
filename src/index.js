import template from "babel-template";

function defineBinaryPrimitives() {
    return template(`const __binary__primitives = {
        '+'(a, b) { return a + b },
        '-'(a, b) { return a - b },
        '*'(a, b) { return a * b },
        '/'(a, b) { return a / b },
        '%'(a, b) { return a / b },
        '^'(a, b) { return a ^ b },
        '|'(a, b) { return a | b },
        '&'(a, b) { return a & b },
        '||'(a, b) { return a || b },
        '&&'(a, b) { return a && b },
        '=='(a, b) { return a == b },
        '!='(a, b) { return a != b },
        '==='(a, b) { return a === b },
        '!=='(a, b) { return a !== b },
        '+='(a, b) { return a + b },
        '-='(a, b) { return a - b },
        '*='(a, b) { return a * b },
        '/='(a, b) { return a * b },
        '%='(a, b) { return a * b },
        '>'(a, b) { return a > b },
        '>='(a, b) { return a >= b },
        '<'(a, b) { return a < b },
        '<='(a, b) { return a <= b },
        '>>'(a, b) { return a >> b },
        '<<'(a, b) { return a << b },
    }`);
}

function defineUnaryPrimitives() {
    return template(`const __unary__primitives = {
        '+'(a) { return +a },
        '-'(a) { return -a },
        '++'(a) { return ++a },
        '--'(a) { return --a },
        '~'(a) { return ~a },
        '!'(a) { return !a },
        'typeof'(a) { return typeof a },
        'void'(a) { return void a }
    }`);
}

function bop(primitivesId) {
    const buildCall = template(`
        function _bop(LEFT, RIGHT, OPERATOR) {
            const key = Symbol.for(\`binary.\${OPERATOR}\`);

            if (typeof LEFT !== 'undefined') {
                const leftProto = Object.getPrototypeOf(LEFT);
                const leftOp = leftProto.constructor[key];
                if (leftOp && leftOp.length === 2) {
                    return leftOp.call(leftProto.constructor, LEFT, RIGHT);
                }
            }
    
            if (typeof RIGHT !== 'undefined') {
                const rightProto = Object.getPrototypeOf(RIGHT);
                const rightOp = rightProto.constructor[key];
                if (rightOp && rightOp.length === 2) {
                    return rightOp.call(rightProto.constructor, LEFT, RIGHT);
                }
            }

            return ${primitivesId}[OPERATOR](LEFT, RIGHT);
        }
    `);
    return buildCall;
}


function uop(primitivesId) {
    const buildCall = template(`
        function _uop(ARG, OPERATOR) {
            const key = Symbol.for(\`unary.\${OPERATOR}\`);
            if (typeof ARG !== 'undefined') {
                const proto = Object.getPrototypeOf(ARG);
                const op = proto.constructor[key];
                if (op && op.length === 1) {
                    return op.call(proto.constructor, ARG);
                }
            }
            return ${primitivesId}[OPERATOR](ARG);
        }
    `);
    return buildCall;
}

export default function({types: t}) {
    return {
        pre(state) {
        },

        visitor: {
            Program(path) {
                const binaryPrimitives = defineBinaryPrimitives()();
                const unaryPrimitives = defineUnaryPrimitives()();
                
                binaryPrimitives.declarations[0].id = path.scope.generateUidIdentifierBasedOnNode(binaryPrimitives.declarations[0].id);
                unaryPrimitives.declarations[0].id = path.scope.generateUidIdentifierBasedOnNode(unaryPrimitives.declarations[0].id);

                this.bop = bop(binaryPrimitives.declarations[0].id.name)({
                    LEFT: path.scope.generateUidIdentifier("left"),
                    RIGHT: path.scope.generateUidIdentifier("right"),
                    OPERATOR: path.scope.generateUidIdentifier("operator")
                })

                this.uop = uop(unaryPrimitives.declarations[0].id.name)({
                    ARG: path.scope.generateUidIdentifier("arg"),
                    OPERATOR: path.scope.generateUidIdentifier("operator")
                })
                
                this.bop.id = path.scope.generateUidIdentifierBasedOnNode(this.bop.id);
                this.uop.id = path.scope.generateUidIdentifierBasedOnNode(this.uop.id);

                path.unshiftContainer('body', binaryPrimitives);
                path.unshiftContainer('body', unaryPrimitives);

                path.unshiftContainer('body', this.bop);
                path.unshiftContainer('body', this.uop);
            },

            FunctionDeclaration(path) {
                if (path.node.id.name === this.bop.id.name ||
                    path.node.id.name === this.uop.id.name) {
                    path.skip();
                }
            },

            BinaryExpression(path) {
                if (path.node.hasOwnProperty('_fromTemplate')) {
                    path.skip();
                    return
                }

                path.replaceWith(t.callExpression(this.bop.id, [path.node.left, path.node.right, t.stringLiteral(path.node.operator)]))
            },
            
            UnaryExpression(path) {
                if (path.node.hasOwnProperty('_fromTemplate')) {
                    path.skip();
                    return;
                }

                const op = t.stringLiteral(path.node.operator);
                path.replaceWith(t.callExpression(this.uop.id, [path.node.argument, op]))
            },

            UpdateExpression(path) {
                if (path.node.hasOwnProperty('_fromTemplate')) {
                    path.skip();
                    return;
                }

                const op = t.stringLiteral(path.node.operator);
                path.replaceWith(t.assignmentExpression("=", path.node.argument, t.callExpression(this.uop.id, [path.node.argument, op])));
            },

            AssignmentExpression(path) {
                if (path.node.hasOwnProperty('_fromTemplate')) {
                    path.skip();
                    return;
                }

                const operator = path.node.operator;
                if (operator !== '+=' && operator !== '-=' &&
                    operator !== '*=' && operator !== '~=' &&
                    operator !== '/=' && operator !== '%=') {
                    return;
                }
                
                const op = t.stringLiteral(operator.substring(0, 1));
                const bopCall = t.callExpression(this.bop.id, [path.node.left, path.node.right, op]);
                path.replaceWith(t.assignmentExpression("=", path.node.left, bopCall))
            },

            TemplateLiteral(path) {
                path.node.expressions = path.node.expressions && path.node.expressions.map(e => {
                    return t.callExpression(t.memberExpression(e, t.identifier('toString')),[]);
                })
            }
        }
    }
}