import React, { Component } from 'react';
import { connect } from 'react-redux';

import PostEditor from './PostEditor/PostEditor';
import { parseJWT } from '../../shared/utils';

class UserPage extends Component {
    state = {
        jwtIdentity: null
    };

    componentDidMount() {
        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken) {
            this.setState({jwtIdentity: parseJWT(accessToken)['identity']});
        }
    }

    render() {
        const username = this.props.match.params.username;
        let postUploadDiv = <div></div>;
        if (this.state.jwtIdentity != null && this.state.jwtIdentity.username === username) {
            postUploadDiv = (
                <PostEditor/>
            );
        }
        return (
            <div>
                User Page
                {postUploadDiv}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.auth.userInfo
    };
};

export default connect(mapStateToProps)(UserPage);