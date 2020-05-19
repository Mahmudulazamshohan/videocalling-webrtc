import React from 'react';
import './App.css';
import io from 'socket.io-client'
import {Button, Grid, Modal} from "semantic-ui-react";
import './styles/index.scss'
import ChatUserList from "./components/ChatUserList";
import UserVideoView from "./components/UserVideoView";
import UserRegisterForm from "./components/UserRegisterForm";
import IncomingCallModal from "./components/IncomingCallModal";
import UserInformation from "./components/UserInformation";
import MessageBox from "./components/MessageBox";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            modal: {
                open: false,
                dimmer: null
            },
            user: {
                id: '',
                username: ''
            },
            target: {
                id: '',
            },
            incoming: {
                open: false
            },
            endPoint: "http://localhost:8010",
            desc: null,
            userList: [],
            view: 'message'
        }
        this.localVideo = React.createRef()
        this.remoteVideo = React.createRef()
        this.localStream = null
        this.socket = null
        this.pc = null
        this.configurations = {
            iceServers: [
                {
                    urls: "turn:numb.viagenie.ca",  // A TURN server
                    username: "njb61585@bcaoo.com",
                    credential: "njb61585@bcaoo.com"
                }
            ]
        }
        this.constraints = {
            audio: true,
            video: true
        }
        this.onPausePressed = this.onPausePressed.bind(this)
        this.onCallPressed = this.onCallPressed.bind(this)
        this.onAudioPressed = this.onAudioPressed.bind(this)
        this.onUsernameChanged = this.onUsernameChanged.bind(this)
        this.modalclose = this.modalclose.bind(this)
        this.makeCallPressed = this.makeCallPressed.bind(this)
        this.incomingCallModelClose = this.incomingCallModelClose.bind(this)
        this.incomingCallReject = this.incomingCallReject.bind(this)
        this.incomingCallReceive = this.incomingCallReceive.bind(this)
    }

    componentDidMount() {
        this.socket = io.connect(this.state.endPoint)
        this.pc = new RTCPeerConnection(this.configurations)
        this.showModalForm()
        this.socket.on('join-new-user', (userList) => {
            //console.log('join-new-user', userList)
            this.setState({
                userList
            })
        })
        this.socket.on('joined-users', (userList) => {
            this.setState({
                userList
            })
        })
        this.socket.on('incoming_call', (data) => {
            const {target} = data
            //this.pc = new RTCPeerConnection(this.configurations)
            if (target.id === this.socket.id) {
                setTimeout(()=>{
                    this.setState({
                        incoming: {
                            open: true
                        }
                    })
                },2000)

            }
        })
        this.socket.on('get_offer', async (data) => {
            const {desc, target, user} = data
            if (target.id === this.socket.id) {
                this.setState({
                    target: user
                })
                try {
                    if (desc.type === 'offer') {
                        this.setState({
                            desc
                        })
                        await this.pc.setRemoteDescription(desc)
                    }
                } catch (e) {
                    console.log('offer error ::::', e)
                }
            } else {
                console.log(`User ID ${target.id} not match `)
            }

        })
        this.socket.on('get_answer', async (data) => {
            const {desc, target} = data
            if (target.id === this.socket.id) {
                this.setState({
                    target
                })
                try {
                    if (desc.type === 'answer') {
                        await this.pc.setRemoteDescription(new RTCSessionDescription(desc))
                        console.log(`Get Answer :::`, desc)
                    }
                } catch (e) {
                    console.log('offer error ::::', e)
                }
            } else {
                console.log(`User ID ${target.id} not match `)
            }
        })
        this.socket.on('user-leave', async (userList) => {
            this.setState({
                userList
            })
        })
        this.pc.onnegotiationneeded = async () => {
            var {target, user} = this.state
            try {
                await this.pc.setLocalDescription(await this.pc.createOffer())
                this.socket.emit('send_offer', {
                    user,
                    target,
                    desc: this.pc.localDescription
                })
                this.socket.emit('message', {desc: this.pc.localDescription})
            } catch (err) {
                console.error(err)
            }
        }
        this.pc.onicecandidate = ({candidate}) => {
            this.socket.emit('send_candidate', {
                candidate,
                target: this.state.target
            })
            console.log('send candidate', {
                candidate,
                target: this.state.target
            })

            // this.socket.emit('send_candidate', {
            //     candidate,
            //     target: this.state.target
            // })
            //this.socket.emit('message', {candidate})
        }
        this.socket.on('get_candidate', async (data) => {
            const {candidate, target} = data
            console.log('candidate', candidate)
            if (candidate) {
                try {
                    await this.pc.addIceCandidate(new RTCIceCandidate(candidate))
                } catch (e) {
                    console.log('candidate error ::::', e)
                }
            }


        })
        this.pc.ontrack = (event) => {
            console.log('Remote Stream Got', event.streams[0])
            if (this.remoteVideo.current.srcObject) return
            try {
                this.remoteVideo.current.srcObject = event.streams[0]
                // eslint-disable-next-line no-unused-expressions
                // console.log(event.streams[0].getVideoTracks()[0].getSettings().height)
                // eslint-disable-next-line no-unused-expressions
                //console.log(event.streams[0].getVideoTracks()[0].getSettings().width)
                //console.log(event.streams[0].getVideoTracks()[0].getSettings().frameRate)
            } catch (e) {
                this.remoteVideo.current.src = window.URL.createObjectURL(event.streams[0])
                console.log('Remote Video Error', e)
            }

        }
    }

    showModalForm() {
        this.setState({
            modal: {
                open: true,
            }
        })
    }

    async startWebCam() {

        try {
            this.localStream =
                await navigator.mediaDevices.getUserMedia(this.constraints)
            this.localStream.getTracks().forEach((track) =>
                this.pc.addTrack(track, this.localStream))
            this.localVideo.current.srcObject = this.localStream
        } catch (err) {
            console.error(err)
        }
    }

    onPausePressed() {

    }

    onCallPressed() {

        this.localStream.getTracks().forEach(track => track.stop());
        this.pc.close()
        this.localVideo.current.src = ""
        this.setState({
            view:'message'
        })
    }

    onAudioPressed() {
        // alert('onAudioPressed')
    }

    onUsernameChanged(event) {
        this.setState({
            user: {
                username: event.target.value
            }
        })
    }

    modalShow(dimmer) {
        this.setState({modal: {dimmer, open: true}})
    }

    modalclose() {
        if (this.state.user.username !== '') {
            this.setState({
                user: {
                    id: this.socket.id,
                    username: this.state.user.username
                },
                modal: {open: false}
            })
            this.socket.emit('created', this.state.user)
        }

    }

    async makeCallPressed(target) {
        if (target.id === this.socket.id) {
            alert('You can select you own')
        } else {
            this.setState({
                target,
                view: 'video'
            })
            this.socket.emit('outgoing_call', {target})
            await this.startWebCam()
        }

    }

    incomingCallModelClose() {
        this.setState({
            incoming: {
                open: false
            }
        })
    }

    incomingCallReject() {

    }

    async incomingCallReceive() {
        this.setState({
            incoming: {open: false},
            view: 'video'
        })
        this.localStream =
            await navigator.mediaDevices.getUserMedia(this.constraints)
        this.localStream.getTracks().forEach((track) =>
            this.pc.addTrack(track, this.localStream))
        this.localVideo.current.srcObject = this.localStream
        await this.pc.setLocalDescription(await this.pc.createAnswer())
        this.socket.emit('send_answer', {
            target: this.state.target,
            user: this.state.user,
            desc: this.pc.localDescription
        })


    }

    render() {
        const {userList, modal, user, incoming, view} = this.state
        const {
            onPausePressed,
            onCallPressed,
            onAudioPressed,
            modalShow
            , modalclose,
            onUsernameChanged,
            makeCallPressed,
            incomingCallModelClose,
            incomingCallReject,
            incomingCallReceive
        } = this

        return (
            <div className="App">
                <div className="user-panel">
                    <Grid columns={3}>
                        <Grid.Column computer={4} tablet={4} mobile={16}>
                            <UserInformation user={user}/>
                            <ChatUserList users={userList} makeCallPressed={makeCallPressed}/>
                        </Grid.Column>
                        <Grid.Column computer={12} tablet={4} mobile={16}>
                            <div className={`${view === 'video' ? 'show-component' : 'hide-component'}`}>
                                <UserVideoView localVideo={this.localVideo}
                                               remoteVideo={this.remoteVideo}
                                               onPausePressed={onPausePressed}
                                               onCallPressed={onCallPressed}
                                               onAudioPressed={onAudioPressed}
                                /> }
                            </div>
                            <div className={`${view === 'message' ? 'show-component' : 'hide-component'}`}>
                                <MessageBox/>
                            </div>
                        </Grid.Column>
                    </Grid>
                    <Modal dimmer={modal.dimmer} open={modal.open} onClose={modalclose}>
                        <Modal.Header>User Register</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <UserRegisterForm onUsernameChanged={onUsernameChanged}/>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button
                                color="green"
                                icon='checkmark'
                                labelPosition='right'
                                content="Start now"
                                onClick={modalclose}
                            />
                        </Modal.Actions>
                    </Modal>
                    <IncomingCallModal open={incoming.open}
                                       close={incomingCallModelClose}
                                       incomingCallReject={incomingCallReject}
                                       incomingCallReceive={incomingCallReceive}

                    />

                </div>

            </div>
        );
    }


}

export default App;
