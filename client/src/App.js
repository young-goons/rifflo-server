import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Container } from 'semantic-ui-react';

import { loadUser } from './store/actions/auth';
import store from './store/store';
import UserPage from './containers/UserPage/UserPage';
import SignUpPage from './containers/AuthPage/SignUpPage';
import SignInPage from './containers/AuthPage/SignInPage';
import Feed from './containers/Feed/Feed';
import { parseJWT } from "./shared/utils";

// TODO: check if refreshToken is not expired and get newToken if expired soon
//       what if accessToken expires while using the app?
//       add isAuthenticating to display loading screen instead of singin page on loading feed
// window.location.pathname
const accessToken = window.localStorage.getItem("accessToken");
if (accessToken) {
    const jwtInfo = parseJWT(accessToken);
    if (Date.now() / 1000 < jwtInfo.exp) {
        console.log("loading user info from access token");
        store.dispatch(loadUser(jwtInfo.identity.userId));
    }
}

class App extends Component {
  render() {
    console.log("rendering App");
    const routes = (
      <Switch>
        <Route path="/signup" component={SignUpPage}/>
        <Route path="/signin" component={SignInPage}/>
        <Route path="/:username" component={UserPage}/>
        <Route path="/" component={Feed}/>
        <Redirect to="/"/>
      </Switch>
    );

    return (
      <Router history={createBrowserHistory()}>
        <Container style={{ height: '100%', width: '100%'}}>
          {routes}
        </Container>
      </Router>
    );
  }
}

export default App;