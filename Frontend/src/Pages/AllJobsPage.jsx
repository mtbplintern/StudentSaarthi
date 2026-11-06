import axios from 'axios'
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  Eye,
  IndianRupee,
  MapPin,
  Users
} from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { backendurl } from '../config'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Loading from '../Component/Loading'
import { IoIosShareAlt } from 'react-icons/io'
import Jobmodal from '../Component/Jobmodal'

export default function AllJobsPage () {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('All Jobs')
  const [Jobs, setJobs] = useState([])

  const GetJobs = async (pageNo = 1) => {
    try {
      setLoading(true)

      const request = await axios.get(
        `${backendurl}/data/jobs?limit=20&page=${pageNo}`
      )

      if (request.data.success) {
        const newJobs = request.data.jobs

        setJobs(prev => (pageNo === 1 ? newJobs : [...prev, ...newJobs]))

        setHasMore(newJobs.length === 20)
        setPage(pageNo)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const GetSerchJob = async (pageNo = 1) => {
    try {
      setLoading(true)

      const request = await axios.get(`${backendurl}/data/serch-jobs`, {
        params: {
          limit: 20,
          page: pageNo,
          searchlocation: location.trim().toLowerCase(),
          searchtext: search.trim().toLowerCase()
        }
      })

      if (request.data.success) {
        const newJobs = request.data.jobs

        setJobs(newJobs)

        setHasMore(newJobs.length === 20)
        setPage(pageNo)
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
      job?.jobtype?.toLowerCase().includes(search.toLowerCase()) ||
      job?.job_title?.toLowerCase().includes(search.toLowerCase()) ||
      job?.location?.toLowerCase().includes(search.toLowerCase()) ||
      job?.organization_name?.toLowerCase().includes(search.toLowerCase())

    return matchesSearch
  })

  useEffect(() => {
    GetJobs(1)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      GetSerchJob()
    }, 500)

    return () => clearTimeout(timer)
  }, [search, location])

  return loading ? (
    <Loading />
  ) : (
    <div className='sm:max-w-[95%] mx-auto px-6 bg-white py-6  '>
      <div className='bg-white border border-gray-100 rounded-xl p-5 sm:p-7 mb-6 shadow-sm'>
        {/* Heading */}
        <div className='mb-5'>
          <p className='text-red-600 font-bold text-xs sm:text-sm tracking-wider'>
            FEATURED JOBS
          </p>

          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mt-1'>
            Find Your <span className='text-red-600'>Dream Job</span>
          </h2>

          <p className='text-gray-500 text-sm mt-2'>
            Explore the latest job opportunities and find the right career for
            you.
          </p>
        </div>

        {/* Search Filters */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_auto] gap-3'>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
              <i className='fas fa-search'></i>
            </span>
            <input
              type='text'
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Job title, skills or company...'
              className='w-full border border-gray-400 rounded-lg pl-10 pr-3 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100'
            />
          </div>

          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
              <i className='fas fa-map-marker-alt'></i>
            </span>
            <input
              type='text'
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder='City or location'
              className='w-full border border-gray-400 rounded-lg pl-10 pr-3 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100'
            />
          </div>

          <button
            onClick={() => {
              GetSerchJob()
            }}
            className='bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-7 py-3 text-sm transition'
          >
            <i className='fas fa-search mr-2'></i>
            Search Jobs
          </button>
        </div>

        {/* Job Type Filters */}
        <div className='hidden sm:flex flex-wrap items-center gap-2 mt-4'>
          <span className='text-sm text-gray-500 font-medium mr-1'>
            Job Type:
          </span>

          {[
            'All Jobs',
            'work from home',
            'Contract',
            'Remote',
            'Permanent'
          ].map(type => (
            <button
              key={type}
              onClick={() => (
                setJobType(type),
                type == 'All Jobs' ? setSearch('') : setSearch(type)
              )}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition ${
                jobType === type
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-500 hover:text-red-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'>
        {filteredJobs.map((job, i) => (
          <Jobmodal job={job} key={i} />
      
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => GetJobs(page + 1)}
          className='cursor-pointer justify-end mt-10 w-full hidden sm:flex items-center gap-2 text-red-600 font-semibold'
        >
          {loading ? 'Loading...' : '  Lode more Jobs'} <ArrowRight size={18} />
        </button>
      )}
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
  )
}
 
