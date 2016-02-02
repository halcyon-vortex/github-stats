import Promise from 'bluebird';
import parse from 'parse-link-header';
import parseRepos from './parsing/parse-repos';
import _ from 'lodash';
import winston from 'winston';
const request = Promise.promisifyAll(require('superagent'));
export default async (ghcp, user, maxPages = 10) => {
  let starData = await request.getAsync(`https://dpastoor:${process.env.GHPW}@api.github.com/users/${user}/starred?per_page=100`);
  let links = parse(starData.headers.link);
  winston.log('info', "links", {data: links});
  let starredRepos = parseRepos(starData.body);
  if (links.last.page > 1) {
    let starsPromises = _.map(_.range(2, Math.min(maxPages, links.last.page + 1)), function(pageNum) {
        winston.log('info', 'fetching star data : ' + pageNum + 'for user ' + user);
        return ghcp.repos.getStarredFromUser({
          user: user,
          page: pageNum,
          per_page: 100
        });
      });
    let remainingStarred = await Promise.all(starsPromises);
    starredRepos = starredRepos.concat(_.map(remainingStarred, parseRepos));
  }
  console.log('---starred repos -----')

  console.log(starredRepos.length)
  return starredRepos;
};