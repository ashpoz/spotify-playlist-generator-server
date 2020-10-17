import React from "react";
import SpotifyWebApi from "spotify-web-api-js";

import "./scss/components/modal.scss";

const spotifyApi = new SpotifyWebApi();

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistName: "My New Playlist",
            playlistDescription: "My new playlist description",
            playlistPrivate: false,
            errors: {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    handleInputChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.handleValidation()) {
            console.log(this.state.playlistName);
            console.log(this.state.playlistDescription);
            console.log(this.state.playlistPrivate);
        } else {
            console.log("There was an error");
        }
    }

    handleValidation() {
        let errors = {};
        let formIsValid = true;

        // Name
        if (!this.state.playlistName) {
            formIsValid = false;
            errors["playlistName"] = "Playlist Name cannot be blank.";
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    closeModal(e) {
        e.stopPropagation()
        this.props.closeModal()
    }

    createPlaylist() {
        spotifyApi.createPlaylist("user", {
            name: this.state.playlistName,
            description: this.state.playlistDescription,
            public: true
        })
          .then((response) => {
            console.log(response);
          })
          .then(() => {
            // this.setState({ albums: albums })
          })
      }

    render() {
        return (
            <div
                className="Modal"
                onClick={this.closeModal}
                style={{ display: (this.props.displayModal) ? "block" : "none" }} >
                <div
                    className="modal-content"
                    onClick={e => e.stopPropagation()} >
                    <span
                        className="close"
                        onClick={this.closeModal}>&times;
                 </span>
                    <h2 className="modal-content__header">Fill out the following fields</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="playlistName">Playlist Name*</label>
                            <input type="text" className="form-control" name="playlistName" id="playlistName" aria-describedby="playlistName" onChange={this.handleInputChange} value={this.state.playlistName} />
                            <span className="error">{this.state.errors["playlistName"]}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="playlistDescription">Description</label>
                            <textarea className="form-control" name="playlistDescription" id="playlistDescription" onChange={this.handleInputChange} value={this.state.playlistDescription} />
                        </div>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" name="playlistPrivate" id="playlistPrivate" checked={this.state.playlistPrivate} onChange={this.handleInputChange} />
                            <label className="form-check-label" htmlFor="playlistPrivate">Private</label>
                            <br />
                            <small>Check this box if you'd like your playlist to be private.</small>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Modal;
