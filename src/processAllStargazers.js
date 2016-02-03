/**
 * Created by devin on 1/30/16.
 */
var _ = require('lodash');
var Promise = require('bluebird');

/**
 *
 * @param {Array} Array of arrays of the stargazers associated with each repo
 * @param minSimilarRepos
 * @returns {Array} Array of Objects with the name and number of times a person was following one of the repositories
 */
let processAllStargazers = function(data, minSimilarRepos = 4, user) {
  let aggregateResults = _.reduce(data, (acc, data, i, total) => {
    if (Array.isArray(data)) {
      _.forEach(data, (id) =>{
        if (acc.hasOwnProperty(id.login)) {
          acc[id.login] += 1;
        } else {
          acc[id.login] = 1;
        }
      });
    } else {
      acc[data.login] += 1;
    }
    return acc
  }, {});
  let filteredResults = _.reduce(aggregateResults, (acc, val, key) => {
    if (val > minSimilarRepos) {
      if (user) {
        // if username passed in filter out the user
        return key === user ? acc : acc.concat({name: key, numSimilarRepos: val})
      } else {
        return acc.concat({name: key, numSimilarRepos: val})
      }
    } else {
      return acc
    }
  }, []);
  return filteredResults;
};

export default processAllStargazers;