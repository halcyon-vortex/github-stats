/**
 *
 * Created by devin on 1/27/16.
 */
import test from 'tape';
import parseRepos from '../../src/parsing/parse-repos';
import mockData from './mockData/mockRepos';
import mockDataParsed from './mockData/mockReposParsed';
test('Assertions with tape.', (assert) => {
  const expected =  mockDataParsed.parsedRepos;
  const expectedStarred =  mockDataParsed.parsedReposStarredAt;
  const actual = parseRepos(mockData.Repos);
  const actualStarred = parseRepos(mockData.ReposStarredAt);
  assert.deepEqual(actual, expected,
    'All user repos appropriately parsed');
  assert.deepEqual(actualStarred, expectedStarred,
    'All user repos appropriately parsed');
  assert.end();
});
