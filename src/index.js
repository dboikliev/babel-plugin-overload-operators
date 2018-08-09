import template from "babel-template";



function binaryOperation(ops, operator) {
    const buildCall = template(`
        (function (LEFT, RIGHT) {
            const key = ${ops}.default.binary['${operator}'];

            const leftProto = Object.getPrototypeOf(LEFT);
            const leftOp = leftProto.constructor[key];
            if (leftOp && leftOp.length === 2) {
                return leftOp(LEFT, RIGHT);
            }
            const rightProto = Object.getPrototypeOf(RIGHT);
            const rightOp = rightProto.constructor[key];
            if (rightOp && rightOp.length === 2) {
                return rightOp(LEFT, RIGHT);
            }

            return LEFT ${operator} RIGHT;
        })
    `);
    return buildCall;
}

function unaryOperation(ops, operator) {
    const buildCall = template(`
        (function (ARG) {
            const key = ${ops}.default.unary['${operator}'];

            const proto = Object.getPrototypeOf(ARG);
            const op = proto.constructor[key];
            if (op && op.length === 1) {
                return op(ARG);
            }

            return ${operator}ARG;
        })
    `);
    return buildCall;
}

export default function({types: t}) {
    return {
        visitor: {
            Function(innerPath) {
                console.log(innerPath);
            },

            Program(path) {
                this.ops =  path.scope.generateUidIdentifier('Op');
                const importDefaultSpecifier = t.ImportNamespaceSpecifier(this.ops);
                const importDeclaration = t.importDeclaration([importDefaultSpecifier], t.stringLiteral('./operators'));

                path.unshiftContainer('body', importDeclaration);
            },

            BinaryExpression(path) {
                if (path.node.hasOwnProperty('_fromTemplate')) return

                let op = binaryOperation(this.ops.name, path.node.operator)
                let operation = (op({
                    LEFT: path.scope.generateUidIdentifier("left"),
                    RIGHT: path.scope.generateUidIdentifier("right"),
                })).expression;

                path.replaceWith(t.callExpression(operation, [path.node.left, path.node.right]))
            },
            UnaryExpression(path) {
                if (path.node.hasOwnProperty('_fromTemplate')) return
                let op = unaryOperation(this.ops.name, path.node.operator)
                let operation = (op({
                    ARG: path.scope.generateUidIdentifier("arg"),
                })).expression;

                path.replaceWith(t.callExpression(operation, [path.node.argument]))
            }
        }
    }
}