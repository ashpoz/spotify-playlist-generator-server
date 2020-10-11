import React from 'react';
import SpotifyWebApi from "spotify-web-api-js";
import { genres } from "./data/genres";


const spotifyApi = new SpotifyWebApi();



class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: '', autocomplete: [], artists: [], formSuccess: false, artistsIds: []};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value});
        this.setState({autocomplete: this.autocomplete(e.target.value)});
    }
    
    handleSubmit(e) {
        e.preventDefault();
        this.searchGenres(this.state.value);
        this.searchAlbums(this.state.artistsIds);
        this.setState({formSuccess: true})
    }

  searchGenres(value) {
    spotifyApi.search(`genre:${value}`, ["artist"])
    .then((response) => {
      // sort by popularity
      const sortedArtists = response.artists.items.sort((a, b) => b.popularity - a.popularity);
      // grab ids
      const artistsIds = sortedArtists.map(val => val.id);
      this.setState({
        artists: sortedArtists,
        artistsIds: artistsIds
      });
    })
  }

  searchAlbums(arr) {
    console.log(arr);
    const arrURLEncoded = encodeURIComponent(arr.join());
    spotifyApi.getArtistAlbums(`${arrURLEncoded}`)
    .then((response) => {
      console.log(response)
    })
  }

  autocomplete(value) {
      let counter = 0;
      let matches = [];
      genres.forEach(el => {
        if (el.genre.toLowerCase().includes(value.toLowerCase()) && counter <= 10) {
          counter++;
          matches.push(el.genre);
        }
      })
      return matches;
  }

  // autocomplete(value) {
  //   const matches = genres.filter((item) => {
  //       return (item.genre.toLowerCase().includes(value.toLowerCase())) && item.genre;
  //   }) 
  //   return matches;
  // }


  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label htmlFor="searchQuery">Searh genres:</label>
                <input type="text" className="form-control" id="searchQuery" aria-describedby="searchQuery" placeholder="Search..." value={this.state.value} onChange={this.handleChange} />
                {(this.state.autocomplete.length > 0) && 
                <div className="autocomplete">
                <h3>Suggestions</h3>
                <ul>
                  {this.state.autocomplete.map((val, index) => {
                    return <li key={index}>{val}</li>
                  })}
                </ul>
                </div>
                }
                {(this.state.formSuccess) && 
                <div className="results">
                  <h3>Results</h3>
                  <ul>
                    {this.state.artists.map((val, index) => {
                      return(
                        <li key={index}>
                          <img className="img-thumbnail" src={val.images[0].url} alt=""/>
                          <p>{val.name}</p>
                          <p>popularity: {val.popularity}</p>
                        </li>
                      ) 
                    })}
                  </ul>
                </div>
                }
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
