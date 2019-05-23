import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import styles from './UserInfoModal.module.css';
import { loadUser } from "../../../../store/actions/user";

class UserInfoModal extends Component  {
    componentDidMount() {
        if (!this.props.userInfo) {
            this.props.onLoadUserInfo(this.props.userId);
        }
    }

    render() {
        return (
            <div>
                <div className={styles.userInfoHeader}>
                    User Info
                </div>
                <Grid verticalAlign="middle">
                    <Grid.Row className={styles.userInfoRow}>
                        <Grid.Column width={4} textAlign="center">
                            <span className={styles.labelSpan}>Name</span>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <div className={styles.infoDiv}>
                                {this.props.userInfo ? this.props.userInfo.name : null}
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={styles.userInfoRow}>
                        <Grid.Column width={4} textAlign="center">
                            <span className={styles.labelSpan}>Location</span>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <div className={styles.infoDiv}>
                                {this.props.userInfo ? this.props.userInfo.location : null}
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <div className={styles.userFooter}>

                </div>
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
        onLoadUserInfo: (userId) => dispatch(loadUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoModal);
