import React, { useState } from "react";

import SpotifyWebApi from "spotify-web-api-js";

import "./scss/components/modal.scss";

const spotifyApi = new SpotifyWebApi();

const PlaylistModal = (props) => {
  const [formData, setFormData] = useState(
    {
      id: "",
      name: "My New Playlist",
      description: "My new playlist description",
      private: false,
      link: "",
      tracks: []
    }
  );
  const [playlistName, setPlaylistName] = useState("My New Playlist");
  const [playlistDescription, setPlaylistDescription] = useState("My new playlist description");
  const [playlistPrivate, setPlaylistPrivate] = useState(false);
  const [playlistID, setPlaylistID] = useState("");
  const [playlistLink, setPlaylistLink] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [formSuccess, setFormSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(false);

  const closeModal = (e) => {
    e.stopPropagation();
    props.closeModal();
    setFormSuccess(false);
  }

  const splitArr = (arr, length) => {
    let tempArr = [];
    for (let i = 0; i < arr.length; i += length) {
      tempArr.push(arr.slice(i, i + length));
    }
    return tempArr;
  }

  const getValues = (obj) => {
    let str = "";
    for (const value of Object.values(obj)) {
      str += value;
    }
    return str.split(",");
  }

  const postItemsToPlaylist = (id, token, items) => {
    fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
      },
      body: JSON.stringify(items),
    })
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const addItemsToPlaylist = (playlistID, tracksObj) => {
    console.log(tracksObj);
    let tracksArr = [];
    for (var key of Object.keys(tracksObj)) {
      tracksArr.push(...tracksObj[key]);
    }

    if (tracksArr.length > 100) {
      const trackChunks = splitArr(tracksArr, 100);
      trackChunks.forEach(tracks => {
        postItemsToPlaylist(playlistID, props.accessToken, tracks);
      })
    } else {
      postItemsToPlaylist(playlistID, props.accessToken, tracksArr);
    }
  }

  const createPlaylist = () => {
    spotifyApi.createPlaylist(props.userID, {
      name: formData.name,
      description: formData.description,
      public: !formData.private
    })
      .then((response) => {
        setFormData(prevData => ({
          ...prevData, link: response.external_urls.spotify
        }));
        addItemsToPlaylist(response.id, props.albumTracks);
      })
  }

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    // Name
    if (!formData.name) {
      formIsValid = false;
      errors.name = "Playlist Name cannot be blank.";
    }

    setErrors(errors);
    return formIsValid;
  }

  const handleInputChange = (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      setFormSuccess(true);
      createPlaylist();
    } else {
      console.log("There was an error");
    }
  }

  let content;

  if (formSuccess) {
    content = (
      <div style={{ textAlign: "center" }}>
        <h4 className="pbot-2">Your playlist is ready!</h4>
        <a className="btn btn-primary" href={formData.link} target="_blank" rel="noopener noreferrer">See Playlist</a>
      </div>
    )
  } else {
    content = (
      <form className="Form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="playlistName">Playlist Name*</label>
          <input type="text" className="form-control" name="name" id="playlistName" aria-describedby="playlistName" onChange={handleInputChange} value={formData.name} />
          <span className="error">{errors.name}</span>
        </div>
        <div className="form-group">
          <label htmlFor="playlistDescription">Description</label>
          <textarea className="form-control" name="description" id="playlistDescription" onChange={handleInputChange} value={formData.description} />
        </div>
        <div className="form-group form-check">
          <input type="checkbox" className="form-check-input" name="private" id="playlistPrivate" checked={formData.private} onChange={handleInputChange} />
          <label className="form-check-label" htmlFor="playlistPrivate">Private</label>
          <br />
          <small>Check this box if you'd like your playlist to be private.</small>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    )
  }
  return (
    <div
      className="PlaylistModal modal"
      onClick={closeModal}
      style={{ display: (props.displayModal) ? "block" : "none" }} >
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()} >
        <span
          className="close"
          onClick={closeModal}>&times;
        </span>
        <h2 className="modal-content__header">Fill out the following fields</h2>
        {content}
      </div>
    </div>
  );
}

export default PlaylistModal;