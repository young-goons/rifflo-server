import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import { Button, Form, Grid, Message, Icon, Image, Segment, Modal } from 'semantic-ui-react';

import { auth, authFacebook } from '../../store/actions/auth';
import styles from './AuthPage.module.css';
import FacebookModal from "./FacebookModal/FacebookModal";

class SignInPage extends Component {
    state = {
        email: "",
        password: "",
        emailExists: true,
        facebookModalOpen: false
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
        const emailExistsUrl = "http://127.0.0.1:5000/user/id/email/" + this.state.email;
        axios({method: 'GET', url: emailExistsUrl})
            .then(response => {
                if (response.data.userId) {
                    this.setState({emailExists: true});
                    this.props.onAuth(this.state.email, this.state.password);
                } else {
                    this.setState({emailExists: false});
                    return;
                }
            });
    };

    facebookResponse = (response) => {
        const facebookIdExistsUrl = "http://127.0.0.1:5000/user/id/facebook/" + response.userID;
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
            });
    };

    handleOpen = () => {
        this.setState({facebookModalOpen: true});
    };

    handleClose = () => {
        this.setState({facebookModalOpen: false});
    };

    render () {
        let authRedirect = null;
        if (this.props.isAuthenticated && this.props.userInfo) {
            authRedirect = <Redirect to={this.props.authRedirectPath}/>;
            // this.props.history.push(this.props.authRedirectPath);
        }
        let warningDiv = <div></div>;
        if (!this.state.emailExists) {
            warningDiv = (
                <div className={styles.authWarningDiv}>
                    <Message attached="bottom" negative>
                        Email is not registered
                    </Message>
                </div>
            )
        } else if (this.props.wrongPassword) {
            warningDiv = (
                <div className={styles.authWarningDiv}>
                    <Message attached="bottom" negative>
                        Wrong password
                    </Message>
                </div>
            )
        }
        const signInDiv = (
            <Grid centered columns={3} verticalAlign="middle" style={{height: '100%'}}>
                <Grid.Column className={styles.signInForm}>
                    <Image src='https://store.storeimages.cdn-apple.com/4981/as-images.apple.com/is/image/AppleInc/aos/published/images/M/RR/MRRH2/MRRH2?wid=445&hei=445&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1525909183709' size='tiny' centered />
                    <div className={styles.signInHeader}>
                        Sign In
                    </div>
                    <div className={styles.signInSubHeader}>
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
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                type="password"
                                value={this.state.password}
                                onChange={this.passwordInputHandler}
                            />
                            <Button color="orange" fluid size="large" onClick={this.signInHandler}>
                                Sign In
                            </Button>
                        </Form>
                        { warningDiv }
                    </Segment>
                    <div className={styles.passwordRecoveryDiv}>
                        Forgot your password?
                    </div>
                    <div className={styles.orDiv}>Or</div>
                    <div className={styles.facebookButtonDiv}>
                        <FacebookLogin
                            appId={process.env.REACT_APP_FACEBOOK_API_KEY}
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={this.facebookResponse}
                            cssClass={styles.facebookButton}
                            textButton="Sign In With Facebook"
                            icon={<Icon name="facebook" size="small"/>}
                        />
                    </div>
                    <div className={styles.signUpDiv}>
                        Don't have an account yet?
                        <span className={styles.signUpLink} onClick={this.props.signUpClickHandler}>
                            Sign Up!
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
                { signInDiv }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        isAuthenticated: state.auth.isAuthenticated,
        authRedirectPath: state.auth.authRedirectPath,
        wrongPassword: state.auth.wrongPassword,
        userInfo: state.auth.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch(auth(email, password)),
        onAuthFacebook: (accessToken) => dispatch(authFacebook(accessToken))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);