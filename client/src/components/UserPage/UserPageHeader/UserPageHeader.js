import React from 'react';
import { Grid, Image } from 'semantic-ui-react';

import styles from './UserPageHeader.module.css';
import backgroundImg from '../../../malibu_background.jpg'
import profileImg from '../../../yongkyun_profile_pic.jpg';

const UserPageHeader = (props) => {
    return (
        <Grid>
            <Grid.Row>
                <div className={styles.usernameDiv}>{props.userInfo.username}</div>
                <img src={profileImg} className={styles.profileImg}/>
                <Grid.Column width={16}>
                    <div className={styles.backgroundImgDiv}>
                        {/*<img className={styles.backgroundImg} src={backgroundImg}/>*/}
                        <Image fluid src={backgroundImg} className={styles.backgroundImg}/>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row centered className={styles.userPageMenuRow}>
                <Grid.Column width={3} textAlign="center">
                    <div className={styles.userPageLeftmostMenuEntry}>"</div>
                </Grid.Column>
                <Grid.Column width={3} textAlign="center" className={styles.userPageMenu}>
                    <div className={styles.userPageMenuEntry}>22 shares</div>
                </Grid.Column>
                <Grid.Column width={3} textAlign="center" className={styles.userPageMenu}>
                    <div className={styles.userPageMenuEntry}>3 playlists</div>
                </Grid.Column>
                <Grid.Column width={3} textAlign="center" className={styles.userPageMenu}>
                    <div className={styles.userPageMenuEntry}>213 followers</div>
                </Grid.Column>
                <Grid.Column width={3} textAlign="center" className={styles.userPageMenu}>
                    <div className={styles.userPageMenuEntry}>209 following</div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};

export default UserPageHeader;