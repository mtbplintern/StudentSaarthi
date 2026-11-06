import React, { useEffect, useState } from 'react'
import {
  MapPin,
  ArrowRight,
  Clock,
  Users,
  BriefcaseBusiness,
  CalendarDays,
  Eye,
  IndianRupee
} from 'lucide-react'
import { data, useNavigate } from 'react-router-dom'
import Footer from '../Component/Footer'
import toast from 'react-hot-toast'
import axios from 'axios'
import { backendurl } from '../config'
import Loading from '../Component/Loading'
import { IoIosShareAlt } from 'react-icons/io'
import Jobmodal from '../Component/Jobmodal'

export default function Webpage () {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const [Jobs, setJobs] = useState([])

  const [loading, setLoading] = useState(false)

  const GetJobs = async () => {
    try {
      setLoading(true)

      const request = await axios.get(
        `${backendurl}/data/jobs?limit=20&page=${1}`
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

  const filteredJobs = Jobs.filter(job => {
    const matchesSearch =
      job.job_title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.organization_name.toLowerCase().includes(search.toLowerCase())

    return matchesSearch
  })

  useEffect(() => {
    GetJobs()
  }, [])

  return loading ? (
    <Loading />
  ) : (
    <div className='min-h-screen   text-gray-800'>
      <section className=' '>
        <div className='sm:max-w-[90%] mx-auto px-6 py-8 sm:py-15 text-center'>
          <span className='inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 sm:mb-6'>
            🚀 Find your dream job today
          </span>

          <h1 className='text-3xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto'>
            Find the job that
            <span className='text-red-600'> fits your life.</span>
          </h1>

          <p className='text-gray-500 mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-lg'>
            Explore thousands of job opportunities from top companies. Your next
            career move starts here.
          </p>

          {/* Search Bar */}
          {/* <div className='bg-white shadow-xl rounded-2xl p-4 mt-5 sm:mt-8 max-w-4xl mx-auto flex   gap-3'>
            <Search className='text-red-600' size={22} />
            <input
              type='text'
              placeholder='Job title , location or keywords'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='outline-none w-full text-md'
            />
          </div> */}

          {/* <p className='text-sm text-gray-500 mt-5'>
            Popular: <span className='text-red-600'>React Developer</span>,
            <span className='text-red-600'> UI Designer</span>,
            <span className='text-red-600'> Marketing</span>
          </p> */}

          {/* Stats */}
          {/* <div className='grid  grid-cols-4 gap-4 sm:gap-8 mt-8 sm:mt-10 max-w-4xl mx-auto'>
            {[
              ['10K+', 'Active Jobs'],
              ['5K+', 'Companies'],
              ['20K+', 'Candidates'],
              ['95%', 'Success Rate']
            ].map(([number, label]) => (
              <div key={label}>
                <h3 className='text-2xl sm:text-3xl font-bold text-red-600'>{number}</h3>
                <p className='text-gray-500 text-[10px] md:text-sm mt-1'>{label}</p>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      <div className='border-2 border-gray-100' />

      {/* Featured Jobs */}
      <section id='jobs' className='bg-white py-10 sm:py-15'>
        <div className='xl:max-w-[90%] mx-auto px-6'>
          <div className='flex sm:flex-row flex-col justify-between items-end mb-6 sm:mb-10'>
            <div>
              <p className='text-red-600 font-semibold text-sm'>
                FEATURED JOBS
              </p>
              <h2 className='sm:text-3xl text-2xl font-bold mt-2'>
                Latest Job Openings
              </h2>
              <p className='text-gray-500 mt-2'>
                Discover exciting opportunities from top companies.
              </p>
            </div>

            <button
              onClick={() => navigate('/all-job')}
              className=' flex items-center gap-2 text-red-600 font-semibold'
            >
              {loading ? 'Loading...' : '  View all Jobs'}{' '}
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Job Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-7'>
            {filteredJobs.map((job, i) => (
              <Jobmodal job={job} key={i} />
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
