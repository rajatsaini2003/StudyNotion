import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
const ContactFormCore = () => {
  const [loading,setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitSuccessful}
  } = useForm();

  const submitContact = async(data)=>{

  }

  useEffect(()=> {
    if(isSubmitSuccessful){
      reset({
        email:"",
        firstname: "",
        lastname:"",
        message:"",
        phoneNo:""
      })
    }
  },[isSubmitSuccessful, reset]);
  return (
    <form 
    className=' flex flex-col gap-7'
    onSubmit={handleSubmit(submitContact)}>
        <div className='flex flex-col gap-5 lg:flex-row'>
          {/* first Name*/}
          <div className='flex flex-col gap-2 lg:w-[48%]'>
            <label htmlFor='firstname' >First Name</label>
            <input
            type="text"
            name='firstname'
            id='firstname'
            placeholder='Enter first name'
            className='contact-form-style text-black'
            {...register("firstname",{required:true})}
            />
            {
              errors.firstname && (
                <span>
                  Please enter your first name
                </span>
              )
            }
          </div>

          {/* last Name*/}
          <div className='flex flex-col gap-2 lg:w-[48%]'>
            <label className='text-sm' htmlFor='lastname'>
              Last Name
            </label>
            <input
            type="text"
            name='lastname'
            id='lastname'
            className='text-black contact-form-style'
            placeholder='Enter Last name'
            {...register("lastname")}
            />
          </div>
        </div>

        {/*email*/}
        <div className='flex flex-col gap-2'>
          <label className=' text-sm' htmlFor='email'>Email Address</label>
          <input
          type = 'email'
          name='email'
          id='email'
          className='text-black contact-form-style'
          placeholder='Enter email address'
          {...register("email",{required:true})}
          />
          {
              errors.email && (
                <span>
                  Please enter your Email
                </span>
              )
            }
        </div>

        {/*Message*/}
        <div className='flex flex-col gap-2'>
          <label className='text-sm' htmlFor='message'>Message</label>
          <textarea 
          name="message" 
          id="message"
          cols="30"
          rows="7"
          className='contact-form-style'
          placeholder='Enter Your Message'
          {...register("message",{required:true})}
          />
          {
            errors.message && (
              <span>
                  Please enter your message
              </span>
            )
          }
        </div>
        <button type='submit'
          className='rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
          transition-all duration-200 hover:scale-95 hover:shadow-none  disabled:bg-richblack-500 sm:text-[16px] '>
          Send Message
        </button>
    </form>
  )
}

export default ContactFormCore
