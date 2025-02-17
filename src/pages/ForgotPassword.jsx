import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authAPI';

const ForgotPassword = () => {
    const [mailSent,setMailSent] = useState(false);
    const[email,setEmail]=useState("");
    const {loading}=useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const handleOnSubmit = (e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setMailSent));
    }
  return (
    <div className='text-white flex justify-center items-center'>
        {
            loading?(
                <div>Loading...</div>
            ):(
                <div>
                    <h1>
                        {
                            !mailSent ? "Reset Your Password":"Check Your Email"
                        }
                    </h1>
                    <p>
                        {
                            !mailSent ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                            : `We have sent the reset password email to ${email}`
                        }
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        {
                            !mailSent &&(
                                <label>
                                    <p>Email Address</p>
                                    <input
                                    required
                                    type='email'
                                    name="email"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    placeholder='Enter your email address'
                                    />
                                </label>
                            )
                        }
                        <button
                        type="submit"
                        >
                            {
                                !mailSent ? "Reset Password": "Resend Email"
                            }
                        </button>
                        <div>
                            <Link to='/login'>
                            <p>Back to Login</p>
                            </Link>
                        </div>
                    </form>
                </div>
            )
        }
    </div>
  )
}

export default ForgotPassword