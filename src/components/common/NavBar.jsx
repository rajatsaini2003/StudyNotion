import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { NavbarLinks } from '../../data/navbar-links'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { IoIosArrowDropdown } from 'react-icons/io'

const NavBar = () => {

    const {token}=useSelector((state)=>state.auth);
    const {user}=useSelector((state)=>state.profile);
    const {totalItems} = useSelector((state)=>state.cart);

    const [subLinks, setSubLinks] = useState([]);
    const fetchCategories = async () => {
        try {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            setSubLinks(res.data.allCategory)
            
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchCategories();
        console.log(subLinks);
    }, []);
    // const subLinks=[
    //     {name: "Category1",link:"/category/category1"},
    //     {name: "Category2",link:"/category/category2"},
    //     {name: "Category3",link:"/category/category3"}
    // ]

    const location = useLocation();
    const matchRoute =(route)=>{
        return matchPath({path: route}, location.pathname);
    }
  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblue-700'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
            <Link to='/'>
                <img src={logo} 
                alt="StudyNotion" 
                width={160}
                height={42}
                loading='lazy'/>
            </Link>
            {/** nav links */}
            <nav>
                <ul className='flex flex-row gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map((link,index)=>{
                            return (
                                <li key={index}>
                                    {
                                        link?.title ==='Catalog' 
                                        ? (<div className=' flex items-center relative gap-2 group'>
                                            <p>{link?.title}</p>
                                            <IoIosArrowDropdown />
                                            <div className='invisible absolute left-[50%]  
                                            translate-x-[-50%] translate-y-[20%] top-[50%]
                                            flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                                            opacity-0 transition-all duration-200 group-hover:visible
                                            group-hover:opacity-100 lg:w-fit z-10 justify-center items-center'>
                                                <div className='absolute left-[50%] top-0 h-6 w-6 rotate-45 rounded bg-richblack-5
                                                translate-x-[80%] translate-y-[-45%]'>
                                                </div>
                                                {
                                                    subLinks.length ? (
                                                        
                                                        subLinks.map((subLink, index)=>(
                                                            <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} key={index}
                                                            className=' hover:bg-richblack-100 gap-3 w-36 flex justify-center p-2 rounded-md items-center'>
                                                                {subLink.name}
                                                            </Link>
                                                        ))
                                                        
                                                    ):(<div></div>)
                                                }

                                            </div>
                                        </div>)
                                        :(
                                            <Link to={link?.path}>
                                                <p className={`${matchRoute(link?.path)?"text-yellow-5":"text-richblack-25"}`}>
                                                    {link?.title}
                                                </p>
                                            </Link>
                                        )
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
            {/*LoginSignupDashBoard*/}
            <div className='flex gap-x-4 items-center'>
                {
                    user && user?.accountType === 'Student' && (
                        <Link to='/dashboard/cart'
                        className='relative'>
                            <AiOutlineShoppingCart/>
                            {
                                totalItems>0 &&(
                                    <span>
                                        {totalItems}
                                    </span>
                                )
                            }
                        </Link>
                    )
                }
                {
                    token===null &&(
                        <Link to='/login'>
                            <button className='border-r-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                                text-richblack-100 rounded-md'>
                                Log In
                            </button>
                        </Link>
                    )
                }
                {
                    token===null &&(
                        <Link to='/signup'>
                            <button className='border-r-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                                text-richblack-100 rounded-md'>
                                Sign Up
                            </button>
                        </Link>
                    )
                }
                {
                    token!==null &&
                    <ProfileDropDown/>
                }
            </div>
        </div>
    </div>
  )
}

export default NavBar