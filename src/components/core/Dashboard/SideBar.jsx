import React, { useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links';
import {logout} from "../../../services/operations/authAPI"
import { useSelector } from 'react-redux';
import SidebarLink from './SidebarLink';
import { useNavigate } from 'react-router-dom';
import { VscSignOut } from 'react-icons/vsc';
import ConfirmationModal from '../../common/ConfirmationModal';


const SideBar = () => {
  const dispatch = useSelector();
  const navigate = useNavigate();
  const [confModal,setConfModal]=useState(null);
    const {user,loading:profileLoading} = useSelector((state)=>state.profile);
    const {loading:authLoading} = useSelector((state)=>state.auth);
    if(authLoading||profileLoading){
        return (
            <div className='spinner'></div>
        )
    }
  return (
    <div>
      <div className='flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 
      h-[calc(100vh-3.5rem)] bg-richblack-800 py-10'>
        <div className='flex flex-col'>
            {
                sidebarLinks.map((link,index)=>{
                    if(link.type && user?.accountType !== link.type)return null;
                    return (
                        <SidebarLink 
                        link={link} 
                        iconName={link.icon}
                        />
                    )
                })
            }
        </div>
        <div className='mx-auto mt-6 mb-6 h-[1px]' ></div>
        <div className='flex flex-col '>
          <SidebarLink
            link={{name:"Settings",path:"/dashboard/settings"}}
            iconName="VscSettingGear"
          />
          <button
          onClick={()=> setConfModal({
            text1:"Are you sure ?",
            text2:"You Will be logged out of your Account",
            btn1Text:"Logout",
            btn2Text:"Cancel",
            btn1Handler:()=>dispatch(logout(navigate)),
            btn2Handler:()=>setConfModal(null)
          })}
          className='text-sm font-medium text-richblack-300'
          >
            <div className='flex items-center gap-x-2'>
              <VscSignOut className='text-lg'/>
              <span>Logout</span>
            </div>

          </button>
        </div>
      </div>
      {
        confModal && <ConfirmationModal
        modalData={confModal}
        />
      }
    </div>
  )
}

export default SideBar
