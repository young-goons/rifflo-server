import React, { Component } from 'react';

import SignUpPage from './SignUpPage';
import SignInPage from './SignInPage';
import styles from './AuthPage.module.css';

class AuthPage extends Component {
    state = {
        isSignUpPage: true
    };

    signUpClickHandler = () => {
        this.setState({isSignUpPage: true});
    };

    signInClickHandler = () => {
        this.setState({isSignUpPage: false});
    };

    render () {
        let authPageDiv;
        if (this.state.isSignUpPage) {
            authPageDiv = <SignUpPage signInClickHandler={this.signInClickHandler}/>
        } else {
            authPageDiv = <SignInPage signUpClickHandler={this.signUpClickHandler}/>
        }

        return (
            <div className={styles.containerDiv}>
                { authPageDiv }
            </div>
        );
    }
}

export default AuthPage;