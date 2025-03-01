import React from 'react'
import { sidebarLinks } from '../../../data/dashboard-links';
import {logout} from "../../../services/operations/authAPI"
import { useSelector } from 'react-redux';
import SidebarLink from './SidebarLink';
const SideBar = () => {
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

          

        </div>
      </div>
    </div>
  )
}

export default SideBar
