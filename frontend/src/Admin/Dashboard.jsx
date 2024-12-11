import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { getCSRFToken, backendUrl } from '../assets/scripts/utils'

export default function Dashboard() {
  const logout = () => {
    axios.post(`${backendUrl()}/logout`,{}, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken()
      },
      withCredentials: true
    }).then((response) => {
      alert('log out done')
      console.log(response.data)
      navigate('/admin/login')  
    }).catch((error) => {
      console.log(error.response)
    })
  }
  return (
    <div>
      <button onClick={logout}>logout</button>
    </div>
  )
}
