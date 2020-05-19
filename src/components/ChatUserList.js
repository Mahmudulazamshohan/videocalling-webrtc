import React from "react";
import {Button, Icon, Image, List} from "semantic-ui-react";
function generateRandormAvater() {

}
function ChatUserList ({users,makeCallPressed}){
    return (
        <div className="chat-user-list">
            <div className="chat-user-list-header">
                <p>Chats</p>
            </div>
            <div className="user-list">
                {users.map(user=>{
                    return (
                        <div className="user-list-items">
                            <div className="user-list-items-img">

                                <Image avatar
                                       size="mini"
                                       src='https://react.semantic-ui.com/images/avatar/small/rachel.png' />
                                <div className="dot">
                                </div>
                            </div>
                            <div className="user-list-content">
                                <p className="user-list-content-header">{user.username}</p>
                                <List horizontal className="user-list-content-action">
                                    <List.Item as='a'> <Button circular color='green' icon='video' onClick={makeCallPressed.bind(this,user)} /></List.Item>
                                    <List.Item as='a'> <Button circular color='orange' icon='call' /></List.Item>
                                    <List.Item as='a'> <Button circular color='grey' icon='envelope' /></List.Item>

                                </List>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

    )
}
export default ChatUserList
