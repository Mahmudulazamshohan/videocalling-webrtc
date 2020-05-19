import React from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react'

const UserRegisterForm = ({onUsernameChanged}) => (
    <Form>
        <Form.Field>
            <label>Username</label>
            <input placeholder='Username' onChange={onUsernameChanged}/>
        </Form.Field>

    </Form>
)

export default UserRegisterForm
