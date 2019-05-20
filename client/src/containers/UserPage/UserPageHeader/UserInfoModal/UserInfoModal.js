import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';

import styles from './UserInfoModal.module.css';
import { loadUser } from "../../../../store/actions/user";

class UserInfoModal extends Component  {
    componentDidMount() {
        if (!this.props.userInfo) {
            this.props.onLoadUserInfo(this.props.userId);
        }
    }

    render() {
        console.log(this.props.userId);
        return (
            <div>
                <div className={styles.userInfoHeader}>
                    User Info
                </div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                        </Grid.Column>
                        <Grid.Column>
                            {this.props.userInfo ? this.props.userInfo.name : null}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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
