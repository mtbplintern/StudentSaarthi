import React, { useEffect, useState } from 'react'
import {
  BriefcaseBusiness,
  Search,
  MapPin,
  Clock,
  Users,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  Filter,
  Building2,
  IndianRupee
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { backendurl } from '../config'
import Loading from '../Component/Loading'
import Jobmodal from '../Component/Jobmodal'
import Jobpage from '../Component/Jobpage'

export default function MyJob () {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const [Myjobs, setMyjobs] = useState([])

  const GetMyJobDetail = async () => {
    setLoading(true)
    try {
      const request = await axios.get(`${backendurl}/job/my-jobdetail`)

      if (request.data.success) {
        setMyjobs(request.data.myjobs)
        console.log(request.data);
        
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      navigate('/')
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    GetMyJobDetail()
  }, [])
  console.log(Myjobs);
  

  const filteredJobs = Myjobs.filter(job => {
    const matchesSearch =
      job.maindata.title.toLowerCase().includes(search.toLowerCase()) ||
      job.maindata.organization.toLowerCase().includes(search.toLowerCase())

    const matchesFilter = filter === 'All' || job.status === filter

    return matchesSearch && matchesFilter
  })

  return loading ? (
    <Loading />
  ) : (
    <div className='bg-white min-h-screen'>
      <section className='relative overflow-hidden  '>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8'>
          {/* Header */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 '>
            <div className='min-w-0'>
              <div className='flex items-center gap-2 text-red-600 font-semibold text-xs sm:text-sm mb-1'>
                <BriefcaseBusiness size={17} />
                Employer Dashboard
              </div>

              <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900'>
                My <span className='text-red-600'>Jobs</span>
              </h1>

              <p className='text-gray-500 text-xs sm:text-sm mt-1'>
                Manage job postings and track applicants.
              </p>
            </div>

            <button
              onClick={() => navigate('/add-jobs')}
              className='w-full sm:w-auto shrink-0 flex items-center justify-center gap-2
        bg-red-600 hover:bg-red-700 active:scale-[0.98]
        text-white px-4 py-2.5 rounded-xl text-sm font-semibold
        shadow-md shadow-red-100 transition'
            >
              <Plus size={18} />
              Post New Job
            </button>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4'>
            <StatCard
              icon={<BriefcaseBusiness size={18} />}
              title='Total Jobs'
              value={Myjobs.length}
              color='red'
            />

            <StatCard
              icon={<Building2 size={18} />}
              title='Active Jobs'
              value={Myjobs.filter(job => job.status === 'Published').length}
              color='green'
            />
          </div>

          {/* Search & Filter */}

          <div className='bg-white p-2.5 sm:p-4 rounded-xl border border-gray-100 shadow-sm'>
            <div className='flex items-center gap-2'>
              {/* Search */}
              <div className='relative flex-1 min-w-0'>
                <Search
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                  size={16}
                />

                <input
                  type='text'
                  placeholder='Search jobs...'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className='w-full pl-9 pr-2 py-2 text-sm
        bg-gray-50 border border-gray-200 rounded-lg
        outline-none focus:bg-white focus:border-red-500
        focus:ring-2 focus:ring-red-100 transition'
                />
              </div>

              {/* Filter */}
              {/* <div className='relative w-20 sm:w-44 shrink-0'>
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className='w-full appearance-none bg-gray-50 border border-gray-200
        rounded-lg pl-3 pr-7 py-2 text-sm outline-none
        focus:border-red-500 cursor-pointer'
                >
                  <option value='All'>All Jobs</option>
                  <option value='Published'>Active</option>
                  <option value='Closed'>Closed</option>
                </select>

                <Filter
                  size={14}
                  className='absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
                />
              </div> */}
            </div>
          </div>
        </div>
      </section>
      <div className='border border-gray-100' />
      <div className='px-3 sm:px-6 lg:px-10 py-3 sm:py-5'>
        {/* Job List Heading */}
        <div className='flex items-center justify-between gap-2 mb-4'>
          <h2 className='text-lg sm:text-xl font-bold text-gray-900'>
            Your Jobs
          </h2>

          <span className='text-xs sm:text-sm text-gray-500 whitespace-nowrap'>
            {filteredJobs.length} Jobs Found
          </span>
        </div>

        {/* Job Cards */}

        {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-7'>
          {filteredJobs.map((job, i) => (
             <Jobmodal job={job} key={i} />
          ))} 
        </div>*/}
        <div className='flex flex-col justify-center items-center gap-4 sm:gap-5'>
          {filteredJobs.length > 0 &&
            filteredJobs.map((job, i) => (
              <div
                className='w-full flex flex-col items-center justify-center gap-3'
                key={i}
              >
                <Jobpage finaljobdata={job} jobKey={i + 1} setMyjobs={setMyjobs} />
                <div className='border rounded-2xl border-gray-300  w-[90%] md:w-[80%] lg:w-[220mm] '></div>
              </div>
            ))}
        </div>
        {/* Empty State */}
        {filteredJobs.length === 0 && (
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
              No jobs match your search. Try another keyword or post a new job.
            </p>

            <button
              onClick={() => navigate('/add-jobs')}
              className='mt-5 bg-red-600 hover:bg-red-700
        text-white px-5 py-2.5 rounded-lg
        text-sm font-semibold transition'
            >
              Post another Job
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Reusable Stats Card
function StatCard ({ icon, title, value, color }) {
  const colors = {
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600'
  }

  return (
    <div
      className='bg-white border border-gray-200 
    rounded-xl p-3 shadow-2xs flex items-center gap-3'
    >
      <span
        className={` w-fit rounded-xl
          flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </span>

      <div className='flex items-center justify-between'>
        <div>
          <p className='text-[10px] text-gray-500 font-medium uppercase tracking-wider'>
            {title}
          </p>
          <h3 className='text-xs sm:text-sm font-bold text-gray-800 mt-0.5 wrap-break-word'>
            {value || 'N/A'}
          </h3>
        </div>
      </div>
    </div>
  )
}
