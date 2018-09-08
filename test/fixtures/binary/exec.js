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

    static 'binary.|'(a, b) {
        return new Value(a.v | b.v);
    }

    static 'binary.&'(a, b) {
        return new Value(a.v & b.v);
    }

    static 'binary.^'(a, b) {
        return new Value(a.v ^ b.v);
    }

    static 'binary.||'(a, b) {
        return new Value(a.v || b.v);
    }

    static 'binary.&&'(a, b) {
        return new Value(a.v && b.v);
    }

    static 'binary.=='(a, b) {
        return a.v == b.v;
    }

    static 'binary.==='(a, b) {
        return a.v === b.v;
    }

    static 'binary.!='(a, b) {
        return a.v != b.v;
    }

    static 'binary.!=='(a, b) {
        return a.v !== b.v;
    }

    static 'binary.>'(a, b) {
        return a.v > b.v;
    }

    static 'binary.<'(a, b) {
        return a.v < b.v;
    }

    static 'binary.>='(a, b) {
        return a.v >= b.v;
    }

    static 'binary.<='(a, b) {
        return a.v <= b.v;
    }

    static 'binary.<<'(a, b) {
        return new Value(a.v << b.v);
    }

    static 'binary.>>'(a, b) {
        return new Value(a.v >> b.v);
    }

    static 'binary.instanceof'(instance, type) {
        return instance.v instanceof type || typeof instance.v === 'number';
    }
}

class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    static 'binary.in'(value, range) {
        return value.v >= range.start && value.v <= range.end;
    }
}

const a = new Value(5);
const b = new Value(3);
const range = new Range(0, 10);

assert.strictEqual((a ** 3).v, Math.pow(a.v, 3), '**');
assert.strictEqual((a + b).v, a.v + b.v, '+');
assert.strictEqual((a - b).v, a.v - b.v, '-');
assert.strictEqual((a * b).v, a.v * b.v, '*');
assert.strictEqual((a / b).v, a.v / b.v, '/');
assert.strictEqual((a % b).v, a.v % b.v, '%');
assert.strictEqual((a | b).v, a.v | b.v, '|');
assert.strictEqual((a & b).v, a.v & b.v, '&');
assert.strictEqual((a ^ b).v, a.v ^ b.v, '^');
assert.strictEqual((a || b).v, a.v || b.v, '||');
assert.strictEqual((a && b).v, a.v && b.v, '&&');
assert.strictEqual(a == b, a.v == b.v, '==');
assert.strictEqual(a === b, a.v === b.v, '===');
assert.strictEqual(a != b, a.v != b.v, '!=');
assert.strictEqual(a !== b, a.v !== b.v, '!==');
assert.strictEqual(a > b, a.v > b.v, '>');
assert.strictEqual(a < b, a.v < b.v, '<');
assert.strictEqual(a >= b, a.v >= b.v, '>=');
assert.strictEqual(a <= b, a.v <= b.v, '<=');
assert.strictEqual((a >> b).v, a.v >> b.v, '>>');
assert.strictEqual((a << b).v, a.v << b.v, '<<');
assert.strictEqual(a instanceof Number, true, 'instanceof');
assert.strictEqual(a in range, a.v >= range.start && a.v <= range.end, 'in');