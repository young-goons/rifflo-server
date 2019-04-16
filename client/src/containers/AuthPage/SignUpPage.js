import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { NavLink, Redirect } from 'react-router-dom';
import { Button, Form, Grid, Icon, Image, Segment, Message } from 'semantic-ui-react';

import styles from './AuthPage.module.css';
import {auth} from "../../store/actions/auth";

class SignUpPage extends Component {
    state = {
        email: "",
        username: "",
        password: "",
        passwordConfirm: "",
        passwordMatchWarning: false,
        usernameExists: false,
        emailExists: false
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
        if (this.state.password === this.state.passwordConfirm) {
            this.setState({passwordMatchWarning: false});
            const url = "http://127.0.0.1:5000/signup";
            const newUser = {
                email: this.state.email,
                username: this.state.username,
                password: this.state.password
            };
            const emailExistsUrl = "http://127.0.0.1:5000/user/id/email/" + this.state.email;
            const usernameExistsUrl = "http://127.0.0.1:5000/user/id/username/" + this.state.username;
            axios({method: 'GET', url: emailExistsUrl})
                .then(response => {
                    if (response.data.userId) {
                        this.setState({emailExists: true});
                        return;
                    } else {
                        this.setState({emailExists: false});
                        return axios({method: 'GET', url: usernameExistsUrl});
                    }
                })
                .then(response => {
                    if (response) {
                        if (response.data.userId) {
                            this.setState({usernameExists: true});
                            return;
                        } else {
                            this.setState({usernameExists: false});
                            return axios({method: 'POST', url: url, params: newUser});
                        }
                    }
                })
                .then(response => {
                    if (response) {
                        this.props.onAuth(this.state.email, this.state.password);
                    }
                })
                .catch(error => {
                    alert(error);
                });
        } else {
            this.setState({passwordMatchWarning: true});
        }
    };

    render() {
        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to="/"/>;
        }
        let warningDiv = <div></div>;
        if (this.state.passwordMatchWarning) {
            warningDiv = (
                <div className={styles.authWarningDiv}>
                    <Message attached="bottom" warning>
                        Passwords do not match
                    </Message>
                </div>
            );
        } else if (this.state.emailExists) {
            warningDiv = (
                <div className={styles.authWarningDiv}>
                    <Message attached="bottom" warning>
                        Email is already registered
                    </Message>
                </div>
            )
        } else if (this.state.usernameExists) {
            warningDiv = (
                <div className={styles.authWarningDiv}>
                    <Message attached="bottom" warning>
                        Username is already used
                    </Message>
                </div>
            )
        }
        const signUpDiv = (
            <Grid centered columns={2} verticalAlign="middle" style={{height: '100%'}}>
                <Grid.Column className={styles.signUpForm}>
                    <Image src='https://store.storeimages.cdn-apple.com/4981/as-images.apple.com/is/image/AppleInc/aos/published/images/M/RR/MRRH2/MRRH2?wid=445&hei=445&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1525909183709' size='tiny' centered />
                    <div className={styles.signUpHeader}>
                        Sign Up
                    </div>
                    <div className={styles.signUpSubHeader}>
                        Discover and Share Music
                    </div>
                    <Segment>
                        <Form size="large">
                            <Form.Input
                                fluid
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email address"
                                value={this.state.email}
                                onChange={this.emailInputHandler}
                            />
                            <Form.Input
                                fluid
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                value={this.state.username}
                                onChange={this.usernameInputHandler}
                            />
                            <Form.Input
                                fluid
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                type="password"
                                value={this.state.password}
                                onChange={this.passwordInputHandler}
                            />
                            <Form.Input
                                fluid
                                icon="lock"
                                iconPosition="left"
                                placeholder="Confirm Password"
                                type="password"
                                value={this.state.passwordConfirm}
                                onChange={this.passwordConfirmInputHandler}
                            />
                            <Button color="blue" fluid size="large" onClick={this.signUpHandler}>
                                Sign Up
                            </Button>
                        </Form>
                        { warningDiv }
                    </Segment>
                    <div className={styles.orDiv}>Or</div>
                    <div className={styles.facebookButtonDiv}>
                        <Button color="white" fluid size="large">
                            <Icon name="facebook" size="small"/> Sign Up with Facebook
                        </Button>
                    </div>
                    <div className={styles.googleButtonDiv}>
                        <Button color="white" fluid size="large">
                            <Icon name="google" size="small"/> Sign Up with Google
                        </Button>
                    </div>
                    <div className={styles.signInDiv}>
                        Already have an account?
                        <NavLink to={'/signin'} className={styles.signInLink}>Sign In!</NavLink>
                    </div>
                </Grid.Column>
            </Grid>
        );
        return (
            <div className={styles.containerDiv}>
                { authRedirect }
                { signUpDiv }
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);