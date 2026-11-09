import {
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  Eye,
  IndianRupee,
  MapPin,
  Pencil,
  Trash2,
  Users
} from 'lucide-react'
import { IoIosShareAlt } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

export default function Jobmodal ({ job }) {
  const navigate = useNavigate()

  const isCandidate = location.pathname.includes('/my-jobs')

  return (
    <div
      className='bg-white rounded-xl sm:rounded-2xl
        p-3.5 sm:p-6 border border-gray-100 shadow-sm
        hover:shadow-lg hover:border-red-100
        transition-all duration-300 min-w-0'
    >
      {/* Card Header */}
      <div className='flex items-start justify-between gap-2'>
        <div className='flex items-center gap-2.5 min-w-0'>
          <div
            className='w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg sm:rounded-xl text-white font-bold
                       shadow-red-200  bg-red-600   flex items-center justify-center'
          >
            <BriefcaseBusiness size={25} />
          </div>

          <div className='min-w-0'>
            <h3
              className='font-bold text-sm sm:text-lg
              text-gray-900 truncate'
            >
              {job?.job_title}
            </h3>

            <p className='text-xs sm:text-sm text-gray-500 truncate mt-0.5'>
              {job?.organization_name}
            </p>
          </div>
        </div>
        {job?.last_date ? (
          <span
            className={`shrink-0 text-[10px] sm:text-xs font-semibold
            px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${
              new Date(job?.last_date?.split('-').reverse().join('-')) >=
              new Date()
                ? 'bg-green-50 text-green-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {new Date(job?.last_date?.split('-').reverse().join('-')) >=
            new Date()
              ? 'active'
              : 'closed'}
          </span>
        ) : (
          <span
            className={`shrink-0 text-[10px] sm:text-xs font-semibold
            px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${'bg-gray-100 text-gray-500'}`}
          >
            n/a
          </span>
        )}
      </div>

      {/* Divider */}
      <div className='border-t border-gray-100 my-3 sm:my-5' />

      {/* Job Details */}
      <div className='grid grid-cols-2 gap-x-2 gap-y-3 sm:gap-y-4 text-sm'>
        <Detail
          icon={<MapPin size={15} />}
          label='Location'
          text={job.location}
        />

        <Detail
          icon={<Clock size={15} />}
          label='Job Type'
          text={job?.jobtype}
        />

        <Detail
          icon={<CalendarDays size={15} />}
          label='Last Date'
          text={job?.last_date}
        />

        <Detail
          icon={<Users size={15} />}
          label='Vacancies'
          text={job.total_vacancies}
        />
      </div>

      {/* Application Fee */}
      <div
        className='mt-4 sm:mt-5  border-2 border-gray-200  rounded-lg sm:rounded-xl
          px-3 sm:px-4 py-2 sm:py-2.5
          flex items-center justify-between gap-2'
      >
        <span className='text-gray-500 text-xs sm:text-sm'>
          Application Fee
        </span>

        <span className='font-bold text-red-600 text-sm sm:text-base flex items-center'>
          <IndianRupee size={18} /> {job.application_fee || 'N/A'}
        </span>
      </div>

      {isCandidate ? (
        <div className='flex items-center gap-2 mt-3 sm:mt-5 pt-3 sm:pt-5 border-t border-gray-100'>
          <button
            onClick={() => navigate(`/job-detail/${job.jobdataid}`)}
            className='flex-1 flex items-center justify-center gap-1.5
            bg-red-600 hover:bg-red-700 text-white
            py-2 sm:py-2.5 rounded-lg
            text-xs sm:text-sm font-semibold transition'
          >
            <Eye size={15} />
            View
          </button>

          <button
            onClick={() => navigate(`/edit-job/${job.jobdataid}`)}
            className='flex-1 flex items-center justify-center gap-1.5
            border border-gray-200 hover:border-red-500
            hover:bg-red-50 hover:text-red-600
            text-gray-600 py-2 sm:py-2.5 rounded-lg
            text-xs sm:text-sm font-semibold transition'
          >
            <Pencil size={15} />
            Edit
          </button>

          <button
            onClick={() => setShowDelete(job.jobdataid)}
            className='w-9 sm:w-auto shrink-0 flex items-center
            justify-center gap-1.5 border border-red-100
            hover:bg-red-50 text-red-600
            px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg
            text-xs sm:text-sm font-semibold transition'
            title='Delete'
          >
            <Trash2 size={15} />
            <span className='hidden sm:inline'>Delete</span>
          </button>
          <button
            onClick={() => {
              navigator.share?.({
                title: `${job.job_title} job vaccency`,
                url: `${window.location.origin}/job-detail/${job.jobdataid}`
              })
            }}
            className='p-2 sm:p-2.5 flex items-center justify-center
      hover:bg-red-500 bg-red-600  text-white
        rounded-lg
      transition-all duration-200'
            title='Share Job'
            aria-label='Share Job'
          >
            <IoIosShareAlt size={19} />
          </button>
        </div>
      ) : (
        <div className='flex items-center gap-2 mt-3 sm:mt-5 pt-3 sm:pt-5 border-t border-gray-100'>
          {/* View Button */}
          <button
            onClick={() => navigate(`/job-detail/${job.jobdataid}`)}
            className='flex-1 flex items-center justify-center gap-2
                 bg-red-600 hover:bg-red-700 active:scale-[0.98]
                 text-white py-2.5 rounded-lg
                 text-xs sm:text-sm font-semibold
                 transition-all duration-200'
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              navigator.share?.({
                title: `${job.job_title} job vaccency`,
                url: `${window.location.origin}/job-detail/${job.jobdataid}`
              })
            }}
            className='p-2 sm:p-2.5 flex items-center justify-center
      hover:bg-red-500 bg-red-600  text-white
        rounded-lg
      transition-all duration-200'
            title='Share Job'
            aria-label='Share Job'
          >
            <IoIosShareAlt size={19} />
          </button>
        </div>
      )}
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
