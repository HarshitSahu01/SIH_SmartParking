import React from 'react'
import srch from "../assets/search.gif"
const LoadingSearch = () => {
  return (
    <div className='h-[100%] w-[100%] flex justify-center items-center'>
        <img src={srch} className='w-44 h-44' alt="searching" />
    </div>
  )
}

export default LoadingSearch