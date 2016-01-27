/**
 *
 * Created by devin on 1/27/16.
 */
import test from 'tape';
import parseRepos from '../../src/parsing/parse-repos';
import mockData from './mockData/mockRepos';
import mockDataParsed from './mockData/mockReposParsed';
import fs from 'fs';
test('Assertions with tape.', (assert) => {
  const expected =  mockDataParsed.parsedRepos;
  const actual = parseRepos(mockData.Repos);
  assert.deepEqual(actual, expected,
    'All user repos appropriately parsed');
  assert.end();
});
