import React, { Component } from 'react';

import Aux from '../Aux/Aux';

class Layout extends Component {
    render() {
        return (
            <Aux>
                <div>
                    {this.props.children}
                </div>
            </Aux>
        );
    }
}

export default Layout;