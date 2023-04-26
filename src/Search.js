import React, { useState } from 'react';
import SpotifyWebApi from "spotify-web-api-js";
import PlaylistModal from './PlaylistModal'

import "./scss/components/search.scss";

const spotifyApi = new SpotifyWebApi();

const Search = (props) => {
  const [value, setValue] = useState("");
  const [autocomplete, setAutocomplete] = useState([]);
  const [artists, setArtists] = useState([]);
  const [formSuccess, setFormSuccess] = useState(false);
  const [genres, setGenres] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [albumIds] = useState([]);
  const [maxResults, setMaxResults] = useState(20);
  const [resultsCount, setResultsCount] = useState(5);
  const [modal, setModal] = useState(false);
  const [userID, setUserID] = useState("");
  const [albumTracks, setAlbumTracks] = useState({});


  const getRecs = (value) => {
    spotifyApi.getRecommendations({
      seed_genres: value,
      limit: resultsCount
    })
      .then((response) => {
        const sortTracksByPop = response.tracks.sort((a, b) => b.popularity - a.popularity);
        const albums = sortTracksByPop.map(val => {
          return val.album;
        })
        return albums;
      })
      .then((albums) => {
        const albumIds = albums.map(album => album.id);
        setAlbums(albums);
        setAlbumTracks(albumIds);
      })
  }

  const handleChange = (e) => {
    setValue(e.target.value);
    setAutocomplete((e.target.value) ? setAutocomplete(e.target.value) : "");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSuccess(true);
    getRecs(value);
    setAutocomplete([]);
    setAlbumTracks({});
  }

  const selectSuggestion = (e) => {
    setFormSuccess(true);
    setValue(e.target.textContent);
    setAutocomplete([]);
    getRecs(e.target.textContent);
  }

  const clearQuery = (e) => {
    e.preventDefault();
    setValue("");
    setAutocomplete([]);
  }

  const updateNumResults = (e) => {
    setResultsCount(Number(e.target.value));
  }

  const selectModal = (info) => setModal(!modal);

  const createPlaylist = (e) => {
    console.log(e.target);
  }

  const getGenres = () => {
    spotifyApi.getAvailableGenreSeeds()
      .then((response) => {
        const genres = response.genres;
        setGenres(genres);
      })
  }

  const getUserID = () => {
    spotifyApi.getMe()
      .then((user) => {
        setUserID(user.id);
      })
  }

  const getAlbumTracks = (albumArr) => {
    albumArr.forEach(id => {
      spotifyApi.getAlbumTracks(id)
        .then((response) => {
          const trackURIs = response.items.map(track => track.uri);
          setAlbumTracks({ [id]: trackURIs });
        })
    })
  }

  const autocompleteMatches = (value) => {
    let counter = 0;
    let matches = [];
    genres.forEach(el => {
      if (el.toLowerCase().includes(value.toLowerCase()) && counter <= 10) {
        counter++;
        matches.push(el);
      }
    })
    return matches;
  }

  return (
    <div className="Search container ptop-4 pbot-4">
      <div className="row">
        <div className="col-12">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row form-group">
              <div className="search-input col-10 col-sm-8 col-md-9 w-100">
                <input type="text" className="form-control" id="searchQuery" aria-describedby="searchQuery" placeholder="Type in genre" value={value} onChange={handleChange} autoComplete="off" />
                {/* <small class="text-muted">Can't decide? Choose random genre for me! <a href="#" className="green-text">Go!</a></small> */}
                {(value) &&
                  <button className="search-input__button" onClick={clearQuery} type="button">&#10005;</button>
                }
                {(autocompleteMatches(value).length > 0) &&
                  <div className="autocomplete">
                    <div className="col">
                      <ul>
                        {autocompleteMatches(value).map((val, index) => {
                          return (
                            <li key={index}>
                              <button onClick={selectSuggestion} type="button">{val}</button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                }
              </div>
              <div className="select-input col-2 col-sm-2 col-md-1">
                <select className="form-control" name="albumsNum" id="albumsNum" onChange={updateNumResults} value={resultsCount}>
                  {[...Array(maxResults + 1)].map((val, index) => {
                    return (index % 5 === 0 && index !== 0) ? <option key={index} value={index}>{index}</option> : "";
                  })}
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
        {(formSuccess) &&
          <>
            {(albums.length <= 0) &&
              <div className="col-12">
                <p className="lead">Sorry, no matching results. Please try again.</p>
              </div>
            }
            {(albums.length > 0) &&
              <div className="col-12 pbot-3">
                <div style={{ textAlign: "center" }}>
                  <button className="btn btn-primary" onClick={selectModal}>Add to Playlist +</button>
                  <PlaylistModal
                    displayModal={modal}
                    closeModal={selectModal}
                    accessToken={props.accessToken}
                    albumTracks={albumTracks}
                    userID={userID} >
                  </PlaylistModal>
                </div>
              </div>
            }
            {albums.map((val, index) => {
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

export default Search;
