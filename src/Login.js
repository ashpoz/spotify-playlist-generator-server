import React from 'react';
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();



class Login extends React.Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      artists: { items: [] }
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        console.log(response);
        this.setState({
          nowPlaying: {
            name: response.item.name,
            albumArt: response.item.album.images[0].url
          }
        });
      })
  }

  searchGenres() {
    console.log(spotifyApi);
    spotifyApi.search("genre:Rock", ["artist"])
    .then((response) => {
      console.log(response);
      // this.setState({
      //   artists: {
      //     items: response.items.artists,
      //   }
      // });
    })
  }


  // componentDidMount() {

  // }


  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div id="login">
              <h1>This is an example of the Authorization Code flow</h1>
              <a href="http://localhost:5000/login" className="btn btn-primary">Log in with Spotify</a>
              {this.state.loggedIn &&
                <>
                <button onClick={() => this.getNowPlaying()}>
                  Check Now Playing
                </button>
                <button onClick={() => this.searchGenres()}>Search genres</button>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
