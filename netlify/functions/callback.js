const axios = require("axios");
const {
  clientId,
  clientSecret,
  redirectUri,
  siteUrl,
} = require("./utils/authConfig");

exports.handler = async function (event, context) {
  const { code, state } = event.queryStringParameters || null;

  // retrieve the auth state set on the cookie
  const storedState = event.headers.cookie
    ? event.headers.cookie.split(";")[0].split("=")[1]
    : null;

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
      const { expires_in, access_token, refresh_token } = await authorizeToken.data;
      const getAccountAuth = {
        method: "GET",
        url: "https://api.spotify.com/v1/me",
        headers: { "Authorization": "Bearer " + access_token },
      };
      await axios(getAccountAuth);

      // TODO, set http cookie instead of passing params
      return {
        statusCode: 302, // must be a redirect status code or the client won't be redirected
        headers: {
          Location: `${siteUrl}?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`,
          "Cache-Control": "no-cache", // Disable caching of this response
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