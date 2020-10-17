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
            playlistID: "",
            playlistLink: "",
            formSuccess: false,
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
            this.createPlaylist();
            this.setState({ formSuccess: true })

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
        e.stopPropagation();
        this.props.closeModal();
        this.setState({ formSuccess: false })
    }

    createPlaylist() {
        spotifyApi.createPlaylist(this.props.userID, {
            name: this.state.playlistName,
            description: this.state.playlistDescription,
            public: true
        })
            .then((response) => {
                this.setState({ playlistID: response.id })
                this.setState({ playlistLink: response.external_urls.spotify })

            })
            .then(() => {
                this.addItemsToPlaylist(this.state.playlistID, this.props.albumTracks);
            })
    }

    getValues(obj) {
        let str = "";
        for (const value of Object.values(obj)) {
            str += value;
        }
        return str.split(",");
    }

    addItemsToPlaylist(playlistID, tracksObj) {
        for (var key of Object.keys(tracksObj)) {

            const data = { uris: tracksObj[key] };

            fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + this.props.accessToken.access_token,
                    "Accept": "application/json"
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error)
                });
        }
    }


    componentDidUpdate() {
    }

    render() {
        let content;
        if (this.state.formSuccess) {
            content = (
                <div style={{ textAlign: "center" }}>
                    <h4 className="pbot-2">Your playlist is ready!</h4>
                    <a className="btn btn-primary" href={this.state.playlistLink} target="_blank" rel="noopener noreferrer">See Playlist</a>
                </div>
            )
        } else {
            content = (
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
            )
        }
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
                    {content}
                </div>
            </div>
        );
    }
}

export default Modal;
