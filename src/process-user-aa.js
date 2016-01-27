import _ from 'lodash';
import fs from 'fs';
import parseRepos from './parse-repos.js';
import Promise from 'bluebird';
import winston from 'winston';

winston.add(winston.transports.File, { filename: '../download_status.log' });
winston.remove(winston.transports.Console);

let processUser = async function(authenticatedGithubClient, user) {
  let getReposFromUser = Promise.promisify(authenticatedGithubClient.repos.getFromUser,
    {context: authenticatedGithubClient});
  console.log('searching');
  let raw_results = await getReposFromUser({user: "tj", per_page: 10});
  console.log(raw_results)
};
export default processUser;
