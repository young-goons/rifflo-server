import React, { Component } from 'react';
import { Button, Input, Message, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';

import styles from './EditInfoModal.module.css';
import { loadUser } from '../../../../store/actions/user';
import { loadAuthUser } from "../../../../store/actions/auth";

class EditInfoModal extends Component {
    state = {
        username: this.props.username,
        name: '',
        location: '',
        usernameExists: false,
        needUpdate: false,
        updatedUserInfo: null
    };

    usernameInputHandler = (event) => {
        this.setState({username: event.target.value});
    };

    nameInputHandler = (event) => {
        this.setState({name: event.target.value});
    };

    locationInputHandler = (event) => {
        this.setState({location: event.target.value});
    };

    componentDidMount() {
        if (!this.props.userInfo) {
            this.props.onLoadUserInfo(this.props.userId);
        } else {
            this.setState({
                name: this.props.userInfo.name,
                location: this.props.userInfo.location ? this.props.userInfo.location : ''
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userInfo && !this.props.userInfo) {
            this.setState({
                name: nextProps.userInfo.name ? nextProps.userInfo.name : '',
                location: nextProps.userInfo.location ? nextProps.userInfo.location : ''
            });
        }
    }

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
                        this.props.onLoadAuthUser(this.props.userId);
                    }
                    this.props.onLoadUserInfo(this.props.userId);
                })
                .catch(error => {
                    alert(error);
                });
            this.props.handleClose();
        }
    }

    getUpdatedUserInfo = () => {
        const updatedUserInfo = {};
        if (this.state.name !== this.props.userInfo.name) {
            updatedUserInfo['name'] = this.state.name;
        }
        if (this.state.location !== this.props.userInfo.location) {
            updatedUserInfo['location'] = this.state.location;
        }
        return updatedUserInfo;
    };

    updateClickHandler = () => {
        if (this.state.username !== this.props.username) { // update username
            const usernameExistsUrl = "http://127.0.0.1:5000/user/id/username/" + this.state.username;
            axios({method: 'GET', url: usernameExistsUrl})
                .then(response => {
                    console.log(response);
                    if (response.data.userId) {
                        this.setState({usernameExists: true, needUpdate: false});
                    } else {
                        const updatedUserInfo = this.getUpdatedUserInfo();
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
        } else {
            const updatedUserInfo = this.getUpdatedUserInfo();
            if (Object.keys(updatedUserInfo).length > 0) {
                this.setState({
                    needUpdate: true,
                    updatedUserInfo: updatedUserInfo
                });
            }
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
                <Grid verticalAlign="middle" textAlign="center">
                    <Grid.Row className={styles.editInfoRow}>
                        <Grid.Column width={4}>
                            <span className={styles.labelSpan}>Username</span>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <div className={styles.inputDiv}>
                                <Input
                                    size="large"
                                    placeholder="Username"
                                    value={this.state.username}
                                    onChange={this.usernameInputHandler}
                                    fluid
                                />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={styles.editInfoRow}>
                        <Grid.Column width={4}>
                            <span className={styles.labelSpan}>Name</span>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <div className={styles.inputDiv}>
                                <Input
                                    size="large"
                                    placeholder="Name of the User"
                                    value={this.state.name}
                                    onChange={this.nameInputHandler}
                                    fluid
                                />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={styles.editInfoRow}>
                        <Grid.Column width={4}>
                            <span className={styles.labelSpan}>Location</span>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <div className={styles.inputDiv}>
                                <Input
                                    size="large"
                                    placeholder="Location"
                                    value={this.state.location}
                                    onChange={this.locationInputHandler}
                                    fluid
                                />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <div className={styles.editButtonDiv}>
                    <Button color="orange" fluid size="large" onClick={this.updateClickHandler}>
                        Update User Info
                    </Button>
                </div>
                { warningDiv }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadUserInfo: (userId) => dispatch(loadUser(userId)),
        onLoadAuthUser: (userId) => dispatch(loadAuthUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditInfoModal);