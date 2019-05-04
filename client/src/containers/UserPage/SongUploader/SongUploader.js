import React, { Component } from 'react';
import { FilePond } from 'react-filepond';
import { Input, Icon } from 'semantic-ui-react';

import { getEndTimeStr, getCurrentTimeStr,
    getCurrentTimeFloatStr, convertTimeStrToTime } from "../../../shared/musicUtils";
import { DEFAULT_CLIP_LENGTH } from "../../../shared/config";
import styles from './SongUploader.module.css';

// TODO: make slider to help changing start point
//       forward 5 seconds backward 5 seconds
//       preload so that even if the user accidentally closes modal, the song is still there

class SongUploader extends Component {
    state = {
        src: null,
        value: null,
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

    uploadFileHandler = (event) => {
        if(window.FileReader){
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (r) => {
                this.setState({
                    src: r.target.result
                });
                this.audioRef.current.onloadedmetadata = () => {
                    const audioLength = this.audioRef.current.duration;
                    this.setState({audioLength: audioLength});
                }
            };
            reader.readAsDataURL(file);
            this.setState({value: reader});
        }
        else {
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
        console.log(this.audioRef.current.duration);
    };

    pauseClickHandler = () => {
        const player = this.audioRef.current;
        console.log(player.currentTime);
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

    render() {
        let audioDiv, progressDiv;
        if (this.state.src) {
            audioDiv = (
                <div>
                    <audio src={this.state.src} ref={this.audioRef}
                           onTimeUpdate={this.initProgressBar} preload="metadata"/>
                </div>
            );
            if (this.state.audioLength) { // when metadata is loaded
                const clipLengthStr = getEndTimeStr(this.state.audioLength);
                progressDiv = (
                    <div>
                        { this.state.isPlaying ?
                            <Icon name="pause" size="big" onClick={this.pauseClickHandler}/> :
                            <Icon name="play" size="big" onClick={this.playClickHandler}/> }
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
            </div>
        )
    }
}

export default SongUploader

// references
// Basic audio loading: https://jsfiddle.net/vu4vrLo2/1/
// Progress bar: https://m.dotdev.co/how-to-build-an-audio-player-with-html5-and-the-progress-element-487cbbbaebfc
