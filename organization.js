const vars = require('./vars.json');
const axiosinstance = require('./axiosInatance');
const { OrgURI } = vars;

module.exports = {
  getOrganization: async ({ AccessToken, OrgId }, cb) => {
    try {
      if (AccessToken) {
        const { data } = await axiosinstance({
          Authorization: `Zoho-oauthtoken ${AccessToken}`,
        }).get(`${OrgURI}${OrgId ? `/${OrgId}` : ''}`);
        console.log(data);
        if (typeof cb === 'function') {
          return cb(data);
        }
        return data;
      }
      throw new Error('AccessToken or AccountId is missing');
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
