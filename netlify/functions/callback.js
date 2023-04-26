const axios = require("axios");
const cookie = require('cookie')

const {
  clientId,
  clientSecret,
  redirectUri,
  siteUrl,
} = require("./utils/authConfig");

exports.handler = async function (event, context) {
  const { code, state } = event.queryStringParameters || null;

  // retrieve the auth state set on the cookie
  const cookies = cookie.parse(event.headers.cookie);
  const storedState = cookies.spotify_auth_state;

  if (state === null || state !== storedState) {
    return {
      statusCode: 302, // must be a redirect status code or the client won't be redirected
      headers: {
        Location: `${siteUrl}/#/error/state%20mismatch`,
        "Cache-Control": "no-cache", // Disable caching of this response
      },
    };
  } else {
    const authOptions = {
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      params: {
        code: code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      },
      headers: {
        "Authorization": "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64")
      },
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    };

    try {
      const authorizeToken = await axios(authOptions);
      const { expires_in, access_token } = await authorizeToken.data;
      const getAccountAuth = {
        method: "GET",
        url: "https://api.spotify.com/v1/me",
        headers: { "Authorization": "Bearer " + access_token },
      };

      await axios(getAccountAuth);

      return {
        statusCode: 302, // must be a redirect status code or the client won't be redirected
        headers: {
          Location: siteUrl,
          "Cache-Control": "no-cache", // Disable caching of this response
          "Set-Cookie": [
            cookie.serialize("spotify_access_token", access_token, {
              // httpOnly: true,
              maxAge: expires_in,
              path: "/",
            }),
          ]
        },
      }
    } catch (err) {
      console.log(err);
      return {
        statusCode: 302, // must be a redirect status code or the client won't be redirected
        headers: {
          Location: `${siteUrl}/#/error/invalid%20token`,
          "Cache-Control": "no-cache", // Disable caching of this response
        },
      }
    }
  }
};