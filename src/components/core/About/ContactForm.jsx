import React from 'react'
import ContactFormCommon from '../../common/ContactFormCommon'

const ContactForm = () => {
  return (
    <div className='mx-auto mb-10'>
        <h1 className='text-center text-4xl font-semibold'>
            Get in Touch
        </h1>
        <p className='text-center text-richblack-300 mt-3'>
            We'd love to hear from you. Please fill out this form
        </p>
        <div className='mt-12 mx-auto'>
            <ContactFormCommon/>
        </div>
    </div>
  )
}

export default ContactForm
