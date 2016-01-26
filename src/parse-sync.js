var fs = require('fs');
var _ = require('lodash');

var file = JSON.parse(fs.readFileSync('hadley_repos'));

var result = _.reduce(file, (acc, value, i, array) => {
  if (!value.fork) {
    let {
      name,
      full_name,
      description,
      created_at,
      updated_at,
      pushed_at,
      size,
      stargazers_count,
      watchers_count,
      language,
      forks_count,
      forks,
      watchers,
      has_issues,
      open_issues,
      open_issues_count
    } = value;

      acc.push({
        name,
        full_name,
        created_at,
        updated_at,
        pushed_at,
        size,
        stargazers_count,
        watchers_count,
        language,
        forks_count,
        forks,
        watchers,
        open_issues,
        open_issues_count
      });
  }
  return acc;
}, []);
console.log(result.length);
console.log(result);
