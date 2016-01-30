/**
 * Created by devin on 1/30/16.
 */
var _ = require('lodash');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

let addData = async function(dir, minSimilarRepos = 4) {
  let fullDir = path.join(__dirname, dir);
  let files = await fs.readdirAsync(fullDir);
  let getData = _.map(files, (file) => fs.readFileAsync(path.join(fullDir, file)));
  let results = await Promise.all(getData);
  let aggregateResults = _.reduce(results, (acc, data, i, total) => {
    let jsonData = JSON.parse(data);
    _.forEach(jsonData, (id) =>{
      if (acc.hasOwnProperty(id.login)) {
        acc[id.login] += 1;
      } else {
        acc[id.login] = 1;
      }
    });
    return acc
  }, {});
  let filteredResults = _.reduce(aggregateResults, (acc, val, key) => {
    if (val > minSimilarRepos) {
      return acc.concat({name: key, numSimilarRepos: val})
    } else {
      return acc
    }
  }, []);
  return filteredResults;
}

addData('../prior_responses/dpastoor-100-paginated', 4).then((res) => console.log(res.length));
