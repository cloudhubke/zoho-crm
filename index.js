const auth = require('./auth');
const email = require('./email');
const account = require('./account');
const organization = require('./organization');
const vars = require('./vars');
module.exports = {
  ...auth,
  ...email,
  ...vars,
  ...account,
  ...organization,
};
