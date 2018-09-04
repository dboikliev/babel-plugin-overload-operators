import assert from 'assert';
import glob from 'glob'
import path from 'path'
import fs from 'fs';
import { transformFileSync } from '@babel/core'


describe('transformation tests', () => {
    const fixturesDir = 'test/fixtures'
    const fixtures = glob.sync(path.join(fixturesDir, '/*/'))

    fixtures.forEach(fixture => {
        const testName = testNameFromFixture(fixture);

        it(`${testName} works`, () => {
            const expectedPath = path.join(fixture, 'expected.js');
            const expected = fs.readFileSync(expectedPath, 'utf8')
                .replace(/\r\n/g, "\n");

            const actualPath = path.join(fixture, 'actual.js');
            const actual = transformFileSync(actualPath, {
                presets: ["@babel/preset-env"],
                plugins: ['./dist/index.js']
            }).code;

            assert.strictEqual(actual, expected);
        });
    })
})

function testNameFromFixture(fixture) {
    const parts = fixture.split('/');
    return parts[parts.length - 2];
}
