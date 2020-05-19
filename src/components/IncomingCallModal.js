import React from "react";
import {Button, Icon, Modal} from "semantic-ui-react";
import CallImg from '../assets/call.png'

class IncomingCallModal extends React.Component {

    render() {
        const {open, incomingCallModelClose, incomingCallReject, incomingCallReceive} = this.props
        return (
            <Modal size="mini" open={open} onClose={incomingCallModelClose}>
                <Modal.Content>
                    <div>
                        <div className="caller-amimation">
                            <img className="img-circle" src={CallImg} alt="" width="135"/>
                        </div>
                    </div>

                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={incomingCallReject}>
                        <Icon name="call"/>
                    </Button>
                    <Button positive onClick={incomingCallReceive}>
                        <Icon name="call"/>
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default IncomingCallModal
