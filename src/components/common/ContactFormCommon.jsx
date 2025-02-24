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
    <form onSubmit={handleSubmit(submitContact)}>
      <div className='flex flex-col gap-14'>
        <div className='flex gap-5'>
          {/* first Name*/}
          <div>
            <label htmlFor='firstname' >First Name</label>
            <input
            type="text"
            name='firstname'
            id='firstname'
            placeholder='Enter first name'
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
          <div>
            <label htmlFor='lastname' >Last Name</label>
            <input
            type="text"
            name='lastname'
            id='lastname'
            placeholder='Enter Last name'
            {...register("lastname")}
            />
          </div>
        </div>

        {/*email*/}
        <div>
          <label htmlFor='email'>Email Address</label>
          <input
          type = 'email'
          name='email'
          id='email'
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
        <div>
          <label htmlFor='message'>Message</label>
          <textarea 
          name="message" 
          id="message"
          cols="30"
          rows="7"
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
        <button type='submit'>
          Send Message
        </button>
      </div>
    </form>
  )
}

export default ContactFormCore
