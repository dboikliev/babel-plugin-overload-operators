import template from "babel-template";

function defineBinary() {
    return template(`function __binary(LEFT, RIGHT, KEY) {
        if (typeof LEFT !== 'undefined') {
            const leftProto = Object.getPrototypeOf(LEFT);
            const leftOp = leftProto.constructor[KEY];
            if (leftOp && leftOp.length === 2) {
                return { result: leftOp.call(leftProto.constructor, LEFT, RIGHT), hasOp: true };
            }
        }

        if (typeof RIGHT !== 'undefined') {
            const rightProto = Object.getPrototypeOf(RIGHT);
            const rightOp = rightProto.constructor[KEY];
            if (rightOp && rightOp.length === 2) {
                return { result: rightOp.call(rightProto.constructor, LEFT, RIGHT), hasOp: true };
            }
        }

        return { hasOp: false }
    }`)
}

function defineUnary() {
    return template(`function __unary(ARG, KEY) {
        if (typeof ARG !== undefined) {
            const proto = Object.getPrototypeOf(ARG);
            const op = proto.constructor[KEY];
            if (op && op.length === 1) {
                return { result: op.call(proto.constructor, ARG), hasOp: true };
            }
        }
        return {hasOp: false};
    }`)
}

function bop(binaryOp) {
    const buildCall = template(`
        function _bop(LEFT, RIGHT, OPERATOR) {
            const primitives = {
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
                '>='(a, b) { return a > b },
                '<'(a, b) { return a > b },
                '<='(a, b) { return a > b },
            }

            const key = Symbol.for(\`binary.\${OPERATOR}\`);
            const {result, hasOp} = ${binaryOp}(LEFT, RIGHT, key)
            return hasOp ? result : primitives[OPERATOR](LEFT, RIGHT);
        }
    `);
    return buildCall;
}


function uop(unaryOp) {
    const buildCall = template(`
        function _uop(ARG, OPERATOR) {
            const primitives = {
                '+'(a) { return +a },
                '-'(a) { return -a },
                '++'(a) { return a++ },
                '--'(a) { return a-- },
                '~'(a) { return ~a },
                '!'(a) { return !a },
                'typeof'(a) { return typeof a }
            }

            const key = Symbol.for(\`unary.\${OPERATOR}\`);
            const {result, hasOp} = ${unaryOp}(ARG, key);
            return hasOp ? result : primitives[OPERATOR](ARG);
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
                const binaryNode = defineBinary()({
                    LEFT: path.scope.generateUidIdentifier("left"),
                    RIGHT: path.scope.generateUidIdentifier("right"),
                    KEY: path.scope.generateUidIdentifier("key")
                });

                const unaryNode = defineUnary()({
                    ARG: path.scope.generateUidIdentifier("arg"),
                    KEY: path.scope.generateUidIdentifier("key")
                })
                
                binaryNode.id = path.scope.generateUidIdentifierBasedOnNode(binaryNode.id);
                unaryNode.id = path.scope.generateUidIdentifierBasedOnNode(unaryNode.id);

                this.bop = bop(binaryNode.id.name)({
                    LEFT: path.scope.generateUidIdentifier("left"),
                    RIGHT: path.scope.generateUidIdentifier("right"),
                    OPERATOR: path.scope.generateUidIdentifier("operator")
                })

                this.uop = uop(unaryNode.id.name)({
                    ARG: path.scope.generateUidIdentifier("arg"),
                    OPERATOR: path.scope.generateUidIdentifier("operator")
                })
                console.log(this.uop);
                this.bop.id = path.scope.generateUidIdentifierBasedOnNode(this.bop.id);
                this.uop.id = path.scope.generateUidIdentifierBasedOnNode(this.uop.id);

                path.unshiftContainer('body', binaryNode);
                path.unshiftContainer('body', unaryNode);
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