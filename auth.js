const vars = require('./vars.json');
const axiosinstance = require('./axiosInatance');
const { AuthURI, Scopes } = vars;

module.exports = {
  getAuthorization: async (
    { Scope, ClientId, AccessType, RedirectURI },
    cb
  ) => {
    try {
      let scope = Scope;
      if (Scope === 'ALL') {
        scope = Scopes.map((s) =>
          s.Operations.map((op) => `ZohoMail.${s.Name}.${op}`).join(',')
        ).join(',');
      }
      if (!Scope) {
        scope = 'ZohoMail.messages.READ';
      }
      if (typeof cb === 'function') {
        return cb(
          `${AuthURI}/auth?scope=${scope}&client_id=${ClientId}&response_type=code&access_type=${
            AccessType || 'online'
          }&redirect_uri=${RedirectURI}&state=${Date.now()}`
        );
      }
      return `${AuthURI}/auth?scope=${scope}&client_id=${ClientId}&response_type=code&access_type=${
        AccessType || 'online'
      }&redirect_uri=${RedirectURI}&state=${Date.now()}`;
    } catch (error) {
      const { response } = error || {};
      const { data } = response || {};
      const message = (data && data.message) || error.message;
      console.log(message);
      throw error;
    }
  },

  getAccessToken: async (
    { ClientId, ClientSecret, GrantToken, RedirectURI },
    cb
  ) => {
    try {
      const { data } = await axiosinstance().post(
        `${AuthURI}/token?client_id=${ClientId}&client_secret=${ClientSecret}&code=${GrantToken}&redirect_uri=${RedirectURI}&grant_type=authorization_code`
      );
      if (data && data.refresh_token) {
        if (typeof cb === 'function') {
          return cb(data);
        }
        return data;
      }
      throw new Error('No refresh token');
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  renewAccessToken: async ({ ClientId, ClientSecret, RefreshToken }, cb) => {
    try {
      const { data } = await axiosinstance().post(
        `${AuthURI}/token?client_id=${ClientId}&client_secret=${ClientSecret}&refresh_token=${RefreshToken}&grant_type=refresh_token`,
        {}
      );
      if (typeof cb === 'function') {
        return cb(data);
      }
      return data;
    } catch (error) {
      throw error;
    }
  },
};
