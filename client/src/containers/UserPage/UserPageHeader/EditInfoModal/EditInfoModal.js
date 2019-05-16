import React, { Component } from 'react';
import { Segment, Form, Button, Input, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';

import styles from './EditInfoModal.module.css';
import { loadUser } from "../../../../store/actions/auth";

class EditInfoModal extends Component {
    state = {
        username: this.props.username,
        usernameExists: false,
        needUpdate: false,
        updatedUserInfo: null
    };

    usernameInputHandler = (event) => {
        this.setState({username: event.target.value});
    };

    componentDidUpdate() {
        if (this.state.needUpdate) {
            const url = "http://127.0.0.1:5000/user/" + this.props.userId + "/info";
            const requestHeaders = {
                'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
            };
            axios({method: 'PUT', url: url, headers: requestHeaders, data: this.state.updatedUserInfo})
                .then(response => {
                    if (response.data.newUsername) {
                        this.props.history.push("/" + response.data.newUsername);
                        this.props.onLoadUser(this.props.userId);
                    }
                })
                .catch(error => {
                    alert(error);
                });
            this.props.handleClose();
        }
    }

    updateClickHandler = () => {
        const updatedUserInfo = {};
        if (this.state.username !== this.props.username) { // update username
            const usernameExistsUrl = "http://127.0.0.1:5000/user/id/username/" + this.state.username;
            axios({method: 'GET', url: usernameExistsUrl})
                .then(response => {
                    console.log(response);
                    if (response.data.userId) {
                        this.setState({usernameExists: true, needUpdate: false});
                    } else {
                        updatedUserInfo['username'] = this.state.username;
                        this.setState({
                            usernameExists: false,
                            needUpdate: true,
                            updatedUserInfo: updatedUserInfo
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    render() {
        let warningDiv;
        if (this.state.usernameExists) {
            warningDiv = (
                <div className={styles.authWarningDiv}>
                    <Message attached="bottom" negative>
                        Username is already used
                    </Message>
                </div>
            );
        }
        return (
            <div>
                <div className={styles.editInfoHeader}>
                    Edit User Info
                </div>
                <Segment>
                    <Form size="large">
                        <Form.Field inline>
                            <label><span className={styles.labelSpan}>Username</span></label>
                            <Input
                                icon="user"
                                iconPosition="left"
                                size="large"
                                placeholder="New Username"
                                value={this.state.username}
                                onChange={this.usernameInputHandler}
                            />
                        </Form.Field>
                        <Button color="orange" fluid size="large" onClick={this.updateClickHandler}>
                            Update User Info
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
        onLoadUser: (userId) => dispatch(loadUser(userId))
    };
};

export default connect(null, mapDispatchToProps)(EditInfoModal);