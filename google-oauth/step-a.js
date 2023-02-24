const { google } = require('googleapis');
const { CLIENT_ID, CLIENT_SECRET } = process.env;

const client = new google.auth.OAuth2({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
});

const authorizeUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/drive',
});

console.log('Authorize this app by visiting this url:', authorizeUrl);
