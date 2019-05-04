import React, { Component } from 'react';
import { Grid, Checkbox, Input, Button } from 'semantic-ui-react';

import styles from './SongUploader.module.css';

// TODO: fill out the info automatically

class SongInfoUploader extends Component {
    state = {
        track: '',
        artist: '',
        album: '',
        year: '',
        youtubeUrl: '',
        soundCloudUrl: '',
        bandCampUrl: '',
        termsChecked: false
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

    termsCheckHandler = () => {
        this.setState({termsChecked: !this.state.termsChecked})
    }

    uploadClickHandler = () => {

    };

    render() {
        return (
            <Grid className={styles.songInfoInputDiv}>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>Track</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                               error={this.state.track === '' ? true : false}
                               placeholder="Name of the Track (Required)"
                               value={this.state.track} onChange={this.trackInputHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>Artist</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                               error={this.state.track === '' ? true : false}
                               placeholder="Name of the Artist (Required)"
                               value={this.state.artist} onChange={this.artistInputHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>Album</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                               placeholder="Name of the Album"
                               value={this.state.album} onChange={this.albumInputHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>Year</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                               placeholder="Year of Song Release"
                               value={this.state.year} onChange={this.yearInputHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>Youtube</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                               placeholder="Youtube URL of the Song"
                               value={this.state.youtubeUrl} onChange={this.youtubeUrlHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>SoundCloud</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                        placeholder="SoundCloud URL of the Song"
                        value={this.state.soundCloudUrl} onChange={this.soundCloudUrlHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>BandCamp</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                               placeholder="BandCamp URL of the Song"
                               value={this.state.bandCampUrl} onChange={this.bandCampUrlHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column className={styles.labelColumn}>
                        <span className={styles.labelSpan}>Terms of Use</span>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column className={styles.labelColumn}>
                        <Checkbox label="I agree that the tracks have been lawfully acquired,
                                        are not bootlegged or pre-release, and are properly identified"
                                  onChange={this.termsCheckHandler} checked={this.state.termsChecked}
                                  className={styles.termsCheckbox}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.buttonRow}>
                    <Grid.Column className={styles.buttonColumn}>
                        <Button color="orange" fluid size="small" onClick={this.uploadClickHandler}>
                            Upload
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default SongInfoUploader;