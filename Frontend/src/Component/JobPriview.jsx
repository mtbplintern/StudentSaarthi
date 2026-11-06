import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendurl } from '../config'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { FiMail } from 'react-icons/fi'
import {
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  IndianRupee,
  Users
} from 'lucide-react'

export default function JobPreview ({ setShowPriview, finaljobdata, accessby }) {
  const [Loading, setLoading] = useState(false)
  const [data, setdata] = useState({})
  const navigate = useNavigate()
  const { jobid } = useParams()

  const Editingdata = location.pathname.includes('/edit-job/')

  const candidateaccess = accessby == 'candidate'

  const SubmitJob = async () => {
    if (Loading) return
    if (Object.keys(data).length == 0) return toast.error('job detail messing')

    try {
      setLoading(true)
      const request = await axios.post(`${backendurl}/job/add-job`, {
        jobdata: data
      })

      if (request.data.success) {
                const postedjobid = request.data.jobId

        console.log('success')
        toast.success('job posted successfully')
        setLoading(false)
        setShowPriview(false)
         navigate('/job-posted', {
          state: {
            jobId: postedjobid
          }})
        
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }


  const EditJob = async () => {
    if (Loading) return
    if (Object.keys(data).length == 0) return toast.error('job detail messing')

    try {
      setLoading(true)
      const request = await axios.put(`${backendurl}/job/edit-job/${jobid}`, {
        jobdata: data
      })

      if (request.data.success) {
         console.log('success')
        toast.success('job Editted successfully')
        setLoading(false)
        setShowPriview(false)
        navigate('/job-posted', {
          state: {
            jobId: jobid
          }
        })
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    if (finaljobdata) {
      setdata(finaljobdata)
    }
  }, [])

  if (Object.keys(data).length == 0) {
    return (
      <div className='fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4'>
        <div className='relative w-full max-w-5xl items-center  rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]     '>
          <div className='bg-white p-6 rounded-xl shadow-sm text-center border border-gray-200 max-w-sm w-full'>
            <h2 className='text-lg font-bold text-gray-800'>
              No Job Data Found
            </h2>
            <p className='text-gray-500 text-xs mt-1'>
              The job details you are looking for are missing.
            </p>

            <button
              onClick={() =>
                setShowPriview ? setShowPriview(false) : navigate(-1)
              }
              className='mt-4 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition'
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { maindata, importantDates = [], posts = [], officialLinks = [] } = data

  const totalVacancies = posts.reduce(
    (total, post) => total + Number(post.vacancies || 0),
    0
  )

  return (
    <div className='  w-full max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100'>
      {/* Top Header / Action Bar */}
      {!candidateaccess && (
        <div className='bg-red-700 text-white px-5 py-3 flex items-center justify-between shrink-0 w-full'>
          <div className='flex items-center gap-2'>
            <span className='bg-red-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide'>
              Live Preview
            </span>
            <span className='text-xs text-white font-medium hidden sm:inline'>
              | {maindata?.organization || 'Organization'}
            </span>
          </div>

          <button
            onClick={() => setShowPriview(false)}
            className='text-white hover:text-red-100 cursor-pointer text-xs font-semibold px-2 py-1 rounded transition'
          >
            ✕ Close
          </button>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className='overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50'>
        {/* Hero Banner (Compact & Modern) */}
        <div className='bg-linear-to-r from-red-700 via-red-600 to-red-700 rounded-xl p-5 sm:p-6 text-white shadow-sm'>
          <div className='flex flex-wrap items-center justify-between gap-2 mb-2'>
            <span className='bg-white/10 px-3 py-1 rounded-md sm:text-[14px] text-xs font-medium uppercase tracking-wider'>
              {maindata?.organization || 'Organization'}
            </span>
            <span className='bg-amber-400 text-gray-900 px-3 py-0.5 rounded-md sm:text-[14px] text-[11px] font-bold uppercase'>
              {maindata?.jobtype || 'N/A'}
            </span>
          </div>

          <h1 className='text-xl sm:text-3xl font-bold tracking-tight'>
            {maindata?.title || 'Untitled Job Position'}
          </h1>

          <div className='flex flex-wrap items-center gap-4 mt-3 sm:text-base text-xs  font-medium'>
            <span>📍 {maindata?.location || 'Location not specified'}</span>
            <span>📧 {maindata?.contactemail || 'No email provided'}</span>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          <Stat label='Vacancies' value={totalVacancies} icon='👥' />
          <Stat label='Job Type' value={maindata?.jobtype} icon='💼' />
          <Stat
            label='Application Fee'
            value={`₹${maindata?.applicationfee || 0}`}
            icon='💳'
          />
          <Stat label='Positions' value={posts?.length} icon='📊' />
        </div>

        {/* Main Layout Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          {/* Left/Main Column */}
          <div className='lg:col-span-2 space-y-4'>
            <Section title='Job Description'>
              <p className='text-gray-600 text-xs sm:text-lg leading-relaxed whitespace-pre-line'>
                {maindata?.description ||
                  'No description available for this position.'}
              </p>
            </Section>

            <Section title='Post-wise Vacancy & Eligibility'>
              {!posts || posts.length === 0 ? (
                <div className='py-7 text-center bg-white border border-dashed border-gray-300 rounded-xl'>
                  <BriefcaseBusiness className='w-8 h-8 text-gray-300 mx-auto mb-2' />
                  <p className='text-sm font-semibold text-gray-600'>
                    No post details provided.
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3'>
                  {posts.map((post, index) => (
                    <div
                      key={index}
                      className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-200'
                    >
                      {/* Header */}
                      <div className='px-3.5 py-3 border-b border-red-100 bg-linear-to-r from-red-50 to-white'>
                        <div className='flex items-center justify-between gap-2'>
                          <div className='min-w-0'>
                            <span className='text-[10px] font-bold uppercase tracking-wider text-red-600'>
                              POST {index + 1}
                            </span>
                            <h3 className='text-sm font-bold text-gray-900 leading-snug mt-0.5 '>
                              {post?.postname || 'N/A'}
                            </h3>
                          </div>

                          <div className='shrink-0 text-center bg-red-600 text-white rounded-lg px-3 py-1.5 min-w-16.5'>
                            <p className='text-[9px] font-semibold uppercase tracking-wide text-red-100'>
                              Vacancies
                            </p>
                            <p className='text- font-semibold leading-tight'>
                              {post?.vacancies || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Eligibility */}
                      <div className='px-3.5 py-3'>
                        <div className='flex items-center gap-2 mb-1.5'>
                          <div className='w-5 h-5 rounded bg-red-50 flex items-center justify-center'>
                            <GraduationCap className='w-3.5 h-3.5 text-red-600' />
                          </div>
                          <span className='text-xs font-bold text-gray-800'>
                            Eligibility
                          </span>
                        </div>

                        <p className='text-xs text-gray-600 leading-relaxed '>
                          {post?.eligibility || 'N/A'}
                        </p>
                      </div>

                      {/* Details */}
                      <div className='grid grid-cols-2 border-t border-gray-100'>
                        <div className='px-3.5 py-2.5 border-r border-b border-gray-100'>
                          <div className='flex items-center gap-1.5 mb-1'>
                            <CalendarDays className='w-3.5 h-3.5 text-red-500' />
                            <span className='text-[10px] font-semibold text-gray-500 uppercase'>
                              Age Limit
                            </span>
                          </div>
                          <p className='text-xs font-bold text-gray-800 '>
                            {post?.age || 'N/A'}
                          </p>
                        </div>

                        <div className='px-3.5 py-2.5 border-b border-gray-100'>
                          <div className='flex items-center gap-1.5 mb-1'>
                            <IndianRupee className='w-3.5 h-3.5 text-red-500' />
                            <span className='text-[10px] font-semibold text-gray-500 uppercase'>
                              Salary
                            </span>
                          </div>
                          <p className='text-xs font-bold text-gray-800 '>
                            {post?.salary ? `₹${post?.salary}` : 'N/A'}
                          </p>
                        </div>

                        <div className='col-span-2 px-3.5 py-2.5 bg-gray-50/70'>
                          <div className='flex items-center gap-1.5 mb-1'>
                            <Users className='w-3.5 h-3.5 text-red-500' />
                            <span className='text-[10px] font-semibold text-gray-500 uppercase'>
                              Category
                            </span>
                          </div>
                          <p className='text-xs font-bold text-gray-800 '>
                            {post?.category || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title='Instructions for Candidates'>
              <p className='text-gray-600 text-xs sm:text-lg leading-relaxed whitespace-pre-line'>
                {maindata?.instructions || 'No specific instructions provided.'}
              </p>
            </Section>
          </div>

          {/* Right Sidebar Column */}
          <div className='space-y-4'>
            <Section title='Important Dates'>
              {importantDates?.length === 0 ? (
                <p className='text-gray-500 text-xs'>No dates specified.</p>
              ) : (
                <div className='space-y-2'>
                  {importantDates?.map((item, index) => (
                    <div
                      key={item?.id || index}
                      className='flex justify-between items-center md:text-lg text-xs pb-2 border-b border-gray-100 last:border-0 last:pb-0'
                    >
                      <span className='text-gray-600 font-medium'>
                        {item?.title}
                      </span>
                      <span className='text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded'>
                        {item?.date}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title='Important Links'>
              {officialLinks?.length === 0 ? (
                <p className='text-gray-500 text-xs'>No links provided.</p>
              ) : (
                <div className='space-y-2'>
                  {officialLinks?.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center justify-between p-2.5 rounded-lg bg-gray-50 hover:bg-red-50 border border-gray-200 text-red-500 hover:text-red-700 font-medium text-xs transition group'
                    >
                      <div>
                        <span className='block font-semibold'>
                          {link?.title}
                        </span>
                        <span className='text-[10px] text-gray-400 group-hover:text-red-500'>
                          {link?.type}
                        </span>
                      </div>
                      <span className='text-gray-400 group-hover:text-red-600'>
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </Section>

            <Section title='Support & Queries'>
              <p className='text-gray-500 text-[11px] sm:text-sm leading-relaxed'>
                For official assistance regarding this notification:
              </p>
              <a
                href={`mailto:${maindata?.contactemail}`}
                className='flex items-center gap-1 mt-1 text-red-600 hover:underline font-semibold sm:text-sm text-xs break-all  '
              >
                <FiMail />
                {maindata?.contactemail || 'Not available'}
              </a>
            </Section>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className='bg-white border-t border-gray-200 px-5 py-3 flex flex-wrap justify-between items-center gap-3 shrink-0'>
        <button
          onClick={() =>
            !candidateaccess ? setShowPriview(false) : navigate(-1)
          }
          className='px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition'
        >
          ← Back {!candidateaccess && 'to Edit'}
        </button>

        <div className='flex items-center gap-2'>
          <button
            onClick={() => window.print()}
            className='px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50 transition'
          >
            Print / PDF
          </button>
          {!candidateaccess && (
            <button
              onClick={() => {
                {
                  Editingdata ? EditJob() : SubmitJob()
                }
              }}
              className='px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm transition'
            >
              {Editingdata
                ? Loading
                  ? 'Editing Job'
                  : 'Edit Job Now'
                : Loading
                ? 'Posting Job'
                : 'Post Job Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Section ({ title, children }) {
  return (
    <div className='bg-white border border-gray-200 rounded-xl p-4 shadow-2xs'>
      <h2 className='text-xs sm:text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3 tracking-tight flex items-center gap-2'>
        <span className='w-1.5 h-1.5 rounded-full bg-red-600'></span>
        {title}
      </h2>
      {children}
    </div>
  )
}

function Stat ({ label, value, icon }) {
  return (
    <div
      className='bg-white border border-gray-200 
    rounded-xl p-3 shadow-2xs flex items-center gap-3'
    >
      <span className='text-xl'>{icon}</span>
      <div>
        <p className='text-[10px] sm:text-sm text-gray-500 font-medium uppercase tracking-wider'>
          {label}
        </p>
        <h3 className='text-xs sm:text-lg font-bold text-gray-800 mt-0.5 wrap-break-word'>
          {value || 'N/A'}
        </h3>
      </div>
    </div>
  )
}
