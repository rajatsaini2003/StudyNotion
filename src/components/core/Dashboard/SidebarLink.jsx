import React from 'react'
import * as Icons from "react-icons/vsc"
import { useDispatch } from 'react-redux';
import { matchPath, NavLink, useLocation } from 'react-router-dom';

const SidebarLink = ({link,iconName}) => {
  const Icon = Icons[iconName] || Icons.VscQuestion; // Use a fallback icon

  //console.log("iconName:", iconName, "Icon:", Icons[iconName]);

  const location = useLocation();
  const dispatch = useDispatch();

  const matchRoute = (route)=>{
    return matchPath({path:route},location.pathname);
  }
  return (
    <NavLink
    to={link.path}
    className={` relative px-8 text-white py-2 text-sm font-medium  ${matchRoute(link.path) ? "bg-yellow-700" : "bg-opacity-0"}`}
    // onClick={}
    >
      <span
      className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${
        matchRoute(link.path) ? "opacity-100" : "opacity-0"
      }`}
      ></span>

      <div className='flex items-center gap-x-2'>
        <Icon className="text-lg"/>
        <span>{link.name}</span>

      </div>

    </NavLink>
  )
}

export default SidebarLink
