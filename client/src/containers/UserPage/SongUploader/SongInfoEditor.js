import React, { Component } from 'react';
import { Grid, Checkbox, Input, Button } from 'semantic-ui-react';

import styles from './SongUploader.module.css';

// TODO: fill out the info automatically

class SongInfoEditor extends Component {
    render() {
        return (
            <Grid className={styles.songInfoInputDiv}>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>Track</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                               error={this.props.track === '' ? true : false}
                               placeholder="Name of the Track (Required)"
                               value={this.props.track} onChange={this.props.trackInputHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>Artist</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                               error={this.props.artist === '' ? true : false}
                               placeholder="Name of the Artist (Required)"
                               value={this.props.artist} onChange={this.props.artistInputHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>Album</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                               placeholder="Name of the Album"
                               value={this.props.album} onChange={this.props.albumInputHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>Year</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                               placeholder="Year of Song Release"
                               value={this.props.year} onChange={this.props.yearInputHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>Youtube</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                               placeholder="Youtube URL of the Song"
                               value={this.props.youtubeUrl} onChange={this.props.youtubeUrlHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>SoundCloud</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                        placeholder="SoundCloud URL of the Song"
                        value={this.props.soundCloudUrl} onChange={this.props.soundcloudUrlHandler}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.inputRow}>
                    <Grid.Column width="3" verticalAlign="middle" textAlign="center" className={styles.labelColumn}>
                        <span className={styles.labelSpan}>BandCamp</span>
                    </Grid.Column>
                    <Grid.Column width="12" className={styles.inputColumn}>
                        <Input fluid size="small" type="text" className={styles.songInfoInput}
                               placeholder="BandCamp URL of the Song"
                               value={this.props.bandCampUrl} onChange={this.props.bandcampUrlHandler}/>
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
                                  onChange={this.props.termsCheckHandler} checked={this.props.termsChecked}
                                  className={styles.termsCheckbox}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default SongInfoEditor;