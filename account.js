const vars = require('./vars.json');
const axiosinstance = require('./axiosInatance');
const { AccountURI } = vars;

module.exports = {
  getAccounts: async ({ AccessToken }, cb) => {
    try {
      if (AccessToken) {
        const { data } = await axiosinstance({
          Authorization: `Zoho-oauthtoken ${AccessToken}`,
        }).get(`${AccountURI}`);
        if (typeof cb === 'function') {
          return cb(data);
        }
        return data;
      }
      throw new Error('AccessToken is missing');
    } catch (error) {
      throw error;
    }
  },
  getOrgAccounts: async ({ AccessToken, OrgId }, cb) => {
    try {
      if (AccessToken) {
        const { data } = await axiosinstance({
          Authorization: `Zoho-oauthtoken ${AccessToken}`,
        }).get(`http://mail.zoho.com/api/organization/${OrgId}/accounts`);
        if (typeof cb === 'function') {
          return cb(data);
        }
        return data;
      }
      throw new Error('AccessToken is missing');
    } catch (error) {
      throw error;
    }
  },
};
