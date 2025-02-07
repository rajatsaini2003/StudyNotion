import React from 'react'
import Instructor from '../../../assets/Images/Instructor.png'
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'
const InstructorSection = () => {
  return (
    <div className='flex flex-row gap-20 items-center'>
        <div className='w-[50%]'>
            <img 
            src={Instructor} 
            alt="InstructorImage" 
            className='shadow-white shadow-[-20px_-20px_0px_0px]'/>
        </div>
        <div className='w-[50%] flex flex-col gap-10'>
            <div className='text-4xl flex flex-col font-semibold'>
                Become an 
                <HighlightText text={" Instructor"} />
            </div>
            <p className='font-medium text-[16px] w-[90%] text-richblack-200'>
            Instructors from around the world teach millions of 
            students on StudyNotion. We provide the tools and skills
            to teach what you love.
            </p>
            <div className='w-fit'>
                <CTAButton active={true} linkto={"/signup"}>
                    <div className='flex flex-row gap-2 items-center'>
                        Start Teaching Today
                        <FaArrowRight/>
                    </div>
                </CTAButton>
            </div>
        </div>
    </div>
  )
}

export default InstructorSection