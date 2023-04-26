import React from "react";

import "./scss/components/login.scss";

import spotifyLogo from "./images/spotify-logo.png";

const Login = () => {
  return (
    <div className="Login container">
      <div className="row">
        <div className="col-12">
          <div>
            <img className="logo pbot-2" src={spotifyLogo} alt="Logo" />
            <h1>Spotify Playlist Generator</h1>
            <p className="lead pbot-1">Login to Spotify to continue</p>
            <a href="/.netlify/functions/login" className="btn btn-primary">Log In</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
