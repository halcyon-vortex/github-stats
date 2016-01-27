import bluebird from 'bluebird';
let Client = bluebird.promisifyAll(require('github'));
import processUser from './process-user-aa';
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
