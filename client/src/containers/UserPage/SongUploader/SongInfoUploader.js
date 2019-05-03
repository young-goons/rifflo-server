import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

import styles from './SongUploader.module.css';

class SongInfoUploader extends Component {
    state = {
        track: '',
        artist: '',
        album: '',
        year: '',
        youtubeUrl: '',
        soundCloudUrl: '',
        bandCampUrl: ''
    };

    trackInputHandler = (event) => {
        this.setState({
            track: event.target.value
        });
    };

    artistInputHandler = (event) => {
        this.setState({
            artist: event.target.value
        });
    };

    albumInputHandler = (event) => {
        this.setState({
            album: event.target.value
        });
    };

    yearInputHandler = (event) => {
        this.setState({
            year: event.target.value
        });
    };

    youtubeUrlHandler = (event) => {
        this.setState({
            youtubeUrl: event.target.value
        });
    };

    soundCloudUrlHandler = (event) => {
        this.setState({
            soundCloudUrl: event.target.value
        });
    };

    bandCampUrlHandler = (event) => {
        this.setState({
            bandCampUrl: event.target.value
        });
    };

    render() {
        return (
            <div className={styles.songInfoInputDiv}>
                <div>
                    <span>Track</span>
                    <input
                        type="text"
                        placeholder="Name of the Track (required)"
                        onChange={this.trackInputHandler}
                        value={this.state.track}
                    />
                </div>
                <div>
                    <span>Artist</span>
                    <input
                        type="text"
                        placeholder="Name of the Artist (required)"
                        onChange={this.artistInputHandler}
                        value={this.state.artist}
                    />
                </div>
                <div>
                    <span>Album</span>
                    <input
                        type="text"
                        placeholder="Name of the Album"
                        onChange={this.albumInputHandler}
                        value={this.state.album}
                    />
                </div>
                <div>
                    <span>Year</span>
                    <input
                        type="text"
                        placeholder="Year of Song Release"
                        onChange={this.yearInputHandler}
                        value={this.state.year}
                    />
                </div>
                <div>
                    <span>Youtube URL</span>
                    <input
                        type="text"
                        placeholder="Youtube URL of the song"
                        onChange={this.youtubeUrlHandler}
                        value={this.state.youtubeUrl}
                    />
                </div>
                <div>
                    <span>Soundcloud URL</span>
                    <input
                        type="text"
                        placeholder="SoundCloud URL of the song"
                        onChange={this.soundCloudUrlHandler}
                        value={this.state.soundCloudUrl}
                    />
                </div>
                <div>
                    <span>BandCamp URL</span>
                    <input
                        type="text"
                        placeholder="BandCamp URL of the song"
                        onChange={this.bandCampUrlHandler}
                        value={this.state.bandCampUrl}
                    />
                </div>
            </div>
        );
    }
}

export default SongInfoUploader;