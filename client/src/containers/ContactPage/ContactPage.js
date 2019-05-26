import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './HelpPage.module.css';
import { loadAuthUser } from "../../store/actions/auth";
import SiteHeader from "../SiteHeader/SiteHeader";

class ContactPage extends Component {
    componentDidMount() {
        if (!this.props.authUserInfo) {
            this.props.onLoadAuthUser(this.props.authUserId);
        }
    }

    render() {
        let renderDiv;
        if (this.props.authUserInfo) {
            const siteHeader = <SiteHeader contextRef={this.contextRef} userInfo={this.props.authUserInfo}/>;
            renderDiv = (
                <div>
                    { siteHeader }
                </div>
            )
        }
        return (
            <div>
                { renderDiv }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUserInfo: state.auth.authUserInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadAuthUser: (userId) => dispatch(loadAuthUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactPage);