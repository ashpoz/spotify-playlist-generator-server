import React from 'react';
import SpotifyWebApi from "spotify-web-api-js";

import "./scss/components/search.scss";

const spotifyApi = new SpotifyWebApi();

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', autocomplete: [], artists: [], formSuccess: false, genres: [], albums: [], maxResults: 20, resultsCount: 8 };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectSuggestion = this.selectSuggestion.bind(this);
    this.clearQuery = this.clearQuery.bind(this);
    this.updateNumResults = this.updateNumResults.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
    this.setState({
      autocomplete: (e.target.value) ? this.autocomplete(e.target.value) : ""
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ formSuccess: true })
    this.getRecs(this.state.value);
    this.setState({ autocomplete: [] });
  }

  selectSuggestion(e) {
    this.setState({ formSuccess: true })
    this.setState({ value: e.target.textContent });
    this.setState({ autocomplete: [] });
    this.getRecs(e.target.textContent);
  }

  clearQuery(e) {
    e.preventDefault();
    this.setState({ value: "" });
    this.setState({ autocomplete: [] });
  }

  updateNumResults(e) {
    this.setState({ resultsCount: Number(e.target.value) });
  }

  closeDropdown() {
    document.addEventListener('click', function (e) {
      let isClickInside = document.querySelector(".autocomplete").contains(e.target);

      if (!isClickInside) {
        //the click was outside the specifiedElement, do something
        this.setState({ autocomplete: [] })
      }
    });
  }

  getRecs(value) {
    spotifyApi.getRecommendations({
      seed_genres: value,
      limit: this.state.resultsCount
    })
      .then((response) => {
        const sortTracksByPop = response.tracks.sort((a, b) => b.popularity - a.popularity);
        const albums = sortTracksByPop.map(val => {
          return val.album;
        })
        return albums;
      })
      .then((albums) => {
        this.setState({ albums: albums })
      })
  }

  getGenres() {
    spotifyApi.getAvailableGenreSeeds()
      .then((response) => {
        const genres = response.genres;
        this.setState({ genres: genres })
      })
  }

  autocomplete(value) {
    let counter = 0;
    let matches = [];
    this.state.genres.forEach(el => {
      if (el.toLowerCase().includes(value.toLowerCase()) && counter <= 10) {
        counter++;
        matches.push(el);
      }
    })
    return matches;
  }

  componentDidMount() {
    this.getGenres();
    // this.closeDropdown();
  }

  render() {
    return (
      <div className="Search container ptop-4 pbot-4">
        <div className="row">
          <div className="col-12">
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form-row form-group">
                <div className="search-input col-10 col-sm-8 col-md-9 w-100">
                  <input type="text" className="form-control" id="searchQuery" aria-describedby="searchQuery" placeholder="Type in genre" value={this.state.value} onChange={this.handleChange} autocomplete="off" />
                  {(this.state.value) &&
                    <button className="search-input__button" onClick={this.clearQuery} type="button">&#10005;</button>
                  }
                  {(this.state.autocomplete.length > 0) &&
                    <div className="autocomplete">
                      <div className="col">
                        <ul>
                          {this.state.autocomplete.map((val, index) => {
                            return (
                              <li key={index}>
                                <button onClick={this.selectSuggestion} type="button">{val}</button>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  }
                </div>
                <div className="select-input col-2 col-sm-2 col-md-1">
                  <select className="form-control" name="albumsNum" id="albumsNum" onChange={this.updateNumResults} value={this.state.resultsCount}>
                    {[...Array(this.state.maxResults)].map((e, index) => <option key={index} value={index + 1}>{index + 1}</option>)
                    }
                  </select>
                </div>
                <div className="col-12 col-sm-2">
                  <button className="btn btn-primary w-100" type="submit">Search</button>
                </div>
              </div>

            </form>
          </div>
        </div>
        <div className="results row ptop-3">
          {(this.state.formSuccess) &&
            <>
              {(this.state.albums.length <= 0) &&
              <div className="col-12">
                <p className="lead">Sorry, no matching results. Please try again.</p>
              </div>
              }
              {(this.state.albums.length > 0) &&
              <div className="col-12 pbot-1">
                <h3>Albums</h3>
              </div>
              }
              {this.state.albums.map((val, index) => {
                return (
                  <a href={val.external_urls.spotify} className="results__item col-6 col-sm-4 col-md-3 col-xl-3 pb-2" key={index} target="_blank" rel="noopener noreferrer">
                    <img className="img-thumbnail" src={val.images[0].url} alt="" />
                    <h5>{val.name}</h5>
                    <p>
                      {val.artists.map((artist, index) => {
                        return (index > 0) ? `, ${artist.name}` : artist.name;
                      })}
                    </p>
                  </a>
                )
              })}
            </>
          }
        </div>
      </div>
    );
  }
}

export default Search;
