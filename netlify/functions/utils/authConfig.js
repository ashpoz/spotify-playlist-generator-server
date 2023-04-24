require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const siteUrl = process.env.APP_URL;
const env = process.env.NETLIFY_DEV ? "development" : "production";
const devMode = env === "development";
const spotifyURL = "https://accounts.spotify.com";
const clientId = `${process.env.CLIENT_ID}`;
const clientSecret = `${process.env.CLIENT_SECRET}`;
const redirectUri = `${siteUrl}/.netlify/functions/callback`;

module.exports = {
  clientId,
  clientSecret,
  redirectUri,
  devMode,
  spotifyURL,
  siteUrl
}

