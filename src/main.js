import _ from 'lodash';
import Client from 'github';
import fs from 'fs';
import parseRepos from './parse-repos.js';
let github = new Client({
  debug: true,
  version: "3.0.0"
});

github.authenticate({
    type: "basic",
    username: "dpastoor",
    password: process.env.GHPW
});

// github.user.getFollowingFromUser({user: 'dpastoor'}, function(err, res) {
//     fs.writeFile("getFollowingFromUser.json", JSON.stringify(res, null, 4), (err, res) => console.log('getFollowingFromUser'));
// });

// basic stats about user
// github.user.getFrom({user: 'johnmyleswhite'}, function(err, res) {
//     fs.writeFile("getFrom_johnmyleswhite.json", JSON.stringify(res, null, 4), (err, res) => console.log('getFrom'));
// });


// github.repos.getFromOrg({org: 'meteor', per_page: 100}, (err, res) => {
//   fs.writeFile("meteor_repos", JSON.stringify(res, null, 4), (err, res) => console.log('meteor repos'));
// });
github.repos.getFromUser({user: 'tj', per_page: 100}, (err, res) => {
  let repos = parseRepos(res);
  fs.writeFile("tj_repos_data.json", JSON.stringify(repos, null, 4), (err, res) => console.log('wrote repos data'));
  let moreThanTenStars = _.reduce(repos, (acc, repo, i, arr) => {
    if (repo.stargazers_count > 10) {
      return acc.concat(repo.name);
    }
    return acc;
  }, []);
  console.log('repos with more than 10 stars');
  console.log(moreThanTenStars);
  _.forEach(moreThanTenStars, (repo, index) => {
    // don't want to slam github with too many api requests per second
    setTimeout(() => {
      console.log('initializing request for: ' + repo);
      github.repos.getStargazers({user: 'tj', repo: repo}, (err, res) => {
        console.log('got response from ' + repo);
        fs.writeFile(repo+'.json', JSON.stringify(res, null, 4), (err, res) => console.log('wrote file: ' + repo));
      });
    }, 1500*Math.floor(index/10));

  });

});
