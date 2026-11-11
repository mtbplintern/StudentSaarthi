import React, { useEffect, useState } from 'react'
import { ArrowRight, Users, BriefcaseBusiness } from 'lucide-react'
import { data, useNavigate } from 'react-router-dom'
import Footer from '../Component/Footer'
import toast from 'react-hot-toast'
import axios from 'axios'
import { backendurl } from '../config'
import Loading from '../Component/Loading'

import Jobpage from '../Component/Jobpage'

export default function Webpage () {
  const navigate = useNavigate()

  const [Jobs, setJobs] = useState([])

  const [loading, setLoading] = useState(false)

  const GetJobsDetail = async (pageNo = 1) => {
    try {
      setLoading(true)

      const request = await axios.get(
        `${backendurl}/data/jobdetail?limit=20&page=${pageNo}`
      )

      if (request.data.success) {
        const newJobs = request.data.jobs
        setJobs(newJobs)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    GetJobsDetail(1)
  }, [])

  return loading ? (
    <Loading />
  ) : (
    <div className='min-h-screen   text-gray-800'>
      <section className=' '>
        <div className='sm:max-w-[90%] mx-auto px-6 py-6 sm:py-10 text-center'>
         
          <h1 className='text-3xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto'>
            Find the job that
            <span className='text-red-600'> fits your life.</span>
          </h1>

          <p className='text-gray-500 mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-lg'>
            Explore thousands of job opportunities from top companies. Your next
            career move starts here.
          </p>
        </div>
      </section>

      <div className='border-2 border-gray-100' />

      {/* Featured Jobs */}
      <section id='jobs' className='bg-white py-6 sm:py-15'>
        <div className='xl:max-w-[90%] mx-auto sm:px-6 px-3'>
          <div className='flex sm:flex-row flex-col justify-between   mb-5 sm:mb-10'>
            <div>
              <p className='text-red-600 font-semibold text-sm  sm:block hidden'>
                FEATURED JOBS
              </p>
              <h2 className='sm:text-3xl text-xl font-bold md:mt-2'>
                Latest Job Openings
              </h2>
              <p className='text-gray-500 mt-2  sm:block hidden'>
                Discover exciting opportunities from top companies.
              </p>
            </div>

            <button
              onClick={() => navigate('/all-job')}
              className=' flex items-center gap-2 text-red-600 font-semibold self-end'
            >
              {loading ? 'Loading...' : '  View all Jobs'}{' '}
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Job Cards */}
          {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-7'>
            {Jobs.map((job, i) => (
              <Jobmodal job={job} key={i} />
            ))}
          </div> */}

          <div className='flex flex-col justify-center items-center gap-4 sm:gap-5'>
            {Jobs.length > 0 &&
              Jobs.map((job, i) => (
                <Jobpage finaljobdata={job} jobKey={i + 1} key={i} />
              ))}
          </div>

          {/* Empty State */}
          {Jobs.length === 0 && (
            <div
              className='bg-white rounded-xl sm:rounded-2xl border
      border-gray-100 p-6 sm:p-16 text-center'
            >
              <div
                className='w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-red-50
        text-red-500 flex items-center justify-center mx-auto mb-4'
              >
                <BriefcaseBusiness size={28} />
              </div>

              <h3 className='text-lg sm:text-xl font-bold text-gray-900'>
                No Jobs Found
              </h3>

              <p className='text-gray-500 text-sm mt-2'>
                No jobs match your search. Try another keyword .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section id='about' className='sm:max-w-[90%] mx-auto px-6 py-8 sm:py-15'>
        <div className='bg-red-600 rounded-3xl p-8 md:p-16 text-center text-white'>
          <Users size={40} className='mx-auto mb-5' />
          <h2 className='text-2xl md:text-4xl font-bold'>
            Ready to find your dream job?
          </h2>
          <p className='text-red-100 mt-4 max-w-xl mx-auto'>
            Explore opportunities, and take the next step toward your dream
            career.
          </p>
          <button
            onClick={() => navigate('/all-job')}
            className='bg-white  text-red-600 px-8 py-3 rounded-xl font-bold mt-8 hover:bg-gray-100'
          >
            Get Started <ArrowRight className='inline ml-2' size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
function Detail ({ icon, label, text }) {
  return (
    <div className='flex items-center gap-2 text-gray-600 min-w-0'>
      <span className='text-red-600 shrink-0'>{icon}</span>

      <div className='flex flex-col min-w-0'>
        <span className='text-xs text-gray-400 font-medium'>{label}</span>

        <span className='text-sm font-semibold text-gray-800 truncate'>
          {text || 'Not Available'}
        </span>
      </div>
    </div>
  )
}
