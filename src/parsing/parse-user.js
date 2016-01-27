/**
 * Represents a book.
 * @param {obj} data - json data returned from get request from github /user/:userid
 */
let parseUser = (data) => {
  let {
    login,
    type,
    location,
    public_repos,
    public_gists,
    followers,
    following,
    created_at
  } = data;

  return ({
    login,
    type,
    location,
    public_repos,
    public_gists,
    followers,
    following,
    created_at
  });
}


export default parseUser;
