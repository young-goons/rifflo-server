import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Segment, Message } from 'semantic-ui-react';

import axios from '../../../shared/axios';
import styles from './FacebookModal.module.css';
import { authFacebook } from '../../../store/actions/auth';
import { validateUsername } from "../../../shared/inputUtils";

class FacebookModal extends Component {
    state = {
        username: '',
        validUsername: true,
        invalidUsernameMessage: null,
        usernameExists: false
    };

    usernameInputHandler = (event) => {
        const usernameValidityObj = validateUsername(event.target.value);
        this.setState({
            username: event.target.value,
            validUsername: usernameValidityObj.valid,
            invalidUsernameMessage: usernameValidityObj.msg
        });
    };

    registerHandler = () => {
        if (this.state.validUsername) {
            const usernameExistsUrl = "/user/id/username/" + this.state.username;
            axios({method: 'GET', url: usernameExistsUrl})
                .then(response => {
                    if (response.data.userId) {
                        this.setState({usernameExists: true});
                        return;
                    } else {
                        this.setState({usernameExists: false});
                        const url = "/signup/facebook";
                        const requestParams = {
                            email: this.props.email,
                            username: this.state.username
                        };
                        const requestHeaders = {
                            'Facebook-Access-Token': this.props.accessToken
                        };
                        return axios({
                            method: 'POST',
                            url: url,
                            headers: requestHeaders,
                            params: requestParams
                        });
                    }
                })
                .then(response => {
                    if (response) {
                        this.props.onAuthFacebook(this.props.accessToken);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    render() {
        let warningDiv = <div></div>;
        if (!this.state.validUsername) {
            warningDiv = (
                <div className={styles.warningDiv}>
                    <Message attached="bottom" negative>
                        { this.state.invalidUsernameMessage }
                    </Message>
                </div>
            )
        } else if (this.state.usernameExists) {
            warningDiv = (
                <div className={styles.warningDiv}>
                    <Message attached="bottom" negative>
                        Username is already used
                    </Message>
                </div>
            );
        }

        return (
            <div>
                <div className={styles.modalHeader}>
                    Register your Username
                </div>
                <div className={styles.modalSubHeader}>
                    * Username can be changed later
                </div>
                <Segment>
                    <Form size="large">
                    <Form.Input
                        fluid
                        size="large"
                        icon="user"
                        iconPosition="left"
                        placeholder="Username"
                        value={this.state.username}
                        onChange={this.usernameInputHandler}
                    />
                    <Button color="orange" fluid size="large" onClick={this.registerHandler}>
                        Register
                    </Button>
                    </Form>
                    { warningDiv }
                </Segment>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuthFacebook: (accessToken) => dispatch(authFacebook(accessToken))
    };
};

export default connect(null, mapDispatchToProps)(FacebookModal);