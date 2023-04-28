import React, { useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

import Nav from "./Nav";
import Search from "./Search";
import Login from "./Login";

import "./scss/layout/layout.scss";

const spotifyApi = new SpotifyWebApi();

const App = () => {
  const getCookieValue = (cookieName) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cookieName}=`))
      ?.split("=")[1];
  }
  const accessToken = getCookieValue("spotify_access_token");

  const [loggedIn] = useState(accessToken ? true : false);

  if (loggedIn) {
    spotifyApi.setAccessToken(accessToken);
    return <><Nav /><Search accessToken={accessToken} /></>;
  } else {
    return <Login />;
  }
}

export default App;
