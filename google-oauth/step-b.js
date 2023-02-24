const { google } = require('googleapis');
const { CLIENT_ID, CLIENT_SECRET, CODE } = process.env;

const client = new google.auth.OAuth2({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
});

async function getRefreshToken() {
    const { tokens } = await client.getToken(CODE);

    console.log('Refresh token:', tokens.refresh_token);
}

getRefreshToken();
