import React, { Component } from 'react';
import axios from 'axios/index';
import { NavLink } from 'react-router-dom';
import { Button, Form, Grid, Icon, Image, Segment } from 'semantic-ui-react';

import styles from './AuthPage.module.css';

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
        return (
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
    }
}

export default SignUpPage;