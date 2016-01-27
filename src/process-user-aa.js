import _ from 'lodash';
import parseRepos from './parse-repos.js';
import Promise from 'bluebird';
import winston from 'winston';
let fs = Promise.promisify(require('fs'));
winston.add(winston.transports.File, { filename: '../download_status.log' });
winston.remove(winston.transports.Console);

let processUser = async function(authenticatedGithubClient, user) {
  // promisified methods
  
  let getReposFromUser = Promise.promisify(authenticatedGithubClient.repos.getFromUser,
    {context: authenticatedGithubClient});

  let getStargazersFromRepo = Promise.promisify(authenticatedGithubClient.repos.getStargazers,
    {context: authenticatedGithubClient});

  // get user information (key --> number of repos for pagination purposes)

  // get repos, paginating as necessary

  // for each repo get key information + stargazers

  // store everything

  console.log('searching');
  let raw_results = await getReposFromUser({user: "tj", per_page: 10});
  console.log(raw_results)
};
export default processUser;
