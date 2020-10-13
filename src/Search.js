import React from 'react';
import SpotifyWebApi from "spotify-web-api-js";
import { genres } from "./data/genres";


const spotifyApi = new SpotifyWebApi();



class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', autocomplete: [], artists: [], formSuccess: false, artistsIds: [], albumsIds: [], artistAlbums: [] };
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
    this.setState({ artistAlbums: [] })

    this.searchGenres(this.state.value);
  }

  searchGenres(value) {
    spotifyApi.search(`genre:${value}`, ["artist"])
      .then((response) => {
        const maxArtists = 10;
        // sort by popularity
        const sortedArtists = response.artists.items.sort((a, b) => b.popularity - a.popularity);
        // grab ids
        const artistsIds = sortedArtists.map(val => val.id);
        // artist names
        // const artistsNames = sortedArtists.map(val => val.name);

        // console.log(artistsNames);

        this.setState({
          artists: sortedArtists.slice(0, maxArtists),
          artistsIds: artistsIds.slice(0, maxArtists),
        });
      })
      .then(() => {
        this.searchAlbums(this.state.artistsIds)
      })
  }

  getAlbum(arr) {
    // console.log(arr);
    // spotifyApi.getAlbums(arr)
    // .then((response) => {
    //   console.log(response.name);
    // })
  }

  searchAlbums(arr) {
    const maxAlbums = 2;
    let artistAlbums = {};

    arr.forEach((el, index) => {
      let albumsIds;
      spotifyApi.getArtistAlbums(el, {
        include_groups: "album",
        limit: 50
      })
        .then((response) => {
          // grab album ids
          albumsIds = response.items.map(val => val.id);
          // console.log(albumsIds);
          // artistObj[index] = albumsIds;
          // console.log(Math.floor(albumsIds.length / 3));
          // console.log(albumsIds.length % 3);
        })
        .then(() => {
          if (albumsIds.length > 20) {
            let i, j, tempArr, chunk = 20;
            for (i = 0, j = albumsIds.length; i < j; i += chunk) {
              tempArr = albumsIds.slice(i, i + chunk);
              spotifyApi.getAlbums(tempArr)
                .then((response) => {
                  const sortedAlbums = response.albums.sort((a, b) => b.popularity - a.popularity);
                  this.setState({
                    artistAlbums: this.state.artistAlbums.concat(sortedAlbums.slice(0, maxAlbums))
                  })
                  // this.setState(prevState => ({
                  //   artistAlbums: {
                  //     ...prevState.artistAlbums,
                  //     items: sortedAlbums.slice(0, maxAlbums),
                  //   }
                  // }));
                })
            }
          } else {
            spotifyApi.getAlbums(albumsIds)
              .then((response) => {
                const sortedAlbums = response.albums.sort((a, b) => b.popularity - a.popularity);
                // console.log(sortedAlbums);
                this.setState({
                  artistAlbums: this.state.artistAlbums.concat(sortedAlbums.slice(0, maxAlbums))
                })
              })
          }
        })
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

  // componentDidMount() {
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
              </div>
              <button className="btn btn-primary" type="submit">Search genres</button>
            </form>
          </div>
        </div>
        <div className="results row">
          {(this.state.formSuccess) &&
          <>
              {/* <h3>Artists</h3>
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
                  </ul> */}
              <div className="col-12">
                <h3>Albums</h3>
              </div>
              {this.state.artistAlbums.map((val, index) => {
                return (
                  <div className="col-md-4" key={index}>
                    <img className="img-thumbnail" src={val.images[0].url} alt="" />
                    <p>{val.name}</p>
                    <p>popularity: {val.popularity}</p>
                  </div>
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
