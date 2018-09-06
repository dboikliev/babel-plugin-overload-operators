import assert from 'assert';
import glob from 'glob'
import path from 'path'
import fs from 'fs';
import vm from 'vm';
import { transformFileSync } from '@babel/core'


describe('transformation tests', () => {
    const fixturesDir = 'test/fixtures'
    const options = JSON.parse(fs.readFileSync('test/options.json')) || {}
    const fixtures = glob.sync(path.join(fixturesDir, '/*/'))

    fixtures.forEach(fixture => {
        const testName = testNameFromFixture(fixture);

        const expectedPath = path.join(fixture, 'expected.js');
        const actualPath = path.join(fixture, 'actual.js');

        fs.existsSync(expectedPath) 
        && fs.existsSync(actualPath) 
        && it(`${testName} transforms correctly`, () => {
            const expected = fs.readFileSync(expectedPath, 'utf8')
                .replace(/\r\n/g, "\n");

            const actual = transformFileSync(actualPath, options).code;

            assert.strictEqual(actual, expected);
        });

        const execPath = path.join(fixture, 'exec.js');
        fs.existsSync(execPath) 
        && it(`${testName} executes correctly`, () => {
            const exec = transformFileSync(execPath, options).code;

            var context = vm.createContext({ require: require });
            vm.runInContext(exec, context);
        });
    })
})

function testNameFromFixture(fixture) {
    const parts = fixture.split('/');
    return parts[parts.length - 2];
}
