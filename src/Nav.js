import React from 'react';

import "./scss/components/nav.scss";

import githubLogo from "./images/github-logo-white.png";

function Nav() {
    return (
        <nav className="navbar navbar-dark">
            <a className="navbar-brand" href="/">Spotify Playlist Generator</a>
            <a className="mr-sm-2" href="https://github.com/ashpoz" target="_blank" rel="noopener noreferrer">
                <img className="social-icon" src={githubLogo} alt="Github Logo" />
            </a>
        </nav>
    )
}

export default Nav;