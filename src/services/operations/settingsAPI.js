import { toast } from "react-hot-toast"

import { updateProfilePicture,setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

export function updateDisplayPicture(token, formData) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      try {
        const response = await apiConnector(
          "PUT",
          UPDATE_DISPLAY_PICTURE_API,
          formData,
          {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        )
        console.log(
          "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
          response
        )
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        
        dispatch(updateProfilePicture(response.data.data))
        toast.success("Display Picture Updated Successfully")
      } catch (error) {
        console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
        toast.error("Could Not Update Display Picture")
      }
      toast.dismiss(toastId)
    }
  }

export function updateProfile(token, updatedProfileData) {
  return async (dispatch) =>{
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_PROFILE_API,
        updatedProfileData,
        {
          Authorization:`Bearer ${token}`
        }
      );
      console.log("update profile API response: " , response);
      if(!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.updatedUserDetails.image
        ? response.data.updatedUserDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
      dispatch(
        setUser({...response.data.updatedUserDetails,image:userImage})
      )
      localStorage.setItem("user", JSON.stringify(response.data.updatedUserDetails))
      toast.success("Profile updated successfully")
    } catch (error) {
      console.log("updateProfile API Error...........",error);
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}
export function changePassword(token,data){
  return async (dispatch) =>{
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", CHANGE_PASSWORD_API,data,{
        Authorization: `Bearer ${token}`
      })
      console.log("Change Password Api Response.....",response)
      if(!response.data.success){
        throw new Error(response.data.message)
      }
      toast.success("Password Changed Successfully")
    } catch (error) {
      console.log("CHANGE_PASSWORD_API API ERROR............", error)
      const message=error.response.data.message?error.response.data.message:error;
      toast.error(message);
  }
  toast.dismiss(toastId)
  }
}

export function deleteProfile(token,navigate){
  return async (dispatch) =>{
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("DELETE",DELETE_PROFILE_API,null,{
        Authorization: `Bearer ${token}`
      })
      console.log("Delete Profile API Response.....",response);
      if(!response.data.success){
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully");
      dispatch(logout(navigate));
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      const message=error.response.data.message?error.response.data.message:error;
      toast.error(message);
    }
    toast.dismiss(toastId)
  }
}