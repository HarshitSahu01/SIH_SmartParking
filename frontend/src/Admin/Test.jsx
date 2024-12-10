import React from 'react'
import axios from 'axios'
import { getCookie } from '../assets/scripts/utils'

export default function Test() {
    const getCSRFToken = () => {
        return getCookie('csrftoken')
    }

    // Login function
    const login = () => {
        axios.post('http://localhost:8000/login', {
            username: 'user2',
            password: 'password'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),  // Include CSRF token
            },
            withCredentials: true  // Include cookies (sessionid)
        }).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error.response)
        })
    }

    // Logout function
    const logout = () => {
        axios.post('http://localhost:8000/logout', {}, {  // Empty body
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),  // Include CSRF token
            },
            withCredentials: true  // Include cookies (sessionid)
        }).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error.response)
        })
    }

    // Ping function to check session status
    const ping = () => {
        axios.get('http://localhost:8000/ping', {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),  // Include CSRF token
            },
            withCredentials: true  // Include cookies (sessionid)
        }).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error.response)
        })
    }

    return (
        <div>
            <button onClick={login}>Click to login</button>
            <br />
            <button onClick={logout}>Click to logout</button>
            <br />
            <button onClick={ping}>Click to ping</button>
            <br />
            {getCookie('csrftoken')}
        </div>
    )
}
