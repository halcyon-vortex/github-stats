import _ from 'lodash';
import fs from 'fs';
import parseRepos from './parse-repos.js';
import winston from 'winston';

winston.add(winston.transports.File, { filename: '../download_status.log' });
winston.remove(winston.transports.Console);

export default (authenticatedGithubClient, user) => {

  authenticatedGithubClient.repos.getFromUser({user: 'tj', per_page: 100}, (err, res) => {
    let repos = parseRepos(res);
    fs.writeFile("tj_repos_data.json", JSON.stringify(repos, null, 4), (err, res) => winston.log('info', 'wrote repos data for ' + user, {err}));
    let moreThanFiveStars = _.reduce(repos, (acc, repo, i, arr) => {
      if (repo.stargazers_count > 5) {
        return acc.concat(repo.name);
      }
      return acc;
    }, []);
    _.forEach(moreThanFiveStars, (repo, index) => {
      // don't want to slam github with too many api requests per second
      setTimeout(() => {
        winston.log('info', 'initializing request for: ' + repo);
        authenticatedGithubClient.repos.getStargazers({user: 'tj', repo: repo}, (err, res) => {
          winston.log('info', 'got reponse from: ' + repo, {err});
          fs.writeFile(repo+'.json', JSON.stringify(_.map(res, (r) => r.login), null, 4), (err, res) => winston.log('info', 'wrote file: ' + repo, {err}));
        });
      }, 1500*Math.floor(index/10));

    });
  });
};
