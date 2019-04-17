import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Segment, Sticky, Ref } from 'semantic-ui-react';

import styles from './SiteHeader.module.css';

class SiteHeader extends Component {
    render() {
        return (
            <Sticky context={this.props.contextRef}>
                <Segment>
                    App Name
                </Segment>
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