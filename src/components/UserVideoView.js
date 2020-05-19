import React from "react";
import {Button, Icon} from "semantic-ui-react";

class UserVideoView extends React.Component {
    state = {
        isFullScreenEnable: false,
        soundEnable :true
    }

    constructor() {
        super();
        this.enableFullscreen = this.enableFullscreen.bind(this)
        this.onAudioPressed = this.onAudioPressed.bind(this)
    }

    componentDidMount() {

    }

    enableFullscreen() {
        this.setState({
            isFullScreenEnable: !this.state.isFullScreenEnable
        })
    }
    onAudioPressed(){
        const {localVideo, remoteVideo}  =this.props
        this.setState({
            soundEnable : !this.state.soundEnable
        })
        if(this.state.soundEnable){
            localVideo.current.muted = true
            remoteVideo.current.muted = true
        }else{
            localVideo.current.muted = false
            remoteVideo.current.muted = false
        }
    }
    render() {
        const {localVideo, remoteVideo, onPausePressed, onCallPressed} = this.props
        const {enableFullscreen,onAudioPressed} = this
        const {isFullScreenEnable,soundEnable} = this.state
        return (
            <div className={`user-video ${isFullScreenEnable ? 'video-fullscreen' : ''}`}>
                <div className="user-video-header">
                    <Button circular icon="call">
                    </Button>
                    <p>Incoming Call</p>
                    <div style={{width: '100% !important', flexGrow: 3}}>
                        <p style={{float: 'right'}} onClick={enableFullscreen}>
                            <Icon name={ !isFullScreenEnable ? 'expand' :'compress'}></Icon>
                        </p>
                    </div>

                </div>
                <div className="user-video-view">
                    <video className="user-video-view-remote" autoPlay ref={remoteVideo} id="remoteVideo"></video>
                    <video className="user-video-view-local" autoPlay ref={localVideo} id="localVideo" muted></video>
                    <div className="user-video-view-controls">
                        <Button circular color='green' icon='pause' onClick={onPausePressed}/>
                        <Button circular color='red' icon='call' onClick={onCallPressed}/>
                        <Button circular color='blue' icon={soundEnable ? 'volume up':'volume off'} onClick={onAudioPressed}/>
                    </div>
                    <div className="user-video-view-timer">
                        <p>{remoteVideo.current ? remoteVideo.current.currentTime > 0 ? "01231" : "00:00:00" :"00:00:00"  } </p>
                    </div>
                </div>
            </div>


        )
    }
}

export default UserVideoView
