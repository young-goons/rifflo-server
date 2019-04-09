import React, { Component } from 'react';

import styles from './SignInPage.module.css';

class SignInPage extends Component {
    state = {
        email: "",
        password: ""
    }

    emailInputHandler = (event) => {
        this.setState({
            email: event.target.value
        });
    }

    passwordInputHandler = (event) => {
        this.setState({
            password: event.target.value
        });
    }

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
            </div>
        );
        return (
            <div>
                Sign In Page
                <authForm/>
            </div>
        );
    }
}

export default SignInPage;