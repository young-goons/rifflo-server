import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { NavLink, Redirect } from 'react-router-dom';
import {Button, Form, Grid, Message, Icon, Image, Segment} from 'semantic-ui-react';

import { auth } from '../../store/actions/auth';
import styles from './AuthPage.module.css';

class SignInPage extends Component {
    state = {
        email: "",
        password: "",
        emailExists: true,
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

    render () {
        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath}/>;
        }
        let warningDiv = <div></div>;
        if (!this.state.emailExists) {
            warningDiv = (
                <div className={styles.authWarningDiv}>
                    <Message attached="bottom" warning>
                        Email is not registered
                    </Message>
                </div>
            )
        } else if (this.props.wrongPassword) {
            warningDiv = (
                <div className={styles.authWarningDiv}>
                    <Message attached="bottom" warning>
                        Wrong password
                    </Message>
                </div>
            )
        }
        const signInDiv = (
            <Grid centered columns={2} verticalAlign="middle" style={{height: '100%'}}>
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
                            <Button color="blue" fluid size="large" onClick={this.signInHandler}>
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
                        <Button color="facebook" fluid size="large">
                            <Icon name="facebook" size="small"/> Sign Up with Facebook
                        </Button>
                    </div>
                    <div className={styles.googleButtonDiv}>
                        <Button color="google plus" fluid size="large">
                            <Icon name="google" size="small"/> Sign Up with Google
                        </Button>
                    </div>
                    <div className={styles.signUpDiv}>
                        Don't have an account yet?
                        <NavLink to={'/signup'} className={styles.signUpLink}>Sign Up!</NavLink>
                    </div>
                </Grid.Column>
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
        wrongPassword: state.auth.wrongPassword
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch(auth(email, password)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);