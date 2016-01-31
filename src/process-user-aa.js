import _ from 'lodash';
import Promise from 'bluebird';
import winston from 'winston';
import parseUser from './parsing/parse-user';
import parseRepos from './parsing/parse-repos';
import parseStargazers from './parsing/parse-stargazers';
import processAllStargazers from './processAllStargazers';
let fs = Promise.promisifyAll(require('fs'));
let request = Promise.promisifyAll(require('superagent'));
winston.add(winston.transports.File, { filename: 'download_status.log' });
winston.remove(winston.transports.Console);

let processUser = async function(authenticatedGithubClient, user) {
  // promisified methods

  let getUser = Promise.promisify(authenticatedGithubClient.user.get,
    {context: authenticatedGithubClient});

  let getReposFromUser = Promise.promisify(authenticatedGithubClient.repos.getFromUser,
    {context: authenticatedGithubClient});
  let getStargazersFromRepo = Promise.promisify(authenticatedGithubClient.repos.getStargazers,
    {context: authenticatedGithubClient});
  let getLanguagesFromRepo = Promise.promisify(authenticatedGithubClient.repos.getLanguages,
    {context: authenticatedGithubClient});
  let getStarredFromUser = Promise.promisify(authenticatedGithubClient.repos.getStarredFromUser,
    {context: authenticatedGithubClient});
//Accept: application/vnd.github.v3.star+json
  // get user information (key --> number of repos for pagination purposes)
  let userInfo = await request.getAsync(`https://dpastoor:${process.env.GHPW}@api.github.com/users/${user}`);

  let parsedUserInfo = parseUser(userInfo.body);
  //winston.log('info', 'user info', parsedUserInfo);
  // get repos
  // TODO: add pagination
  let userStars = await getStarredFromUser({user: user, per_page: 100});

  // for each repo, if not currently stored in redis, get key information + stargazers
  let userStarsParsed = parseRepos(userStars);
  let allStargazersAllRepos = [];
  for (let repo of userStarsParsed) {
    winston.log('info', 'starting fetching data');
    // range is none inclusive, so need to do to 1 past page num, and floor is not including any remainder
    // so + 1 for any remaining in the next 100 repos, so total of +2 in the _.range
    let stargazersPromises = _.map(_.range(1, Math.floor(repo.stargazers_count/100)+2), function(pageNum) {
        winston.log('info', 'fetching page: ' + pageNum + 'for repo ' + repo.full_name);
        return getStargazersFromRepo({
          headers: {"Accept": "application/vnd.github.v3.star+json"},
          user: repo.owner,
          repo: repo.name,
          page: pageNum,
          per_page: 100
        });
      }
    );
    let stargazers = await Promise.all(stargazersPromises);
    let allStargazers = _.flatten(_.map(stargazers, parseStargazers));
    allStargazersAllRepos.push(allStargazers);
    fs.writeFileSync(`stargazers_paginated_${repo.owner}_${repo.name}.json`, JSON.stringify(allStargazers, 4, null))
    winston.log('info', 'added page: ' + pageNum + 'for repo ' + repo.full_name);
  }
  console.log('got all stargazers');
 // process allStargazers

};
export default processUser;
