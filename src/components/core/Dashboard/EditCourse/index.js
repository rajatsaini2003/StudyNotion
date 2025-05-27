import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import RenderSteps from '../AddCourse/RenderSteps';
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';
import { setCourse, setEditCourse } from '../../../../slices/courseSlice';

export default function EditCourse() {
    const dispatch = useDispatch();
    const {courseId} = useParams();
    const {course} = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const {token} = useSelector((state) => state.auth);
    const populateDetail = async () => {
        setLoading(true);
        const result  = await getFullDetailsOfCourse(courseId,token);
        if(result?.courseDetails){
            dispatch(setEditCourse(true));
            dispatch(setCourse(result?.courseDetails));
        }
        setLoading(false);
        setEditCourse(false);
    }
    useEffect(() => {
        populateDetail();
    },[])

    if(loading){
        return (
            <div className='flex justify-center items-center h-screen'>
                <div className="spinner"></div>
            </div>
        )
    }
    return (
        <div>
            <h1 className='text-white text-5xl flex items-center justify-center mb-9'>Edit Course 📝</h1>
            <div className='w-full  max-w-3xl mx-auto p-4 bg-richblack-800 rounded-lg shadow-lg'>
                {
                    course? (<RenderSteps/>):(<p>course not found</p>)
                }
            </div>
        </div>
    )   
}
