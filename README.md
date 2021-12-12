# zoho-crm

Library to consume Zoho CRM API

## Installation

npm i @cloudhub-js/zoho-crm

## Authorization

Zoho API uses Oauth2 for authorization.

### Steps

1. Start by creating a client application in the Zoho API Console (https://api-console.zoho.com).
2. Select Server Based Application and set Cleint Name, Client Domain and redirect URIs. Set a production redirect URI and a local redirect URI (ngrok tunnel) for testing eg (https://yourdomain.com/api/zohocallback). Redirect URIs sent with API requests later must be registered in the application.
3. Create application then navigate to the "Client Secret" tab. Copy the Client ID and Client Secret and store them in your application config

The Zoho API requires authentication on the browser for the first time after setup. The zoho-crm library provides a function to generate the URL required to retrieve the authorization code. The URL contains the Client Id but not the Client Secret.
Follow these steps to generate code to authorize your application

1. Login to your Zoho admin account on the browser. This helps to auitomatically authenticate the authorization page once open.
2. Run a function to retrieve the URL and open it on a tab in the same browser. Below is a sample

```js
// Run a function within webapp to retrieve URL and open it in new tab
const { data } = await axiosinstance().get('/mail/getauthorization');
if (data) {
  console.log(data);
  window.open(data, '_blank').focus();
}

// API action to invoke the getAuthorization method
// The RedirectURI should be an API route to process the response

// Pass relevant Scope using the format "ZohoMail.messages.READ,ZohoMail.partner.organization.UPDATE", separated by commas. Pass "ALL" to generate code with full authorization

// The full list of scopes and operation is shown below
//     { "Name": "accounts", "Operations": ["READ", "UPDATE"] },
// { "Name": "partner.organization", "Operations": ["READ", "UPDATE"] },
// { "Name": "organization.subscriptions", "Operations": ["READ", "UPDATE"] },
// { "Name": "organization.spam", "Operations": ["READ"] },
// {
//   "Name": "organization.accounts",
//   "Operations": ["READ", "CREATE", "UPDATE"]
// },
// {
//   "Name": "organization.domains",
//   "Operations": ["READ", "UPDATE", "CREATE", "DELETE"]
// },
// {
//   "Name": "organization.groups",
//   "Operations": ["READ", "UPDATE", "CREATE", "DELETE"]
// },
// {
//   "Name": "messages",
//   "Operations": ["READ", "UPDATE", "CREATE", "DELETE"]
// },
// {
//   "Name": "attachments",
//   "Operations": ["READ", "UPDATE", "CREATE", "DELETE"]
// },
// { "Name": "tags", "Operations": ["READ", "UPDATE", "CREATE", "DELETE"] },
// { "Name": "folders", "Operations": ["READ", "UPDATE", "CREATE", "DELETE"] },
// { "Name": "tasks", "Operations": ["READ", "UPDATE", "CREATE", "DELETE"] },
// { "Name": "notes", "Operations": ["READ", "UPDATE", "CREATE", "DELETE"] },
// { "Name": "links", "Operations": ["READ", "UPDATE", "CREATE", "DELETE"] }

// AccessType "online" generates a code that only grants authorization for one hour. Use "offline" to gain perpetual authorization

const auth = await zcrm.getAuthorization({
  Scope: 'ALL',
  ClientId: '<ClientId>',
  AccessType: 'online' || 'offline',
  RedirectURI: '<API route to process response>',
});
return res.ok(auth);
// The response is in this format
// {
//   state: '1639335760814',
//   code: '1000.935715ecc54a6e87d40cd3569564598e.a20dd53493c2bf203c74a2d04bd11844',
//   location: 'us',
//   'accounts-server': 'https://accounts.zoho.com'
// }
// Use to get Refresh Token within a minute

// The redirect endpoint should call getAccesstoken immediately on receiving the authorization code
```

3. Click Accept on the authorization page. it will redirect to the URL you provided. The redirect will contain the parameters shown in the snippet

### NOTE: The code is only valid for about 60s. You must generate a refresh token/access token before it expires

4. Use the returned code to generate an access token by calling the getAccessToken method

```js
// sample getAccessToken call

const auth = await zcrm.getAccessToken({
  ClientId: 'client_id',
  ClientSecret: 'client_secret',
  GrantToken: 'code_recived_from_getAuthorization',
  RedirectURI: 'routte_to_receive_accesss_token',
});
// refresh_token will only be returned if the authorization request AccessType was offline
// {
//   access_token: '1000.de04e2f50989fcc7b0f7b69151ae2782.6bca4edd5c947874cb9d098ca047991a',
//   refresh_token: '1000.58e2855d8684c9842b3aa0bc689c3ac3.b822f29126e9f8ce7ff6aafabb69f4bd',
//   api_domain: 'https://www.zohoapis.com',
//   token_type: 'Bearer',
//   expires_in: 3600
// }

// use the access token to authorize API calls such as sending or retreiving Email
```

5. Renew access_token if expired using the refresh_token

```js
const auth = await zcrm.renewAccessToken({
  ClientId: 'client_id',
  ClientSecret: 'client_secret',
  RefreshToken: 'refresh_token',
});
// {
//   access_token: '1000.1f0620bb1bded73140275794dedd89c4.950661463ae4725423202321ab76b6d0',
//   api_domain: 'https://www.zohoapis.com',
//   token_type: 'Bearer',
//   expires_in: 3600
// }
```

## Sending Mail

Emails will by default be sent from the Authenticated Account. To configure other fromAdresses

1. Log in to Zoho Mail with the admin account
2. Go to settings and select "Add New Address" under "Send Mail As"
3. Configure the new from address and save

Call getOrganization retrieve Organization Details

```js
const org = await zcrm.getOrganization({
  AccessToken,
});
const { data } = org;
const OrgId = `${data.zoid}`;
```

Call getOrgAccounts retrieve Organization Users

```js
const org = await zcrm.getOrgAccounts({ AccessToken, OrgId });
const { data } = org;
const AdminIndex = data.findIndex(
  ({ incomingUserName }) => incsmingUsername === 'admin_email'
);
const AccountId = `${data[AdminIndex].accountId}`;
```

Call sendMail, passing the parameters as shown below to send email.
The content can be plain string or stringified html

```js
await sendEmail({ AccessToken:'access_token', AccountId:'account_id',
        options: {
          {
   "fromAddress": "my@mydomain.com",
   "toAddress": "family@mydomain.com",
   "ccAddress": "colleagues@mywork.com",
   "bccAddress": "restadmin1@restapi.com",
   "subject": "Email - Always and Forever",
   "content": "Email can never be dead. The most neutral and effective way, that can be used for one to many and two way communication.",
   "askReceipt" : "yes",
   "action":"reply"
}
        },
      });

```
