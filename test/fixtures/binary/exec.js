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
}

const a = new Value(2);
const b = new Value(3);

const power = a ** 3;
assert.strictEqual(power.v, Math.pow(a.v, 3));

const sum = a + b;
assert.strictEqual(sum.v, a.v + b.v);

const diff = a - b;
assert.strictEqual(diff.v, a.v - b.v);