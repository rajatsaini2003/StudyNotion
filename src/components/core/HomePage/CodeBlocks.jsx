import React from 'react'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'
const CodeBlocks = ({
    position, heading , subheading, ctabtn1 ,ctabtn2, bgGrad, codeColor
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10 `}>
      <div className='w-[100%] lg:w-[50%] flex flex-col gap-8 '>
        {heading}
        <div className='text-richblack-300 text-base font-bold w-[85%] -mt-3  '>
            {subheading}
        </div>
        <div className='flex gap-7 mt-7'>
            <CTAButton active = {ctabtn1.active} linkto = {ctabtn1.linkto}>
                <div className='flex gap-2 items-center'>
                    {ctabtn1.btntext}
                    <FaArrowRight />
                </div>
            </CTAButton>
            <CTAButton active = {ctabtn2.active} linkto = {ctabtn2.linkto}>
                {ctabtn2.btntext}
            </CTAButton>
            </div>
      </div>
    </div>
  )
}

export default CodeBlocks
