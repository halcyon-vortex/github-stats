import _ from 'lodash';

export default (data) => _.reduce(data, (acc, value, i, array) => {
  let {
    starred_at,
    user
  } = value;
  let {
    login,
    type
  } = user;
  return acc.concat({
    starred_at,
    login,
    type
  });
}, []);
