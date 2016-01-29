import _ from 'lodash';
import Promise from 'bluebird';
import winston from 'winston';
import parseUser from './parsing/parse-user';
import parseRepos from './parsing/parse-repos';
import parseStargazers from './parsing/parse-stargazers';
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
  let userStars = await getStarredFromUser({user: user, per_page: 10});

  // for each repo, if not currently stored in redis, get key information + stargazers
  let userStarsParsed = parseRepos(userStars);

  // "full_name": "MrRio/vtop",
  let example = userStarsParsed[1]; // should be vtop
  console.log(example)

  winston.log('info', 'starting fetching data')
  let stargazersPromises = _.map(_.range(1, 12), function(pageNum) {
    console.log('fetching page: ' + pageNum)
    return getStargazersFromRepo({
        headers: {"Accept": "application/vnd.github.v3.star+json"},
        user: example.owner,
        repo: example.name,
        page: pageNum,
        per_page: 100
      })
    }
  );
  let stargazers = await Promise.all(stargazersPromises);
  winston.log('info', 'finished fetching data');
  console.log('got all stargazers');
  fs.writeFileSync("stargazers_paginated.json", JSON.stringify(_.flatten(_.map(stargazers, parseStargazers)), 4, null))
  // store everything
  //let rate_limit = await request.getAsync(`https://dpastoor:${process.env.GHPW}@api.github.com/rate_limit`);

  //let body = userInfo.body;
  //let isOrg = body.type === 'User';
  //let numRepos = body.public_repos;
  //let raw_results = await getReposFromUser({user: "tj", per_page: 10});
  //console.log(raw_results)
};
export default processUser;
