import React,{useState} from 'react'
import IconBtn from "../../../common/IconButton"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {changePassword} from "../../../../services/operations/settingsAPI"
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const UpdatePassword = () => {
  const {token} = useSelector((state)=>state.auth);
  const navigate = useNavigate();
  const dispatch  = useDispatch();
  const [showOldPassword,setShowOldPassword] = useState(false);
  const [showNewPassword,setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState : {errors},
  } = useForm();

  const submitPasswordForm = async(data) =>{
    try {
      await dispatch(changePassword(token,data));
    } catch (error) {
      console.log("Error: ",error.message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
          <div className="flex flex-col gap-5 ">
            <div className="relative flex flex-col gap-2 lg:w-[98%]">
              <label htmlFor="oldPassword" className="lable-style">
                Current Password <sup className="text-pink-200">*</sup>
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter Current Password"
                className="form-style"
                {...register("oldPassword", { required: true })}
              />
              <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.oldPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
              )}
            </div>
            <div className="relative flex flex-col gap-2 lg:w-[98%]">
              <label htmlFor="newPassword" className="lable-style">
                New Password <sup className="text-pink-200">*</sup>
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
                className="form-style"
                {...register("newPassword", { required: true })}
              />
              <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.newPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your New Password.
                </span>
              )}
            </div>
            <div className="relative flex flex-col gap-2 lg:w-[98%]">
              <label htmlFor="confirmnewPassword" className="lable-style">
                Confirm New Password <sup className="text-pink-200">*</sup>
              </label>
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                name="confirmnewPassword"
                id="confirmnewPassword"
                placeholder="Confirm New Password"
                className="form-style"
                {...register("confirmnewPassword", { 
                  required: "Please confirm your new password.",
                  validate: (value) => value === watch("newPassword") || "Passwords do not match"
                })}                
              />
              <span
                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showConfirmNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.confirmnewPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.confirmnewPassword.message}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile")
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Update" />
        </div>
      </form>
    </>
  )
}

export default UpdatePassword
