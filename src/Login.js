import React, { Component } from 'react';

class Login extends Component {

    handleSubmit(e) {
        e.preventDefault();
        fetch(`/login`)
          .then(response => console.log(response))
      }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div id="login">
                            <h1>This is an example of the Authorization Code flow</h1>
                            <a onClick={this.handleSubmit} href="/login" className="btn btn-primary">Log in with Spotify</a>
                        </div>
                    </div>
                </div>
            <div id="loggedin">
                <div id="user-profile">
                </div>
                <div id="oauth">
                </div>
                <button className="btn btn-default" id="obtain-new-token">Obtain new token using the refresh token</button>
            </div>
            </div>
          );
    }
}

export default Login;
