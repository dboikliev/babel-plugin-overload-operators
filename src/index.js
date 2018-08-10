import template from "babel-template";

function defineBinary() {
    return template(`function __binary(LEFT, RIGHT, KEY) {
        const leftProto = Object.getPrototypeOf(LEFT);
        const leftOp = leftProto.constructor[KEY];
        if (leftOp && leftOp.length === 2) {
            return { result: leftOp.call(leftProto.constructor, LEFT, RIGHT), hasOp: true };
        }
        const rightProto = Object.getPrototypeOf(RIGHT);
        const rightOp = rightProto.constructor[KEY];
        if (rightOp && rightOp.length === 2) {
            return { result: rightOp.call(rightProto.constructor, LEFT, RIGHT), hasOp: true };
        }

        return { hasOp: false }
    }`)
}

function defineUnary() {
    return template(`function __unary(ARG, KEY) {
        const proto = Object.getPrototypeOf(ARG);
        const op = proto.constructor[KEY];
        if (op && op.length === 1) {
            return { result: op.call(proto.constructor, ARG), hasOp: true };
        }
        return {hasOp: false};
    }`)
}

function binaryOperation(operator, binaryOp) {
    const buildCall = template(`
        (function (LEFT, RIGHT) {
            const key = Symbol.for('binary.${operator}');
            const {result, hasOp} =  ${binaryOp}(LEFT, RIGHT, key)
            return hasOp ? result : LEFT ${operator} RIGHT;
        })
    `);
    return buildCall;
}

function unaryOperation(operator, unaryOp) {
    const buildCall = template(`
        (function (ARG) {
            const key = Symbol.for('unary.${operator}');
            const {result, hasOp} = ${unaryOp}(ARG, key);
            return hasOp ? result : ${operator} ARG;
        })
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
                
                binaryNode.id.name = path.scope.generateUidIdentifierBasedOnNode(binaryNode.id).name;
                unaryNode.id.name = path.scope.generateUidIdentifierBasedOnNode(unaryNode.id).name;

                this.binary = binaryNode.id.name;
                this.unary = unaryNode.id.name;
          
                path.unshiftContainer('body', binaryNode);
                path.unshiftContainer('body', unaryNode);
            },

            BinaryExpression(path) {
                if (path.node.hasOwnProperty('_fromTemplate')) return

                let op = binaryOperation(path.node.operator, this.binary)
                let operation = (op({
                    LEFT: path.scope.generateUidIdentifier("left"),
                    RIGHT: path.scope.generateUidIdentifier("right"),
                })).expression;

                path.replaceWith(t.callExpression(operation, [path.node.left, path.node.right]))
            },
            
            UnaryExpression(path) {
                if (path.node.hasOwnProperty('_fromTemplate')) {
                    path.skip();
                    return;
                }
                let op = unaryOperation(path.node.operator, this.unary)
                let operation = (op({
                    ARG: path.scope.generateUidIdentifier("arg"),
                })).expression;
                path.replaceWith(t.callExpression(operation, [path.node.argument]))
            },

            UpdateExpression(path) {
                if (path.node.hasOwnProperty('_fromTemplate')) return
                let op = unaryOperation(path.node.operator, this.unary)
                let operation = (op({
                    ARG: path.scope.generateUidIdentifier("arg"),
                })).expression;
                path.replaceWith( t.assignmentExpression("=", path.node.argument, t.callExpression(operation, [path.node.argument])));
            },

            AssignmentExpression(path) {
                if (path.node.hasOwnProperty('_fromTemplate')) return
                const operator = path.node.operator;
                if (operator !== '+=' && operator !== '-=' &&
                    operator !== '*=' && operator !== '~=' &&
                    operator !== '/=' && operator !== '%=') {
                    return;
                }
                let op = binaryOperation(path.node.operator, this.binary)
                let operation = (op({
                    LEFT: path.scope.generateUidIdentifier("left"),
                    RIGHT: path.scope.generateUidIdentifier("right"),
                })).expression;

                path.replaceWith( t.assignmentExpression("=", path.node.left, t.callExpression(operation, [path.node.left, path.node.right])))
            }
        }
    }
}