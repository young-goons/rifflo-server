import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button } from 'semantic-ui-react';

import axios from '../../../shared/axios';
import { uploadSong } from '../../../store/actions/upload';
import { getEndTimeStr, getCurrentTimeStr,
         getCurrentTimeFloatStr, convertTimeStrToTime } from "../../../shared/musicUtils";
import { DEFAULT_CLIP_LENGTH } from "../../../shared/config";
import SongInfoEditor from "./SongInfoEditor";
import styles from './SongUploader.module.css';

// TODO: make slider to help changing start point
//       forward 5 seconds backward 5 seconds
//       preload so that even if the user accidentally closes modal, the song is still there

class SongUploader extends Component {
    state = {
        songInfo: {
            track: '',
            artist: '',
            album: '',
            releaseDate: '',
            spotifyUrl: '',
            youtubeUrl: '',
            soundcloudUrl: '',
            bandcampUrl: '',
            termsChecked: false
        },
        src: null,
        songFile: null,
        startTime: 0,
        startTimeStr: '00:00.00',
        endTime: 15,
        endTimeStr: '00:15.00',
        currentTimeStr: '00:00',
        progressPercent: 0,
        audioLength: null,
        isPlaying: false
    };

    audioRef = React.createRef();

    trackInputHandler = (event) => {
        if (event.target.value.length > 3) {
            const url = "/song";
            const params = {
                title: event.target.value,
                // artist: this.state.songInfo.artist,
                numResults: 5
            };
            // axios({method: 'GET', url: url, params: params})
            //     .then(response => {
            //         console.log(response.data);
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     });
        }
        this.setState({
            songInfo: { ...this.state.songInfo, track: event.target.value }
        });

    };

    artistInputHandler = (event) => {
        this.setState({
            songInfo: { ...this.state.songInfo, artist: event.target.value }
        });
    };

    albumInputHandler = (event) => {
        this.setState({
            songInfo: { ...this.state.songInfo, album: event.target.value }
        });
    };

    releaseDateInputHandler = (event) => {
        this.setState({
            songInfo: { ...this.state.songInfo, releaseDate: event.target.value }
        });
    };

    spotifyUrlHandler = (event) => {
        this.setState({
            songInfo: { ...this.state.songInfo, spotifyUrl: event.target.value }
        });
    };

    youtubeUrlHandler = (event) => {
        this.setState({
            songInfo: { ...this.state.songInfo, youtubeUrl: event.target.value }
        });
    };

    soundcloudUrlHandler = (event) => {
        this.setState({
            songInfo: { ...this.state.songInfo, soundCloudUrl: event.target.value }
        });
    };

    bandcampUrlHandler = (event) => {
        this.setState({
            songInfo: { ...this.state.songInfo, bandCampUrl: event.target.value }
        });
    };

    termsCheckHandler = () => {
        this.setState({
            songInfo: { ...this.state.songInfo, termsChecked: !this.state.songInfo.termsChecked }
        });
    };

    uploadFileHandler = (event) => {
        if(window.FileReader){
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (r) => {
                this.setState({
                    src: r.target.result,
                    songFile: file
                });
                this.audioRef.current.onloadedmetadata = () => {
                    const audioLength = this.audioRef.current.duration;
                    this.setState({audioLength: audioLength});
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert('Sorry, your browser does\'nt support for preview');
        }

    };

    startTimeInputHandler = (event) => {
        // TODO: make it easier to write valid time format
        const timeStr = event.target.value,
              pattern = "^[0-5][0-9]\\:[0-5][0-9]\\.[0-9]{2}$";
        if (timeStr.match(pattern)) {
            console.log(timeStr.match(pattern));
            const time = convertTimeStrToTime(timeStr);
            console.log(time);
            this.setState({
                startTime: time,
                startTimeStr: getCurrentTimeFloatStr(time),
                endTime: time + DEFAULT_CLIP_LENGTH,
                endTimeStr: getCurrentTimeFloatStr(time + DEFAULT_CLIP_LENGTH)
            });
        } else {
            this.setState({startTimeStr: event.target.value});
        }
    };

    endTimeInputHandler = (event) => {
        this.setState({endTime: event.target.value});
    };

    playClickHandler = () => {
        // not sure how to wait until the song is fully loaded
        // this.audioRef.current.currentTime = this.state.startTime;
        const player = this.audioRef.current;
        player.currentTime = this.state.startTime;
        player.play();
        this.setState({isPlaying: true});
    };

    pauseClickHandler = () => {
        const player = this.audioRef.current;
        player.pause();
        this.setState({
            startTime: player.currentTime,
            isPlaying: false
        });
    };

    playRangeClickHandler = () => {
        // only if both start and end time match the format
        const player = this.audioRef.current;
        console.log(this.state.startTime);
        player.currentTime = this.state.startTime;
        player.play();
        this.setState({isPlaying: true});
    };

    initProgressBar = () => {
        const player = this.audioRef.current;
        console.log(player.currentTime, this.state.endTime);
        if (this.audioRef.current.currentTime > this.state.endTime) {
            this.audioRef.current.pause();
            this.setState({isPlaying: false});
        }
        const currentTime = player.currentTime;
        const currentTimeStr = getCurrentTimeStr(currentTime);
        this.setState({
            currentTime: currentTime,
            currentTimeStr: currentTimeStr,
            progressPercent: currentTime / this.state.audioLength
        });
    };

    onProgressBarClick = (event) => {
        const player = this.audioRef.current;
        const percent = event.nativeEvent.offsetX / event.nativeEvent.target.offsetWidth;
        player.currentTime = this.state.audioLength * percent;
        this.setState({
            progressPercent: percent,
            startTime: this.state.audioLength * percent,
            startTimeStr: getCurrentTimeFloatStr(this.state.audioLength * percent),
            endTime: this.state.audioLength * percent + DEFAULT_CLIP_LENGTH,
            endTimeStr: getCurrentTimeFloatStr(this.state.audioLength * percent + DEFAULT_CLIP_LENGTH)
        });
    };

    uploadClickHandler = () => {
        console.log(this.state.songInfo);
        if (!this.state.songInfo.track || !this.state.songInfo.artist) {
            alert("Fill out song info")
        } else if (!this.state.src || !this.state.audioLength) {
            alert("Upload an mp3 file")
        } else if (this.state.endTime - this.state.startTime > 15 && this.state.endTime - this.state.startTime < 12) {
            alert("Clip length must be between 12 to 15 seconds");
        } else if (!this.state.songInfo.termsChecked) {
            alert("Terms of use not checked");
        } else { // upload song
            const clipRange = {
                startTime: this.state.startTime,
                endTime: this.state.endTime
            };
            this.props.onUploadSong(this.state.songFile, clipRange, this.state.songInfo);
        }
    };

    render() {
        let audioDiv, progressDiv;
        if (this.state.src) {
            audioDiv = (
                <div>
                    <audio src={this.state.src} ref={this.audioRef}
                           onTimeUpdate={this.initProgressBar} preload="metadata"/>
                </div>
            );
            if (this.state.audioLength && this.state.src) { // when metadata is loaded
                const clipLengthStr = getEndTimeStr(this.state.audioLength);
                progressDiv = (
                    <div>
                        { this.state.isPlaying ?
                            <Icon name="pause" size="big" onClick={this.pauseClickHandler}/> :
                            <Icon name="play" size="big" onClick={this.playClickHandler}/>
                        }
                        <progress value={this.state.progressPercent} max="1" className={styles.progressBar}
                                  onClick={this.onProgressBarClick}/>
                        <br/>
                        <span className={styles.currTimeDiv}>{this.state.currentTimeStr}</span>
                        <span className={styles.clipLengthDiv}>{clipLengthStr}</span>
                        <div className={styles.timeInputDiv}>
                            <input type="text" className={styles.timeInput} value={this.state.startTimeStr}
                                   onChange={this.startTimeInputHandler}
                            />
                            <span className={styles.tildeSpan}> ~ </span>
                            <input type="text" className={styles.timeInput} value={this.state.endTimeStr}
                                   onChange={this.endTimeInputHandler}/>
                            <span className={styles.playRangeSpan}
                                  onClick={this.playRangeClickHandler}>
                                Play Selected Range
                            </span>
                        </div>
                    </div>
                );
            }
        }
        return (
            <div className={styles.songUploadDiv}>
                <div className={styles.fileUploaderDiv}>
                    <input type="file" accept=".mp3, .wav" className={styles.songFileInput}
                           onChange={this.uploadFileHandler}/>
                </div>
                { audioDiv }
                <div className={styles.audioPlayDiv}>
                    { progressDiv }
                </div>
                <SongInfoEditor
                    track={this.state.songInfo.track}
                    trackInputHandler={this.trackInputHandler}
                    artist={this.state.songInfo.artist}
                    artistInputHandler={this.artistInputHandler}
                    album={this.state.songInfo.album}
                    albumInputHandler={this.albumInputHandler}
                    releaseDate={this.state.songInfo.releaseDate}
                    releaseDateInputHandler={this.releaseDateInputHandler}
                    spotifyUrl={this.state.songInfo.spotifyUrl}
                    spotifyUrlHandler={this.spotifyUrlHandler}
                    youtubeUrl={this.state.songInfo.youtubeUrl}
                    youtubeUrlHandler={this.youtubeUrlHandler}
                    soundcloudUrl={this.state.songInfo.soundcloudUrl}
                    soundcloudUrlHandler={this.soundcloudUrlHandler}
                    bandcampUrl={this.state.songInfo.bandcampUrl}
                    bandcampUrlHandler={this.bandcampUrlHandler}
                    termsChecked={this.state.songInfo.termsChecked}
                    termsCheckHandler={this.termsCheckHandler}
                />
                <div className={styles.buttonDiv}>
                    <Button color="orange" fluid size="small" onClick={this.uploadClickHandler}>
                        Upload
                    </Button>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUploadSong: (songFile, clipRange, songInfo) => dispatch(uploadSong(songFile, clipRange, songInfo))
    };
};

export default connect(null, mapDispatchToProps)(SongUploader);

// references
// http://jsfiddle.net/lun471k/KfzM6/
