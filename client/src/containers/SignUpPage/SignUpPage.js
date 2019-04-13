import React, { Component } from 'react';
import axios from 'axios';

class SignUpPage extends Component {
    state = {
        email: "",
        username: "",
        password: "",
        passwordConfirm: ""
    };

    emailInputHandler = (event) => {
        this.setState({
            email: event.target.value
        });
    };

    usernameInputHandler = (event) => {
        this.setState({
            username: event.target.value
        });
    };

    passwordInputHandler = (event) => {
        this.setState({
            password: event.target.value
        });
    };

    passwordConfirmInputHandler = (event) => {
        this.setState({
            passwordConfirm: event.target.value
        });
    };

    // TODO: confirm password, check no same email or username exists
    
    signUpHandler = () => {
        const url = "http://127.0.0.1:5000/signup";
        const newUser = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
        };
        axios({method: 'POST', url: url, params: newUser})
            .then(response => {
                console.log(response.data);
                alert("User successfully added");
            })
            .catch(error => {
                alert(error);
            })
    };

    render() {
        const signUpForm = (
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
                    <span>Username</span>
                    <input
                        type="text"
                        placeholder="username"
                        onChange={this.usernameInputHandler}
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
                    <span>Confirm Password</span>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        onChange={this.passwordConfirmInputHandler}
                        value={this.state.passwordConfirm}
                    />
                </div>
                <div>
                    <button onClick={this.signUpHandler}>Sign Up</button>
                </div>
            </div>
        );

        return (
            <div>
                Sign Up Page
                {signUpForm}
            </div>
        );
    }
}

export default SignUpPage;