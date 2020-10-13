import React from 'react';

class Login extends React.Component {

  spotifyLogin() {
    fetch("http://localhost:5000/login", {
      mode: "no-cors"
    })
      .then(response => {
        console.log(response);
      })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div id="login">
              <h1>Spotify Albums by Genre</h1>
              <h3>Login to Spotify to continue</h3>
              <a onClick={() => this.spotifyLogin()} href="http://localhost:5000/login" className="btn btn-primary">Log in with Spotify</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
