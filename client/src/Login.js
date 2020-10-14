import React from 'react';

class Login extends React.Component {

  async spotifyLogin() {
    let res = await fetch('/login')
    let resText = await res.text()
    console.log(resText);
    window.location.replace(resText);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div id="login">
              <h1>Spotify Albums by Genre</h1>
              <h3>Login to Spotify to continue</h3>
              <button onClick={() => this.spotifyLogin()} className="btn btn-primary">Log in with Spotify</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
