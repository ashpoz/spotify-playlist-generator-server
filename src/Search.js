import React from 'react';
import SpotifyWebApi from "spotify-web-api-js";
import { genres } from "./data/genres";


const spotifyApi = new SpotifyWebApi();



class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value});
        let val = this.autocomplete(e.target.value);
        console.log(val);
      }
    
    handleSubmit(e) {
        e.preventDefault();
        this.searchGenres(this.state.value);
    }

  searchGenres(value) {
    spotifyApi.search(`genre:${value}`, ["artist"])
    .then((response) => {
      this.setState({
        artists: {
          items: response.artists.items,
        }
      });
    })
  }

  autocomplete(value) {
    genres.filter((item) => {
        return item.toLowerCase().includes(value.toLowerCase())
    }) 
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label htmlFor="searchQuery">Searh genres:</label>
                <input type="text" className="form-control" id="searchQuery" aria-describedby="searchQuery" placeholder="Search..." value={this.state.value} onChange={this.handleChange} />
            </div>
            <button className="btn btn-primary" type="submit">Search genres</button>            
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
