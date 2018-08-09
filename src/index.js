import template from "babel-template";

function defineBinary() {
    return template(`function __binary(LEFT, RIGHT, KEY) {
        const leftProto = Object.getPrototypeOf(LEFT);
        const leftOp = leftProto.constructor[KEY];
        if (leftOp && leftOp.length === 2) {
            return leftOp(LEFT, RIGHT);
        }
        const rightProto = Object.getPrototypeOf(RIGHT);
        const rightOp = rightProto.constructor[KEY];
        if (rightOp && rightOp.length === 2) {
            return rightOp(LEFT, RIGHT);
        }
    }`)
}

function defineUnary() {
    return template(`function __unary(ARG, KEY) {
        const proto = Object.getPrototypeOf(ARG);
        const op = proto.constructor[KEY];
        if (op && op.length === 1) {
            return op(ARG);
        }
    }`)
}

function binaryOperation(operator, binaryOp) {
    const buildCall = template(`
        (function (LEFT, RIGHT) {
            const key = Symbol.for('binary.${operator}');
            const result = ${binaryOp}(LEFT, RIGHT, key)
            return typeof result !== 'undefined' ? result :  LEFT ${operator} RIGHT;
        })
    `);
    return buildCall;
}

function unaryOperation(operator, unaryOp) {
    const buildCall = template(`
        (function (ARG) {
            const key = Symbol.for('unary.${operator}');
            const result = ${unaryOp}(ARG, key);
            return typeof result !== 'undefined' ? result : ${operator}ARG;
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
                if (path.node.hasOwnProperty('_fromTemplate')) return
                let op = unaryOperation(path.node.operator, this.unary)
                let operation = (op({
                    ARG: path.scope.generateUidIdentifier("arg"),
                })).expression;
                console.log(path.node);
                path.replaceWith(t.callExpression(operation, [path.node.argument]))
            },

            UpdateExpression(path) {
                if (path.node.hasOwnProperty('_fromTemplate')) return
                let op = unaryOperation(path.node.operator, this.unary)
                let operation = (op({
                    ARG: path.scope.generateUidIdentifier("arg"),
                })).expression;
                console.log(path.node);
                path.replaceWith( t.assignmentExpression("=", path.node.argument, t.callExpression(operation, [path.node.argument])));
            },

            AssignmentExpression(path) {
                if (path.node.hasOwnProperty('_fromTemplate')) return
                if (path.node.operator !== '+=' && path.node.operator !== '-=') return
                
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