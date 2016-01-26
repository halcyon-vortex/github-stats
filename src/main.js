import _ from 'lodash';
import Client from 'github';
import fs from 'fs';
import parseRepos from './parse-repos.js';
import processUser from './process-user';
let github = new Client({
  debug: true,
  version: "3.0.0"
});

github.authenticate({
    type: "basic",
    username: "dpastoor",
    password: process.env.GHPW
});

processUser(github, "tj");
