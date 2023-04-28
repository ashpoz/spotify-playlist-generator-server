const querystring = require("querystring");
const stateKey = "spotify_auth_state";
const {
  devMode,
  clientId,
  redirectUri
} = require("./utils/authConfig");

// app auths
const scopes = "user-read-private user-read-email playlist-modify-public playlist-modify-private";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

exports.handler = async function (event, context) {
  const state = generateRandomString(16);
  const cookieString = devMode ? "" : "; Secure; HttpOnly";
  const stateCookie = `${stateKey}=${state}${cookieString}`;

  // your application requests authorization
  const authURI = "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scopes,
      redirect_uri: redirectUri,
      state: state
    });

  // Redirect user to authorizationURI
  return {
    statusCode: 302, // must be a redirect status code or the client won't be redirected
    headers: {
      Location: authURI,
      "Set-Cookie": stateCookie, // sets a cookie @ (key, value)
      "Cache-Control": "no-cache", // Disable caching of this response
    },
  };
};