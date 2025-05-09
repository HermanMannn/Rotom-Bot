const express = require('express');
const { google } = require('googleapis');
const app = express();
const YOUR_CLIENT_ID = ///
const YOUR_CLIENT_SECRET = ///
const YOUR_REDIRECT_URL = ///



const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URL
);


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];


app.get('/auth', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Required to get a refresh token
    scope: SCOPES,
    prompt: 'consent',
  });
  res.redirect(url);
});


app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send('Authorization code not found.');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);

    
    res.send('Authentication successful! You can close this tab.');
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.send('Error during authentication.');
  }
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Visit http://localhost:3000/auth to start the authentication flow.');
});
