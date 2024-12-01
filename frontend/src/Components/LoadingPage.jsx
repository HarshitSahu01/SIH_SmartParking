import React from 'react'
import video from '../assets/vecteezy_man-use-phone-on-car-vmake.mp4'
const LoadingPage = () => {
  return (
    <div className='min-h-screen min-w-screen bg-[#93B5F7] flex flex-col justify-center items-center'>
        <video className='w-96 h-80' src={video} autoPlay loop muted ></video>
        <h1 className='text-3xl'>Looking for your Spot...</h1>
    </div>
  )
}

export default LoadingPage