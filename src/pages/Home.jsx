import React from 'react'
import { Link } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from '../components/core/HomePage/CTAButton.jsx'
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks.jsx';
import Footer from '../components/common/Footer.jsx';
import TimeLineSection from '../components/core/HomePage/TimeLineSection.jsx';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection.jsx';
import InstructorSection from '../components/core/HomePage/InstructorSection.jsx';
import ExploreMore from '../components/core/HomePage/ExploreMore.jsx';
import RatingSlider from '../components/common/RatingSlider.jsx';
const Home = () => {
  return (
    <div>
      {/* Section 1 */}
      <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white 
      justify-between  '>
        <Link to='/signup'>
        <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 
        transition-all duration-200 hover:scale-95 w-fit '>
            <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] 
            transition-all duration-200 hover:scale-95 group-hover:bg-richblack-900'>
                <p>Become an Instructor </p>
                <FaArrowRight />
            </div>
        </div>
        </Link>
        <div className='text-center text-4xl font-semibold mt-7'>
          Empower Your Future with 
          <HighlightText text = {' Coding Skills'}/>
        </div>
        <div className='w-[90%] text-center mt-4 text-lg font-bold text-richblack-300'>
        With our online coding courses, you can learn at your own pace,
         from anywhere in the world, and get access to a wealth of 
         resources, including hands-on projects, quizzes, and 
         personalized feedback from instructors.
        </div>
        <div className='flex flex-row gap-7 mt-8'>
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>
        <div className='w-8/12'>
          <div className="relative mx-3 my-14 shadow-[50px_-30px_90px_-10px_rgba(59,130,246,0.5)]"> 
            <div className="absolute right-[-20px] bottom-[-20px]
            bg-white w-full h-full rounded">
            </div>
            <div className="relative">
              <video muted loop autoPlay>
                <source src={Banner} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
        

      {/* codesection 1*/}
      <div>
        <CodeBlocks 
        position ={"flex-col lg:flex-row"}
        heading = {
          <div className='text-4xl font font-semibold'>
            Unlock Your
            <HighlightText text={" coding potential "} />
            with out online courses
          </div>
        }
        subheading={
           "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
        }
        ctabtn1={
          {
            btntext:"try it yourself",
            linkto:"/signup",
            active: true
        }
        }
        ctabtn2={
          {
              btntext: "Learn More",
              linkto: "/login",
              active: false,
          }
         }
        codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> \n<a href="/two">Two</a>\n <a href="/three">Three</a></nav>\n</body>`}
        codeColor={"text-yellow-25"}
        bgGrad={<div className="codeblock1 absolute"></div>}
        />
      </div>
      {/* codesection 2*/}
       <div>
        <CodeBlocks 
        position ={" flex-col lg:flex-row-reverse"}
        heading = {
          <div className='text-4xl font font-semibold '>
            Unlock Your
            <HighlightText text={" coding potential "} />
            with out online courses
          </div>
        }
        subheading={
           "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
        }
        ctabtn1={
          {
            btntext:"try it yourself",
            linkto:"/signup",
            active: true
        }
        }
        ctabtn2={
          {
              btntext: "Learn More",
              linkto: "/login",
              active: false,
          }
         }
        codeblock={`import React from "react";\nimport CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
        codeColor={"text-blue-25"}
        bgGrad={<div className="codeblock2 absolute"></div>}
        />
       </div>
       <ExploreMore/>
      </div>

      {/* Section 2 */}
      <div className='bg-pure-greys-5 text-richblue-700' >
        <div className='homepage_bg lg:h-[333px] h-[100px]'>

         <div className='w-11/12 max-w-maxContent flex items-center justify-center gap-5 mx-auto'>
          <div className='hidden lg:block h-[450px]'></div>
            <div className='flex flex-row gap-7 text-white lg:mt-0 mt-8'>
              <CTAButton active={true} linkto="/signup">
                  <div className='flex flex-row items-center gap-3'>
                    Explore Full Catalog
                    <FaArrowRight />
                  </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                  <div>
                    Learn More
                  </div>
              </CTAButton>
            </div>
         </div>

        </div>
        <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5'>
          
          <div className='flex flex-row gap-5 mb-10 mt-20'>
            <div className='text-4xl font-semibold w-[45%]'>
              Get the Skills you need for a
              <HighlightText text={" job that is in demand"} />
            </div>
            <div className='flex flex-col gap-10 w-[40%] items-start'>
              <div className='text-[16px]'>
                The modern StudyNotion is the dictates its own terms. Today, to be 
                a competitive specialist requires more than professional skills.
              </div>
              <CTAButton active={true}>
                <div>
                  Learn More
                </div>
              </CTAButton>
            </div>
          </div>
          

          <TimeLineSection/>
         <LearningLanguageSection/>
        </div>

         
         
      </div>

      {/* Section 3 */}
      <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center pt-[100px] 
      justify-between gap-8 first-letter bg-richblack-900 text-white'>
        <InstructorSection/>

        <h2 className='text-center text-4xl font-semibold mt-10'> 
          Review Form Other Learners</h2>
        <RatingSlider/>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home;
