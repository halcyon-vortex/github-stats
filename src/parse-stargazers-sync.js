var fs = require('fs');
var _ = require('lodash');

var file = JSON.parse(fs.readFileSync('go-config.json'));

var result = _.map(file, (repo) => repo.login)
console.log(result.length);
console.log(result);
fs.writeFileSync('go-config-users.txt', result)
