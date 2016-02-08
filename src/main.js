import Client from 'github';
import processUser from './process-user-aa';
import processAllStargazers from './processAllStargazers';
import getAllStarsFromUser from './get-all-stars-from-user'
import _ from 'lodash';
import bunyan from 'bunyan';

let log = bunyan.createLogger({
  name: 'main',
  streams: [{
    path: '/Users/devin/HR/thesis/github-stats/bunyan.log'
  }]
});

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
let github = new Client({
  debug: true,
  version: "3.0.0"
});

github.authenticate({
  type: "basic",
  username: "umphx",
  password: "zxcvasdfqwer1"
});
Promise.promisifyAll(github.repos);
Promise.promisifyAll(github.user);

//console.time('processingvjd');
//processUser(github, "vjd").then(res => {
//  fs.writeFileSync('vjd.json', JSON.stringify(res, null, 4));
//  console.timeEnd('processingvjd');
//})
// previous tests -------------------
//console.log('start processing');
//console.profile('processing');
getAllStarsFromUser(github, "dpastoor", 11, 100).then(res => {
  console.log(res)
});
//fs.writeFileSync('dps.json', JSON.stringify(results, null, 4));
//github.repos.getStargazersAsync({user: 'dpastoor', repo: 'PKPDmisc'})
//  .then((res) => console.log(JSON.stringify(res, null, 4)));
// processUsergithub, "dpastoor");

//
//let dir = "../prior_responses/dpastoor-100-paginated";
//let udir = "../prior_responses/users";
//let fullDir = path.join(__dirname, dir);
//let userDir = path.join(__dirname, udir);
//console.log(fullDir);
//let parseData = async function(fullDir) {
//  let files = await fs.readdirAsync(fullDir);
//  let getData = _.map(files, (file) => fs.readFileAsync(path.join(fullDir, file)).then((res) => JSON.parse(res)));
//  let results = await Promise.all(getData);
//  return processAllStargazers(results, 5, "dpastoor");
//};
//let parseUserData = async function(userDir) {
//  let files = await fs.readdirAsync(userDir);
//  return files
//};
//////
//const asyncResults = async function(fullDir, userDir) {
//  let results = await parseData(fullDir);
//  let downloadedUsers = await parseUserData(userDir);
//  let parsedDownloadedUsers = _.map(downloadedUsers, name => {
//    return {name: name.split('.json')[0]};
//  });
//  console.log('calculating diff');
//  let diff = _.differenceBy(results, parsedDownloadedUsers,  'name');
//  console.log('sorting');
//  let sortedData = _.sortBy(diff, (function(d) {
//    return -d.numSimilarRepos;
//  }));
//  console.log('remaining to download: ' + sortedData.length);
//  console.log('done sorting');
//  return sortedData;
//}
//
////parseUserData(fullDir).then(res => console.log(res));
//asyncResults(fullDir, userDir).then(res => {
//  let i = 0;
//  let maxNum = 100;
//  var interval = setInterval(function() {
//    if (i >= maxNum) {
//      clearInterval(interval);
//    } else {
//      let user = res[i].name;
//      log.info('starting on user ' + user);
//      getAllStarsFromUser(github, user, 25, 100).then(res => {
//        log.info('finished on user ' + user);
//      }).catch(err => log.warn('error in getAllStars', err, user));
//      i++;
//    }
//  }, 30000);
//}).catch(err => log.warn('error in aynsc results', err));
