import React from 'react'
import { useSelector } from 'react-redux'
import { FaCheck } from "react-icons/fa"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import CourseInformationForm from "./CourseInformation/CourseInformationForm.js"
import PublishCourse from "./PublishCourse"
const RenderSteps = () => {
    const {step} = useSelector((state)=> state.course)
    //console.log("Step", step)
    const steps = [ 
        {id:1,
        title: "Course Information"},
        {
            id: 2,
            title: "Course Builder",
          },
          {
            id: 3,
            title: "Publish",
          }
    ]
  return (
    <>
        <div className="relative mb-2 flex w-full justify-center ">
            {steps.map((item)=> (
                < div 
                className='flex'
                key={item.id}>  
                {/* Step Circle */}
                    <div className="flex flex-col items-center " >
                        <button
                        className={`cursor-default aspect-square w-[34px]
                         place-items-center rounded-full border-[1px] 
                         ${step === item.id ? ' border-yellow-50 bg-yellow-900 text-yellow-50' 
                         : ' border-richblack-700 bg-richblack-800 text-richblack-300'}
                         ${step > item.id ? ' bg-yellow-50' :'text-yellow-50'}`}
                         >
                            {step > item.id ? (
                                <FaCheck className='font-bold text-richblack-900'/>
                            ) : 
                            (item.id)}
                        </button>
                    </div>
                {/* Dotted Line */}
                    {item.id !== steps.length && (
                        <div className="flex items-center justify-center">
                            <div
                                className={`h-[2px] w-[130px] ${
                                    step > item.id ? "bg-yellow-50" : "bg-richblack-700"
                                }`}
                            ></div>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Steps titles */}
      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <div key={item.id}>
            <div
              className="flex min-w-[130px] flex-col items-center gap-y-2" 
            >
              <p
                className={`text-sm ${
                  step >= item.id ? "text-richblack-5" : "text-richblack-500"
                }`}
              >
                {item.title}
              </p>
            </div>
            
          </div>
        ))}
      </div>

      {/* Render specific component based on current step */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 &&  <PublishCourse /> }

    </>
  )
}

export default RenderSteps