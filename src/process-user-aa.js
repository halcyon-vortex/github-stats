import _ from 'lodash';
import parseRepos from './parse-repos.js';
import Promise from 'bluebird';
import winston from 'winston';
let fs = Promise.promisifyAll(require('fs'));
let request = Promise.promisifyAll(require('superagent'));
winston.add(winston.transports.File, { filename: '../download_status.log' });
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
  // get user information (key --> number of repos for pagination purposes)

  // get repos, paginating as necessary

  // for each repo get key information + stargazers

  // store everything

  console.log('searching');
  //let userInfo = await request.getAsync('https://api.github.com/users/tj');
  let rate_limit = await request.getAsync(`https://dpastoor:${process.env.GHPW}@api.github.com/rate_limit`);

  console.log('------- rate limit -------');
  console.log(rate_limit);
  //let body = userInfo.body;
  //let isOrg = body.type === 'User';
  //let numRepos = body.public_repos;
  //let raw_results = await getReposFromUser({user: "tj", per_page: 10});
  //console.log(raw_results)
};
export default processUser;
