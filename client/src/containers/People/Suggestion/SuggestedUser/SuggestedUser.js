import React, { Component } from 'react';
import {Grid, List, Image, Button} from 'semantic-ui-react';

import axios from '../../../../shared/axios';
import styles from './SuggestedUser.module.css';
import profileImg from '../../../../resources/defaultProfileImage.jpg';

class SuggestedUser extends Component {
    state = {
        userInfo: null,
        profileImgSrc: null
    };

    componentDidMount() {
        if (!this.state.userInfo) {
            this.loadUserInfo(this.props.userId);
        }
        if(!this.state.profileImgSrc) {
            this.loadUserProfileImage(this.props.userId);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userId !== this.state.userInfo.userId) {
            this.loadUserInfo(nextProps.userId);
            this.loadUserProfileImage(nextProps.userId);
        }
    }

    loadUserInfo = (userId) => {
        const url = "/user/" + userId + "/info";
        axios({method: 'GET', url: url})
            .then(response => {
                this.setState({userInfo: response.data.user});
            })
            .catch(error => {
                console.log(error);
            });
    };

    loadUserProfileImage = (userId) => {
        const url = "/user/" + userId + "/profile/image";
        axios({method: 'GET', url: url})
            .then(response => {
                this.setState({profileImgSrc: response.data.url + "&" + Date.now()});
            })
            .catch(error => {
                this.setState({profileImgSrc: null})
            });
    };

    render() {
        let userLink;
        if (this.state.userInfo) {
            userLink = "/" + this.state.userInfo.username;
        }

        return (
            <Grid.Row className={styles.gridRow}>
                <Grid.Column width={2} textAlign="center">
                    <div className={styles.imageDiv}>
                        <Image circular size="tiny" href={userLink}
                               src={this.state.profileImgSrc ? this.state.profileImgSrc : profileImg} />
                    </div>
                </Grid.Column>
                <Grid.Column width={9} textAlign="left">
                    <div className={styles.headerDiv}>
                        <a href={userLink}>
                            { this.state.userInfo ? this.state.userInfo.username : null }
                        </a>
                    </div>
                    <div className={styles.descriptionDiv}>
                        ... People You Follow Also Follow
                    </div>
                </Grid.Column>
                <Grid.Column width={2}>
                    <Button size="tiny" color="teal"
                            onClick={() => this.props.followClickHandler(this.state.userInfo.userId)}>
                        Follow
                    </Button>
                </Grid.Column>
                <Grid.Column width={2} className={styles.ignoreButtonColumn}>
                    <Button size="tiny" onClick={() => this.props.ignoreClickHandler(this.state.userInfo.userId)}>
                        Ignore
                    </Button>
                </Grid.Column>
            </Grid.Row>
        )
    }
}

export default SuggestedUser;