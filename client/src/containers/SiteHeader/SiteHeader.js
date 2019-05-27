import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Sticky, Grid, Search, Icon, Image } from 'semantic-ui-react';

import axios from '../../shared/axios';
import { BASE_URL } from "../../shared/config";
import styles from './SiteHeader.module.css';
import { signOut } from '../../store/actions/auth';
import { loadUserProfileImage, resetUser } from '../../store/actions/user';
import defaultProfileImg from '../../resources/defaultProfileImage.jpg';

class SiteHeader extends Component {
    state = {
        searchString: '',
        profileImgSrc: null
    };

    componentDidMount() {
        if (!this.state.profileImgSrc) {
            console.log(this.props);
            const url = "/user/" + this.props.userInfo.userId + "/profile/image";
            axios({method: 'GET', url: url})
                .then(response => {
                    this.setState({profileImgSrc: BASE_URL + url + "?" + Date.now()});
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    signOutClickHandler = () => {
        this.props.onSignOut();
        this.props.onResetUser();
    };

    render() {
        console.log(this.props);
        return (
            <Sticky context={this.props.contextRef} >
                <div className={styles.stickyDiv}>
                    <Grid verticalAlign="middle">
                        <Grid.Column width={4} textAlign="right">
                            <a href="/">App Name</a>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Search size="tiny" placeholder="Search Users & Playlists"/>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid verticalAlign="middle">
                                <Grid.Column width={3}>
                                    <Icon name="newspaper outline" size="large"/>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Image circular size="big" className={styles.userImage}
                                           href={"/" + this.props.userInfo.username}
                                           src={this.state.profileImgSrc ? this.state.profileImgSrc : defaultProfileImg} />
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <a href="/people/suggested">
                                        <Icon name="add user" size="large"/>
                                    </a>
                                </Grid.Column>
                                <Grid.Column width={3} className={styles.settingsColumn}>
                                    <Icon name="setting" size="large" className={styles.settingsIcon}/>
                                    <div className={styles.dropdownContent}>
                                        <span
                                            className={styles.dropdownItemSpan}
                                            onClick={this.signOutClickHandler}>Sign Out
                                        </span>
                                        <span className={styles.dropdownItemSpan}>
                                            <a href="/help">Help</a>
                                        </span>
                                        <span className={styles.dropdownItemSpan}>
                                            <a href="/contact">Contact</a>
                                        </span>
                                    </div>
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                    </Grid>
                </div>
            </Sticky>
        );
    }
}

const mapStateToProps = state => {
    return {
        profileImgSrc: state.user.profileImgSrc
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSignOut: () => dispatch(signOut()),
        onResetUser: () => dispatch(resetUser()),
        onLoadUserProfileImage: (userId) => dispatch(loadUserProfileImage(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteHeader);
