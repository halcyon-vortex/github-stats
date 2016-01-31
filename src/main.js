import Client from 'github';
import processUser from './process-user-aa';
import processAllStargazers from './processAllStargazers';
var _ = require('lodash');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
//let github = new Client({
//  debug: true,
//  version: "3.0.0"
//});
//
//github.authenticate({
//    type: "basic",
//    username: "dpastoor",
//    password: process.env.GHPW
//});

// processUser(github, "dpastoor");
let dir = "../prior_responses/dpastoor-100-paginated";
let fullDir = path.join(__dirname, dir);
console.log(fullDir)
let parseData = async function(fullDir) {
  let files = await fs.readdirAsync(fullDir);
  let getData = _.map(files, (file) => fs.readFileAsync(path.join(fullDir, file)).then((res) => JSON.parse(res)));
  let results = await Promise.all(getData);
  return processAllStargazers(results, 5);
}

parseData(fullDir).then((res) => console.log(res.length));
