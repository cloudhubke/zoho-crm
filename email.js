const vars = require('./vars.json');
const axiosinstance = require('./axiosInatance');
const { MailURI } = vars;

module.exports = {
  sendEmail: async ({ AccessToken, AccountId, options }, cb) => {
    try {
      if (AccessToken && AccountId) {
        const { data } = await axiosinstance({
          Authorization: `Zoho-oauthtoken ${AccessToken}`,
        }).post(`${MailURI}/${AccountId}/messages`, {
          ...(options || {}),
        });
        if (typeof cb === 'function') {
          return cb(data);
        }
        return data;
      }
      throw new Error('AccessToken or AccountId is missing');
    } catch (error) {
      throw error;
    }
  },
  sendEmailWithAttachment: async (
    { AccessToken, AccountId, Files, options },
    cb
  ) => {
    try {
      if (AccessToken && AccountId) {
        const { data } = await axiosinstance({
          Authorization: `Zoho-oauthtoken ${AccessToken}`,
        }).post(`${MailURI}/${AccountId}/messages`, {
          ...(options || {}),
        });
        if (typeof cb === 'function') {
          return cb(data);
        }
        return data;
      }
      throw new Error('AccessToken or AccountId is missing');
    } catch (error) {
      throw error;
    }
  },
  uploadAttachment: async ({ AccessToken, AccountId, File, options }, cb) => {
    try {
      if (AccessToken && AccountId) {
        const { data } = await axiosinstance({
          Authorization: `Zoho-oauthtoken ${AccessToken}`,
          'Content-Type': 'multipart/form-data',
        }).post(`${MailURI}/${AccountId}/messages`, {
          ...(options || {}),
        });
        if (typeof cb === 'function') {
          return cb(data);
        }
        return data;
      }
      throw new Error('AccessToken or AccountId is missing');
    } catch (error) {
      throw error;
    }
  },
};
