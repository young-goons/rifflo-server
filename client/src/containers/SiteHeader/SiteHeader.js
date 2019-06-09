import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Sticky, Grid, Search, Icon, Image, List } from 'semantic-ui-react';

import axios from '../../shared/axios';
import styles from './SiteHeader.module.css';
import { signOut } from '../../store/actions/auth';
import { resetUser } from '../../store/actions/user';
import defaultProfileImg from '../../resources/defaultProfileImage.jpg';

class SiteHeader extends Component {
    state = {
        searchString: '',
        profileImgSrc: null
    };

    componentDidMount() {
        if (!this.state.profileImgSrc) {
            const url = "/user/" + this.props.userInfo.userId + "/profile/image";
            axios({method: 'GET', url: url})
                .then(response => {
                    this.setState({profileImgSrc: response.data.url + "&" + Date.now()});
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
        return (
            <Sticky context={this.props.contextRef} >
                <div className={styles.stickyDiv}>
                    <Grid verticalAlign="middle">
                        <Grid.Column width={4} textAlign="right">
                            <a href="/">App Name</a>
                        </Grid.Column>
                        <Grid.Column width={8} className={styles.centerColumn}>
                            <Search size="tiny" placeholder="Search Users & Playlists"/>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <List horizontal className={styles.menuList}>
                                <List.Item className={styles.activityItem}>
                                    <Icon name="newspaper outline" size="large"/>
                                </List.Item>
                                <List.Item className={styles.userImageItem}>
                                    <Image avatar className={styles.userImage} size="tiny"
                                           href={"/" + this.props.userInfo.username}
                                           src={this.state.profileImgSrc ? this.state.profileImgSrc : defaultProfileImg} />
                                </List.Item>
                                <List.Item className={styles.addUserItem}>
                                    <a href="/people/suggested">
                                        <Icon name="add user" size="large"/>
                                    </a>
                                </List.Item>
                                <List.Item className={styles.settingsItem}>
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
                                </List.Item>
                            </List>
                        </Grid.Column>
                    </Grid>
                </div>
            </Sticky>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSignOut: () => dispatch(signOut()),
        onResetUser: () => dispatch(resetUser()),
    };
};

export default connect(null, mapDispatchToProps)(SiteHeader);
