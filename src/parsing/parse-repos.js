import _ from 'lodash';

export default (file) => _.reduce(file, (acc, value, i, array) => {
  let starred_at = null;
  if (value.hasOwnProperty('starred_at')) {
    // if passing in headers for starred at, the original json object is all pushed into the repo property
    starred_at = value.starred_at;
    value = value.repo;
  }

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

  let output = {
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
  };

  if (starred_at) {
    output["starred_at"] = starred_at;
  }

  return acc.concat(output);
}, []);
