import _ from 'lodash';
import Client from 'github';
import fs from 'fs';
import parseRepos from './parse-repos.js'
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
github.repos.getFromUser({user: 'hadley', per_page: 100}, (err, res) => {
  console.log(parseRepos(res));
});
