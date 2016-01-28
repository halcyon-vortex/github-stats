import _ from 'lodash';

export default (file) => _.reduce(file, (acc, value, i, array) => {
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
      open_issues_count,
      owner,
      fork
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
        open_issues_count,
        owner: owner.login,
        fork
      });
  }
  return acc;
}, []);
