/**
 *
 * Created by devin on 1/27/16.
 */
import test from 'tape';
import parseUser from '../../src/parsing/parse-user';

test('Assertions with tape.', (assert) => {
  const mockData = {
    "login": "dpastoor",
    "id": 3196313,
    "avatar_url": "https://avatars.githubusercontent.com/u/3196313?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/dpastoor",
    "html_url": "https://github.com/dpastoor",
    "followers_url": "https://api.github.com/users/dpastoor/followers",
    "following_url": "https://api.github.com/users/dpastoor/following{/other_user}",
    "gists_url": "https://api.github.com/users/dpastoor/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/dpastoor/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/dpastoor/subscriptions",
    "organizations_url": "https://api.github.com/users/dpastoor/orgs",
    "repos_url": "https://api.github.com/users/dpastoor/repos",
    "events_url": "https://api.github.com/users/dpastoor/events{/privacy}",
    "received_events_url": "https://api.github.com/users/dpastoor/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Devin Pastoor",
    "company": "University of Maryland Center for Translational Medicine",
    "blog": null,
    "location": "Baltimore, MD",
    "email": "devin.pastoor@gmail.com",
    "hireable": null,
    "bio": null,
    "public_repos": 197,
    "public_gists": 32,
    "followers": 26,
    "following": 13,
    "created_at": "2013-01-06T03:19:45Z",
    "updated_at": "2016-01-07T20:22:03Z"
  };

  const expected = {
    "login": "dpastoor",
    "type": "User",
    "location": "Baltimore, MD",
    "public_repos": 197,
    "public_gists": 32,
    "followers": 26,
    "following": 13,
    "created_at": "2013-01-06T03:19:45Z"
  }
  const actual = parseUser(mockData);
  assert.deepEqual(actual, expected,
    'user fields appropriately parsed');

  assert.end();
});
