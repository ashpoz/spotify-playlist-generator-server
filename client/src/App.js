import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import SpotifyWebApi from "spotify-web-api-js";
import Search from "./Search";

import Login from './Login';

import './App.css';

const spotifyApi = new SpotifyWebApi();


class App extends React.Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
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
  spotifyLogin() {
    fetch("http://localhost:5000/login", {
      mode: "no-cors"
    })
      .then(response => {
        console.log(response);
      })
  }

  render() {
    let renderComponent;

    if (this.state.loggedIn) {
      renderComponent = <Search />;
    } else {
      renderComponent = <Login />;
    }
    return (
      <div className="App">
        {renderComponent}
      </div>
    );
  }
}

export default App;
