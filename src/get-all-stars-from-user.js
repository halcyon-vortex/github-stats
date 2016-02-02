import Promise from 'bluebird';
import parse from 'parse-link-header';
import parseRepos from './parsing/parse-repos';
import _ from 'lodash';
import winston from 'winston';
const request = Promise.promisifyAll(require('superagent'));
/**
 *
 * @param ghcp {Github} authenticated github client with promisified async methods
 * @param user {string} user name
 * @param maxPagination {Number} max paginated requests
 * @param perPage {Number} per
 */
export default async (ghcp, user, maxPagination, perPage) => {
  let per_page = perPage || 100;
  let maxPages = maxPagination || 10;
  let starData = await request.getAsync(`https://dpastoor:${process.env.GHPW}@api.github.com/users/${user}/starred?per_page=${per_page}`);
  let links = parse(starData.headers.link);
  let starredRepos = parseRepos(starData.body);
  if (links.last.page > 1) {
    let starsPromises = _.map(_.range(2, Math.min(maxPages, parseInt(links.last.page) + 1)), function(pageNum) {
        winston.log('info', 'fetching star data : ' + pageNum + 'for user ' + user);
        return ghcp.repos.getStarredFromUserAsync({
          user: user,
          page: pageNum,
          per_page: per_page
        });
      });
    let remainingStarred = await Promise.all(starsPromises);
    starredRepos.push(_.map(remainingStarred, parseRepos));
  }
  return starredRepos;
};