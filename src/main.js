require("babel-core/register");
require("babel-polyfill");
var Client = require('github');
var processUser = require('./process-user-aa');
var github = new Client({
  debug: true,
  version: "3.0.0"
});

github.authenticate({
    type: "basic",
    username: "dpastoor",
    password: process.env.GHPW
});

processUser(github, "tj");
