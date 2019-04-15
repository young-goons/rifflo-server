import React, { Component } from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Container } from 'semantic-ui-react';

import Layout from './hoc/Layout/Layout';
import UserPage from './containers/UserPage/UserPage';
import SignUpPage from './containers/AuthPage/SignUpPage';
import SignInPage from './containers/AuthPage/SignInPage';
import Feed from './containers/Feed/Feed';

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

export default App;
