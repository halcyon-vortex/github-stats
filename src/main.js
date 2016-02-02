import Client from 'github';
import processUser from './process-user-aa';
import processAllStargazers from './processAllStargazers';
import getAllStarsFromUser from './get-all-stars-from-user'
var _ = require('lodash');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
let github = new Client({
  debug: true,
  version: "3.0.0"
});

github.authenticate({
  type: "basic",
  username: "dpastoor",
  password: process.env.GHPW
});
Promise.promisifyAll(github.repos);
Promise.promisifyAll(github.user);

//console.log('start processing');
console.time('processing');
getAllStarsFromUser(github, "dpastoor", 10).then(res => {
  console.log(res);
  console.timeEnd('processing');
  console.time('wrotefiles');
  fs.writeFileSync('dps.json', JSON.stringify(res, null, 4));
  console.timeEnd('wrotefiles');
});
//fs.writeFileSync('dps.json', JSON.stringify(results, null, 4));
//github.repos.getStargazersAsync({user: 'dpastoor', repo: 'PKPDmisc'})
//  .then((res) => console.log(JSON.stringify(res, null, 4)));
// processUser(github, "dpastoor");
//let dir = "../prior_responses/dpastoor-100-paginated";
//let fullDir = path.join(__dirname, dir);
//console.log(fullDir)
//let parseData = async function(fullDir) {
//  let files = await fs.readdirAsync(fullDir);
//  let getData = _.map(files, (file) => fs.readFileAsync(path.join(fullDir, file)).then((res) => JSON.parse(res)));
//  let results = await Promise.all(getData);
//  return processAllStargazers(results, 5);
//}
//
//parseData(fullDir).then((res) => console.log(res.length));
