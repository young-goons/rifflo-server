import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Container } from 'semantic-ui-react';
import axios from 'axios';

import UserPage from './containers/UserPage/UserPage';
import SignUpPage from './containers/AuthPage/SignUpPage';
import SignInPage from './containers/AuthPage/SignInPage';
import Feed from './containers/Feed/Feed';
import store from './store/store';
import {loadUser, loadUserInfo, setAuthRedirectPath} from './store/actions/auth';
import { validateAccessToken } from "./shared/utils";

// TODO: check if refreshToken is not expired and get newToken if expired soon
//       what if accessToken expires while using the app?
//       add isAuthenticating to display loading screen instead of singin page on loading feed
// window.location.pathname


class App extends Component {
    state = {
        authUserId: validateAccessToken(window.localStorage.getItem('accessToken'))
    };

    render() {
        console.log("rendering App as user " + this.state.authUserId);
        const routes = (
            <Switch>
                <Route path="/:username"
                       render={() => <UserPage authUserId={this.state.authUserId} />}
                />
                <Route path="/"
                       render={() => <Feed authUserId={this.state.authUserId} />}
                />
                <Route render={() => <Feed authUserId={this.state.authUserId} />} />
            </Switch>
        );

        return (
            <Router history={createBrowserHistory()}>
                <Container style={{ height: '100%', width: '100%'}}>
                    { routes }
                </Container>
            </Router>
        );
    }
}

const mapStateToProps = state => {
    return {
        authRedirectPath: state.auth.authRedirectPath,
        userInfo: state.auth.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadUser: (userId) => dispatch(loadUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);