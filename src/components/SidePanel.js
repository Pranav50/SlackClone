import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages'
import Starred from './Starred';

export default class SidePanel extends Component {
    render() {
        const { currentUser, primaryColor } = this.props;
        return (
            <div>
                <Menu
                    size="large"
                    inverted
                    fixed="left"
                    vertical
                    style={{ background: primaryColor, 
                    fontSize: '1.2rem', marginLeft: '4rem', width: '15rem'}}
                >
                    <UserPanel primaryColor={primaryColor} currentUser={currentUser}/>
                    <Starred currentUser={currentUser}/>
                    <Channels currentUser={currentUser}/>
                    <DirectMessages currentUser={currentUser} />
                </Menu>
            </div>
        )
    }
}
