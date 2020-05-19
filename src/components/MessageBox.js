import React from "react";
import {Button, Icon} from "semantic-ui-react";
class MessageBox extends React.Component{
    state ={
        messages:[],
        messageText:''
    }
    constructor() {
        super();
        this.onMessageWrite = this.onMessageWrite.bind(this)
        this.onSendMessage = this.onSendMessage.bind(this)
    }
    onMessageWrite(event){
        this.setState({
            messageText:event.target.value
        })
    }
    onSendMessage(){
        var message = {
            usertype:Math.floor(Math.random() * 2)  %2 ==0 ?'from':'to',
            name:"Mahmudul Azam",
            message:this.state.messageText
        }
        this.setState({
            message:''
        })
        if(this.state.messageText){
            this.setState({
                messages:[...this.state.messages,message]
            })
        }

    }
    render() {
        const {onMessageWrite,onSendMessage} =this
        return (
            <div className="message-box">
                <div className="message-box-header">
                    <p>
                        Message Box
                    </p>
                </div>
                <div className="message-box-area">
                    {this.state.messages.map(message=>{
                        return (
                            <div>
                                <div className={`message-box-area-text ${message.usertype =='from' ? 'box-from':'box-to'}`}>
                                    <img src="https://react.semantic-ui.com/images/avatar/small/rachel.png" alt="" className="image"/>
                                    <div className="flex">
                                        <div className="box">
                                            {message.message}
                                        </div>
                                    </div>

                                </div>
                            </div>

                        )
                    })}

                </div>
                <div className="message-box-footer">
                    <div className="input-box">
                        <div className="text-area">
                            <textarea type="text" onChange={onMessageWrite}></textarea>
                            <button>
                                <Icon name="attach"/>
                            </button>
                        </div>

                        <div className="send-button">
                            <Button circular positive onClick={onSendMessage}>
                                <Icon name="send"/>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
export default MessageBox
