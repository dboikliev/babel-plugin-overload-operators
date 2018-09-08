import assert from 'assert';

class Value {
    constructor(v) {
        this.v = v;
    }

    static 'unary.+'(a) {
        return new Value(a.v);
    }

    static 'unary.-'(a) {
        return new Value(-a.v);
    }

    static 'unary.++'(a) {
        return new Value(a.v + 1);
    }

    static 'unary.--'(a) {
        return new Value(a.v - 1);
    }

    static 'unary.~'(a) {
        return new Value(~a.v);
    }

    static 'unary.!'(a) {
        return new Value(!a.v);
    }

    static 'unary.typeof'(a) {
        return a.constructor.name;
    }

    static 'unary.void'(a) {
        return new Value(a.v * 0);
    }
}

let a = new Value(10);

assert.strictEqual((+a).v, 10, '+');
assert.strictEqual((-a).v, -10, '-');
let prev = a;
++a;
assert.strictEqual(a.v, prev.v + 1, '++ prefix');
prev = a;
--a;
assert.strictEqual(a.v, prev.v - 1, '-- prefix');
prev = a;
a++;
assert.strictEqual(a.v, prev.v + 1, '++ suffix');
prev = a;
a--;
assert.strictEqual(a.v, prev.v - 1, '-- suffix');
assert.strictEqual((~a).v, ~a.v, '~');
!a;
assert.strictEqual((!a).v, !a.v, '!');
typeof a;
assert.strictEqual(typeof a, a.constructor.name, 'typeof');
void a;
assert.strictEqual((void a).v, 0, 'void');