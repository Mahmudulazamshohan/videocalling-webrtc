import React from "react";
class UserInformation extends React.Component{
    constructor() {
        super();
    }
    render() {
        const {user } =this.props
        return (
            <div className="user-information">
                <div className="user-information-header">
                    <p>
                        User
                    </p>
                </div>
                <div className="user-information-content">
                    Name: {user.username}
                </div>

            </div>
        )
    }
}



export default UserInformation
