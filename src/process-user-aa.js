import _ from 'lodash';
import Promise from 'bluebird';
import winston from 'winston';
import parseStargazers from './parsing/parse-stargazers';
import getAllStarsFromUser from './get-all-stars-from-user';
let fs = Promise.promisifyAll(require('fs'));
let request = Promise.promisifyAll(require('superagent'));
winston.add(winston.transports.File, { filename: 'download_status.log' });
winston.remove(winston.transports.Console);

export default async function(ghcp, user) {
  // TODO: add pagination
  console.log('getting stars from user');
  let userStarsParsed = await getAllStarsFromUser(ghcp, user, 5, 100);
  let allStargazersAllRepos = [];
  for (let repo of userStarsParsed.starredRepos) {
    winston.log('info', 'starting fetching data');
    // only capture if stargazers count greater than 2
    if (repo.stargazers_count > 2) {
      // range is none inclusive, so need to do to 1 past page num, and floor is not including any remainder
      // so + 1 for any remaining in the next 100 repos, so total of +2 in the _.range
      let allStargazers;
      if (repo.stargazers_count < 1000) {
        let stargazersPromises = _.map(_.range(1, Math.floor(repo.stargazers_count / 100) + 2), function (pageNum) {
            winston.log('info', 'fetching page: ' + pageNum + 'for repo ' + repo.full_name);
            return ghcp.repos.getStargazersAsync({
              headers: {"Accept": "application/vnd.github.v3.star+json"},
              user: repo.owner,
              repo: repo.name,
              page: pageNum,
              per_page: 100
            });
          }
        );
        let stargazers = await Promise.all(stargazersPromises);
        console.log(stargazers);
        winston.log('info', 'stargazers', {data: JSON.stringify(stargazers)});
        allStargazers = _.flatten(_.map(stargazers, parseStargazers));
      } else {
        // repos with high star counts give a warning from github about too many requests when dumping hundreds of requests
        // per second, likewise, unlikely to provide any personalized network relations, so will keep them for records
        // but make easy to filter
        allStargazers = {"starred_at": new Date(), login: repo.full_name, type: "highlyStarred", numStars: repo.stargazers_count}
      }
      allStargazersAllRepos.push(allStargazers);
      fs.writeFileSync(`vjd/stargazers_paginated_${repo.owner}_${repo.name}.json`, JSON.stringify(allStargazers, 4, null));
      winston.log('info', 'wrote file', {file: repo.full_name});
    }
  }
  return allStargazersAllRepos;
};
