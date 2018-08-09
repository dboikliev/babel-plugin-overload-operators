import * as babel from 'babel-core';
import plugin from '../dist/index';
import assert from 'assert';

const example = `
class Vector {
    constructor(x, y) {
        thix.x = x;
        this.y = y; 
    }

    static [Symbol.for('unary.+')](a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }
}

var v = new Vector(1,1);
v--;
v += 12;
`;

it('works', () => {
  const {code} = babel.transform(example, {plugins: [plugin], presets: ["env"]});
  expect(code).toMatchSnapshot();
});