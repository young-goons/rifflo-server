import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Container } from 'semantic-ui-react';

import { auth } from './store/actions/auth';
import Layout from './hoc/Layout/Layout';
import UserPage from './containers/UserPage/UserPage';
import SignUpPage from './containers/AuthPage/SignUpPage';
import SignInPage from './containers/AuthPage/SignInPage';
import Feed from './containers/Feed/Feed';

// if(localStorage.refreshToken) {
//
//     setAuthToken(localStorage.jwtToken);
//     const decoded = jwt_decode(localStorage.jwtToken);
//     store.dispatch(setCurrentUser(decoded));
//
//     const currentTime = Date.now() / 1000;
//     if(decoded.exp < currentTime) {
//         store.dispatch(logoutUser());
//         window.location.href = '/login'
//     }
// }

class App extends Component {
  render() {
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
        <Container style={{ height: '100%' }}>
          {routes}
        </Container>
      </Router>
    );
  }
}

const mapStateToProps = state => {
    return {

    };
};

export default App;
