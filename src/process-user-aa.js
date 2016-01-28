import _ from 'lodash';
import Promise from 'bluebird';
import winston from 'winston';
import parseUser from './parsing/parse-user';
import parseRepos from './parsing/parse-repos';
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

  // get user information (key --> number of repos for pagination purposes)
  let userInfo = await request.getAsync(`https://dpastoor:${process.env.GHPW}@api.github.com/users/${user}`);

  let parsedUserInfo = parseUser(userInfo.body);
  //winston.log('info', 'user info', parsedUserInfo);
  // get repos
  // TODO: add pagination
  let userStars = await getStarredFromUser({user: user, per_page: 100});

  // for each repo, if not currently stored in redis, get key information + stargazers
  let userStarsParsed = parseRepos(userStars);

  winston.log('info', 'user starred repos', {data: 'more problems?'});
  // store everything
  fs.writeFileSync("userStarsParsed.json", JSON.stringify(userStarsParsed, null, 4))
  //let rate_limit = await request.getAsync(`https://dpastoor:${process.env.GHPW}@api.github.com/rate_limit`);

  //let body = userInfo.body;
  //let isOrg = body.type === 'User';
  //let numRepos = body.public_repos;
  //let raw_results = await getReposFromUser({user: "tj", per_page: 10});
  //console.log(raw_results)
};
export default processUser;
