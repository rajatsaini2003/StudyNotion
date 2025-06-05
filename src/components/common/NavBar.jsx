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
import { useDispatch } from 'react-redux'
import { setLoading } from '../../slices/authSlice'
import { logout } from '../../services/operations/authAPI'
import { useNavigate } from 'react-router-dom'
import { ACCOUNT_TYPE } from '../../utils/constants'
const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {token}=useSelector((state)=>state.auth);
    const {user}=useSelector((state)=>state.profile);
    const location = useLocation();
    const {totalItems} = useSelector((state)=>state.cart);
    const {loading} = useSelector((state)=>state.auth);
    const [subLinks, setSubLinks] = useState([]);
    const fetchCategories = async () => {
        dispatch(setLoading(true));
    
        try {
            //const startTime = Date.now(); // Record start time
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            setSubLinks(res.data.allCategory);
    
            // const elapsedTime = Date.now() - startTime;
            // const minLoadingTime = 5000; // Ensure loader is visible for at least 1 second
    
            // if (elapsedTime < minLoadingTime) {
            //     await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
            // }
        } catch (error) {
            console.error(error);
        }

        dispatch(setLoading(false));
    };
    
    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line
        if (new Date(user?.tokenExpiresAt).getTime() < Date.now()) {
            dispatch(logout(navigate));
        }
        else{
            console.log("token ok")
        }
    }, []);

    const matchRoute = (route) => {
        return location.pathname === route;
    };
  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblue-700'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
            <Link to='/' >
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
                        (NavbarLinks.map((link,index)=>{
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
                                            group-hover:opacity-100 lg:min-w-[150px] z-10 justify-center items-center'>
                                                <div className='absolute left-[50%] top-0 h-6 w-6 rotate-45 rounded bg-richblack-5
                                                translate-x-[80%] translate-y-[-45%]'>
                                                </div>
                                                {
                                                    loading
                                                    ?(
                                                        <div className="spinner"></div>
                                                    ):(
                                                        subLinks.length ? (
                                                        subLinks.map((subLink, index)=>(
                                                            <Link 
                                                            to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} 
                                                            key={index}
                                                            className=' hover:bg-richblack-100 gap-3 w-36 flex justify-center p-2 rounded-md items-center'>
                                                                {subLink.name}
                                                            </Link>
                                                        ))
                                                        ):(<div></div>)
                                                    )
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
                        }))
                    }
                </ul>
            </nav>
            {/*LoginSignupDashBoard*/}
            <div className='flex gap-x-4 items-center'>
                {
                    user && user?.accountType === ACCOUNT_TYPE.STUDENT && (
                        <Link to='/dashboard/cart'
                        className='relative'>
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                            {totalItems > 0 && (
                                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-500">
                                {totalItems}
                                </span>
                            )}
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