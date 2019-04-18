import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Sticky, Grid, Segment, Search, Icon } from 'semantic-ui-react';

import styles from './SiteHeader.module.css';

class SiteHeader extends Component {
    state = {
        searchString: ''
    };

    signOutHandler = () => {

    };

    render() {
        return (
            <Sticky context={this.props.contextRef} >
                <div className={styles.stickyDiv}>
                    <Grid verticalAlign="middle">
                        <Grid.Column width={4} textAlign="right">
                            App Name
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Search size="tiny" placeholder="Search Users & Playlists"/>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid>
                                <Grid.Column width={3}>
                                    <Icon name="music" size="large"/>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Icon name="newspaper outline" size="large"/>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <a href={"/" + this.props.userInfo.username}>
                                        <Icon name="user outline" size="large" />
                                    </a>
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
        userInfo: state.auth.userInfo
    };
};

export default connect(mapStateToProps)(SiteHeader);