import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Image, Button, List } from 'semantic-ui-react';

import axios from '../../../shared/axios';
import styles from './Suggestion.module.css';
import { loadAuthUser } from "../../../store/actions/auth";
import SiteHeader from "../../SiteHeader/SiteHeader";
import SuggestedUser from './SuggestedUser/SuggestedUser';

class Suggestion extends Component {
    state = {
        suggestArr: null
    };

    componentDidMount() {
        if (!this.props.authUserInfo) {
            this.props.onLoadAuthUser(this.props.authUserId);
        }
        if (!this.state.suggestArr) {
            const url = "/user/suggest_follow";
            axios({method: 'GET', url: url})
                .then(response => {
                    this.setState({suggestArr: response.data.userIdArr});
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    followClickHandler = (userId) => {
        const url = "/user/follow/" + userId;
        axios({method: 'POST', url: url})
            .then(response => {
                this.setState({
                    suggestArr: this.state.suggestArr.filter((followId) => {
                        return followId !== userId
                    })
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    ignoreClickHandler = (userId) => {
        const url = "/user/ignore/" + userId;
        axios({method: 'POST', url: url})
            .then(response => {
                this.setState({
                    suggestArr: this.state.suggestArr.filter((ignoreId) => {
                        return ignoreId !== userId
                    })
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        let renderDiv, suggestedUserArr, suggestionDiv;
        if (this.state.suggestArr) {
            if (this.state.suggestArr.length > 0) {
                suggestedUserArr = this.state.suggestArr.map((userId, idx) => {
                    return (
                        <SuggestedUser
                            key={idx}
                            userId={userId}
                            followClickHandler={this.followClickHandler}
                            ignoreClickHandler={this.ignoreClickHandler}
                        />
                    )
                });
            } else {
                suggestedUserArr = (
                    <div className={styles.noSuggestionDiv}>
                        There is none at the moment.
                    </div>
                )
            }
        }

        if (this.props.authUserInfo) {
            const siteHeader = <SiteHeader contextRef={this.contextRef} userInfo={this.props.authUserInfo}/>;
            if (this.state.suggestArr) {
                suggestionDiv = (
                    <div className={styles.suggestionDiv}>
                        <div className={styles.suggestionHeader}>
                            Users Suggested to Follow
                        </div>
                        <Grid verticalAlign="middle">
                        { suggestedUserArr }
                        </Grid>
                    </div>
                );
            }

            renderDiv = (
                <div className={styles.suggestionPageDiv}>
                    { siteHeader }
                    { suggestionDiv }
                </div>
            )
        }
        return (
            <div>
                { renderDiv }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUserInfo: state.auth.authUserInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadAuthUser: (userId) => dispatch(loadAuthUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Suggestion);