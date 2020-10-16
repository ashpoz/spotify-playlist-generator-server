import React from 'react';

import './scss/components/login.scss';

import spotifyLogo from './images/spotify-logo.png';


class Login extends React.Component {

  async spotifyLogin() {
    let res = await fetch('/login')
    let resText = await res.text()
    console.log(resText);
    window.location.replace(resText);
  }

  render() {
    return (
      <div className="Login container">
        <div className="row">
          <div className="col-12">
            <div>
              <img className="logo pbot-2" src={spotifyLogo} alt="Logo" />
              <h1>Spotify Playlist Generator</h1>
              <p className="lead pbot-1">Login to Spotify to continue</p>
              <button onClick={() => this.spotifyLogin()} className="btn btn-primary">Log In</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
