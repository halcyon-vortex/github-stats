import _ from 'lodash';
import Client from 'github';
import fs from 'fs';

let github = new Client({
  debug: true,
  version: "3.0.0"
});

github.authenticate({
    type: "basic",
    username: "dpastoor",
    password: process.env.GHPW
});

github.user.get({}, function(err, res) {
    fs.writeFile("user_get_res.txt", JSON.stringify(res, null, 4), (err, res) => console.log('wrote user_get_res'));

    github.repos.getAll({per_page: 100}, function(err, res) {
    fs.writeFile("user_get_allrepos_100.txt", JSON.stringify(res, null, 4), (err, res) => console.log('wrote user_get_repos'));
    });
});
