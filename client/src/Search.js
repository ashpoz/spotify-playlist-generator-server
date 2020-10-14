import React from 'react';
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', autocomplete: [], artists: [], formSuccess: false, genres: '', albums: [] };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
    this.setState({ autocomplete: this.autocomplete(e.target.value) });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ formSuccess: true })
    this.getRecs(this.state.value);
  }

  getRecs(value) {
    spotifyApi.getRecommendations({
      seed_genres: value
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
      console.log(this.state.albums);
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

  // searchGenres(value) {
  //   spotifyApi.search(`genre:${value}`, ["artist"])
  //     .then((response) => {
  //       const maxArtists = 10;
  //       // sort by popularity
  //       const sortedArtists = response.artists.items.sort((a, b) => b.popularity - a.popularity);
  //       // grab ids
  //       const artistsIds = sortedArtists.map(val => val.id);
  //       // artist names
  //       // const artistsNames = sortedArtists.map(val => val.name);

  //       // console.log(artistsNames);

  //       this.setState({
  //         artists: sortedArtists.slice(0, maxArtists),
  //         artistsIds: artistsIds.slice(0, maxArtists),
  //       });
  //     })
  //     .then(() => {
  //       this.searchAlbums(this.state.artistsIds)
  //     })
  // }

  // searchAlbums(arr) {
  //   const maxAlbums = 2;
  //   let artistAlbums = {};

  //   arr.forEach((el, index) => {
  //     let albumsIds;
  //     spotifyApi.getArtistAlbums(el, {
  //       include_groups: "album",
  //       limit: 50
  //     })
  //       .then((response) => {
  //         // grab album ids
  //         albumsIds = response.items.map(val => val.id);
  //         // console.log(albumsIds);
  //         // artistObj[index] = albumsIds;
  //         // console.log(Math.floor(albumsIds.length / 3));
  //         // console.log(albumsIds.length % 3);
  //       })
  //       .then(() => {
  //         if (albumsIds.length > 20) {
  //           let i, j, tempArr, chunk = 20;
  //           for (i = 0, j = albumsIds.length; i < j; i += chunk) {
  //             tempArr = albumsIds.slice(i, i + chunk);
  //             spotifyApi.getAlbums(tempArr)
  //               .then((response) => {
  //                 const sortedAlbums = response.albums.sort((a, b) => b.popularity - a.popularity);
  //                 this.setState({
  //                   artistAlbums: this.state.artistAlbums.concat(sortedAlbums.slice(0, maxAlbums))
  //                 })
  //                 // this.setState(prevState => ({
  //                 //   artistAlbums: {
  //                 //     ...prevState.artistAlbums,
  //                 //     items: sortedAlbums.slice(0, maxAlbums),
  //                 //   }
  //                 // }));
  //               })
  //           }
  //         } else {
  //           spotifyApi.getAlbums(albumsIds)
  //             .then((response) => {
  //               const sortedAlbums = response.albums.sort((a, b) => b.popularity - a.popularity);
  //               // console.log(sortedAlbums);
  //               this.setState({
  //                 artistAlbums: this.state.artistAlbums.concat(sortedAlbums.slice(0, maxAlbums))
  //               })
  //             })
  //         }
  //       })
  //   })
  // }

  // showAlbums(arr) {
  //   arr.forEach((el, index) => {
  //     console.log(el);
  //     return (
  //       <li key={index}>
  //         <img className="img-thumbnail" src={el.images[0].url} alt=""/>
  //         <p>{el.name}</p>
  //       </li>
  //     )
  //   })
  // }
  // autocomplete(value) {
  //   const matches = genres.filter((item) => {
  //       return (item.genre.toLowerCase().includes(value.toLowerCase())) && item.genre;
  //   }) 
  //   return matches;
  // }

  componentDidMount() {
    this.getGenres();
  }

  render() {
    return (
      <div className="container pt-5">
        <div className="row">
          <div className="col-12">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="searchQuery">Searh genres:</label>
                <input type="text" className="form-control" id="searchQuery" aria-describedby="searchQuery" placeholder="Search..." value={this.state.value} onChange={this.handleChange} />
                {(this.state.autocomplete.length > 0) &&
                  <div className="autocomplete pt-4">
                    <h3>Suggestions</h3>
                    <ul>
                      {this.state.autocomplete.map((val, index) => {
                        return <li key={index}>{val}</li>
                      })}
                    </ul>
                  </div>
                }
              </div>
              <button className="btn btn-primary" type="submit">Search genres</button>
            </form>
          </div>
        </div>
        <div className="results row pt-4">
          {(this.state.formSuccess) &&
          <>
              <div className="col-12">
                <h3>Albums</h3>
              </div>
              {this.state.albums.map((val, index) => {
                return (
                  <a href={val.external_urls.spotify} className="col-md-4 pb-2" key={index} target="_blank" rel="noopener noreferrer">
                    <img className="img-thumbnail" src={val.images[0].url} alt="" />
                  <p className="lead mb-0 pt-1"><strong>{val.name}</strong></p>
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
