import React from 'react';
import $ from "jquery";


class Login extends React.Component {
    constructor(props) {
        super();
        this.state = {
          loggedIn: false,
          error: null
        };
      }

    handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/login`, {
          mode: 'no-cors',
        })
          .then(response => console.log(response))
          .then(
            () => {
              this.setState({
                loggedIn: true
              });
            },
            (error) => {
              console.log(error);
              this.setState({
                loggedIn: false,
                error
              });
            }
          )
      }

    componentDidMount() {
            /**
             * Obtains parameters from the hash of the URL
             * @return Object
             */
            function getHashParams() {
              var hashParams = {};
              var e, r = /([^&;=]+)=?([^&;]*)/g,
                  q = window.location.hash.substring(1);
              while ( e = r.exec(q)) {
                 hashParams[e[1]] = decodeURIComponent(e[2]);
              }
              return hashParams;
            }
    
            // var userProfileSource = document.getElementById('user-profile-template').innerHTML;

                // userProfileTemplate = Handlebars.compile(userProfileSource),
                // userProfilePlaceholder = document.getElementById('user-profile');
    
            // var oauthSource = document.getElementById('oauth-template').innerHTML;

                // oauthTemplate = Handlebars.compile(oauthSource),
                // oauthPlaceholder = document.getElementById('oauth');
    
            var params = getHashParams();
    
            var access_token = params.access_token,
                refresh_token = params.refresh_token,
                error = params.error;

    
            if (error) {
              alert('There was an error during the authentication');
              
            } else {
              if (access_token) {
                // render oauth info
                // oauthPlaceholder.innerHTML = oauthTemplate({
                //   access_token: access_token,
                //   refresh_token: refresh_token
                // });
    
                $.ajax({
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                      'Authorization': 'Bearer ' + access_token
                    },
                    success: function(response) {
                    //   userProfilePlaceholder.innerHTML = userProfileTemplate(response);
                      console.log(response)
    
                      $('#login').hide();
                      $('#loggedin').show();
                    }
                });
              } else {
                  // render initial screen
                  $('#login').show();
                  $('#loggedin').hide();
              }
    
              document.getElementById('obtain-new-token').addEventListener('click', function() {
                $.ajax({
                  url: '/refresh_token',
                  data: {
                    'refresh_token': refresh_token
                  }
                }).done(function(data) {
                  access_token = data.access_token;
                //   oauthPlaceholder.innerHTML = oauthTemplate({
                //     access_token: access_token,
                //     refresh_token: refresh_token
                //   });
                });
              }, false);
            }
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
