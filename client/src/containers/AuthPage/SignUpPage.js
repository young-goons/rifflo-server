import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, Form, Grid, Icon, Image, Segment, Message, Modal } from 'semantic-ui-react';
import FacebookLogin from "react-facebook-login";

import axios from '../../shared/axios';
import styles from './AuthPage.module.css';
import { auth, authFacebook } from "../../store/actions/auth";
import FacebookModal from './FacebookModal/FacebookModal';
import { validateUsername } from "../../shared/inputUtils";

class SignUpPage extends Component {
    state = {
        email: "",
        username: "",
        password: "",
        passwordConfirm: "",
        passwordMatchWarning: false,
        usernameExists: false,
        emailExists: false,
        validUsername: true,
        invalidUsernameMessage: null,
        facebookModalOpen: false
    };

    emailInputHandler = (event) => {
        this.setState({
            email: event.target.value
        });
    };

    usernameInputHandler = (event) => {
        const usernameValidityObj = validateUsername(event.target.value);
        this.setState({
            username: event.target.value,
            validUsername: usernameValidityObj.valid,
            invalidUsernameMessage: usernameValidityObj.msg
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

    handleOpen = () => {
        this.setState({facebookModalOpen: true});
    };

    handleClose = () => {
        this.setState({facebookModalOpen: false});
    };

    // TODO: check email format and email confirmation(?)
    signUpHandler = () => {
        if (this.state.password === this.state.passwordConfirm && this.state.validUsername) {
            this.setState({passwordMatchWarning: false});
            const url = "/signup";
            const newUser = {
                email: this.state.email,
                username: this.state.username,
                password: this.state.password
            };
            const emailExistsUrl = "/user/id/email/" + this.state.email;
            const usernameExistsUrl = "/user/id/username/" + this.state.username;
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

    facebookResponse = (response) => {
        const facebookIdExistsUrl = "/user/id/facebook/" + response.userID;
        const facebookAccessToken = response.accessToken;
        const facebookEmail = response.email;
        this.setState({facebookAccessToken});
        axios({method: 'GET', url: facebookIdExistsUrl})
            .then(response => {
                if (response.data.userId) {
                    this.props.onAuthFacebook(facebookAccessToken);
                } else {
                    this.setState({facebookAccessToken, facebookEmail}, () => {
                        this.handleOpen();
                    });
                }
            })
    };

    render() {
        let authRedirect = null;
        if (this.props.isAuthenticated && this.props.userInfo) {
            authRedirect = <Redirect to="/"/>;
        }
        let warningDiv = <div></div>;
        if (!this.state.validUsername) {
            warningDiv = (
                <div className={styles.authWarningDiv}>
                    <Message attached="bottom" negative>
                        { this.state.invalidUsernameMessage }
                    </Message>
                </div>
            )
        } else if (this.state.passwordMatchWarning) {
            warningDiv = (
                <div className={styles.authWarningDiv}>
                    <Message attached="bottom" negative>
                        Passwords do not match
                    </Message>
                </div>
            );
        } else if (this.state.emailExists) {
            warningDiv = (
                <div className={styles.authWarningDiv}>
                    <Message attached="bottom" negative>
                        Email is already registered
                    </Message>
                </div>
            )
        } else if (this.state.usernameExists) {
            warningDiv = (
                <div className={styles.authWarningDiv}>
                    <Message attached="bottom" negative>
                        Username is already used
                    </Message>
                </div>
            )
        }

        const signUpDiv = (
            <Grid centered columns={3} verticalAlign="middle" style={{height: '100%'}}>
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
                                type="email"
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
                            <Button
                                color="orange" fluid size="large"
                                onClick={this.signUpHandler}>
                                Sign Up
                            </Button>
                        </Form>
                        { warningDiv }
                    </Segment>
                    <div className={styles.orDiv}>Or</div>
                    <div className={styles.facebookButtonDiv}>
                        <FacebookLogin
                            appId={process.env.REACT_APP_FACEBOOK_API_KEY}
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={this.facebookResponse}
                            cssClass={styles.facebookButton}
                            textButton="Continue With Facebook"
                            icon={<Icon name="facebook" size="small"/>}
                        />
                    </div>
                    <div className={styles.signInDiv}>
                        Already have an account?
                        <span className={styles.signInLink} onClick={this.props.signInClickHandler}>
                            Sign In!
                        </span>
                    </div>
                </Grid.Column>
                <Modal size="tiny" open={this.state.facebookModalOpen} onClose={this.handleClose}>
                    <FacebookModal accessToken={this.state.facebookAccessToken} email={this.state.facebookEmail}/>
                </Modal>
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
        authRedirectPath: state.auth.authRedirectPath,
        userInfo: state.auth.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch(auth(email, password)),
        onAuthFacebook: (accessToken) => dispatch(authFacebook(accessToken))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);