import React, { Component } from 'react';
import { connect } from 'react-redux';

import { auth } from '../../store/actions/auth';
import styles from './SignInPage.module.css';

class SignInPage extends Component {
    state = {
        email: "",
        password: ""
    };

    emailInputHandler = (event) => {
        this.setState({
            email: event.target.value
        });
    };

    passwordInputHandler = (event) => {
        this.setState({
            password: event.target.value
        });
    };

    signInHandler = () => {
        this.props.onAuth(this.state.email, this.state.password);
    };

    render () {
        const authForm = (
            <div>
                <div>
                    <span>Email</span>
                    <input
                        type="email"
                        placeholder="email"
                        onChange={this.emailInputHandler}
                        value={this.state.email}
                    />
                </div>
                <div>
                    <span>Password</span>
                    <input
                        type="password"
                        placeholder="password"
                        onChange={this.passwordInputHandler}
                        value={this.state.password}
                    />
                </div>
                <div>
                    <button onClick={this.signInHandler}>Sign In</button>
                </div>
            </div>
        );
        return (
            <div>
                Sign In Page
                {authForm}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        isAuthenticated: state.auth.isAuthenticated,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch(auth(email, password)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);