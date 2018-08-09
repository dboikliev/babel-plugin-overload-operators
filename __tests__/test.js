import * as babel from 'babel-core';
import plugin from '../dist/index';
import assert from 'assert';

const example = `
import Op from 'operators'

class Vector {
    constructor(x, y) {
        thix.x = x;
        this.y = y; 
    }

    static [Op.binary['+']](a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }
}
`;

it('works', () => {
  const {code} = babel.transform(example, {plugins: [plugin]});
  expect(code).toMatchSnapshot();
});