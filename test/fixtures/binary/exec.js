import assert from 'assert';

class Value {
    constructor(v) {
        this.v = v;
    }

    static 'binary.**'(value, power) {
        return new Value(value.v ** power);
    }

    static 'binary.+'(a, b) {
        return new Value(a.v + b.v);
    }

    static 'binary.-'(a, b) {
        return new Value(a.v - b.v);
    }

    static 'binary.*'(a, b) {
        return new Value(a.v * b.v);
    }

    static 'binary./'(a, b) {
        return new Value(a.v / b.v);
    }

    static 'binary.%'(a, b) {
        return new Value(a.v % b.v);
    }
}

const a = new Value(5);
const b = new Value(3);

assert.strictEqual((a ** 3).v, Math.pow(a.v, 3));
assert.strictEqual((a + b).v, a.v + b.v);
assert.strictEqual((a - b).v, a.v - b.v);
assert.strictEqual((a * b).v, a.v * b.v);
assert.strictEqual((a / b).v, a.v / b.v);
assert.strictEqual((a % b).v, a.v % b.v);