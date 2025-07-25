import React from 'react'
import Signin from './Signin'
import Signup from './Signup'
const Signin_Signup = () => {
    return (
        <div className='flex flex-col md:flex-row justify-center items-center h-screen'>
            <div className='w-full h-full md:w-1/2 '>
                {/* <Signup /> */}
                <img src="../../../public/signin.jpg" alt="TawfirAI Logo" className='w-full h-full' />
            </div>
            <div className='w-full md:w-1/2' >
                <Signin />
            </div>
        </div>
    )
}

export default Signin_Signup
