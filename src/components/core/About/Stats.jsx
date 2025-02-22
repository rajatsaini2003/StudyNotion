import React from 'react'
import {StatsArray} from '../../../utils/constants'
const StatsComponent = () => {
  return (
    
        <div className='bg-richblack-700'>
            <div className='flex flex-col gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto '>
                  <div className='grid grid-cols-2 md:grid-cols-4 text-center'>
                       { StatsArray.map( (data, index) => {
                                return (
                                    
                                    <div key={index} className='flex flex-col py-10'>
                                    <h1 className='text-[30px] font-bold text-richblack-5'>
                                            {data.count}
                                        </h1>
                                        <h2 className='font-semibold text-[16px] text-richblack-500'>
                                            {data.label}
                                        </h2>
                                    </div>
                                    
                                )
                            } )}
                    </div>     
            </div>
        </div>
    
  )
}

export default StatsComponent