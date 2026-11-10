import React, { useEffect, useState } from 'react'
import { FiMail } from 'react-icons/fi'
import { BriefcaseBusiness, Eye, Pencil, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { backendurl } from '../config'
import toast from 'react-hot-toast'
import { IoIosShareAlt } from 'react-icons/io'

export default function Jobpage ({ finaljobdata, jobKey, setShowPriview }) {
  const [data, setdata] = useState({})
  const Editingdata = location.pathname.includes('/edit-job/')
  const Addjobpage = location.pathname.includes('/add-jobs')
  const Myjobpage = location.pathname.includes('/my-jobs')
  const [Loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (finaljobdata) {
      setdata(finaljobdata)
    }
  }, [finaljobdata])

  const { maindata, importantDates = [], posts = [], officialLinks = [] } = data

  const { jobid } = useParams()

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
          }
        })
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
  return (
    <div
      className={`w-full md:w-[85%] lg:w-[250mm] max-w-full p-2 space-y-4 sm:p-6 rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-100 ${
        jobKey % 2 == 0 ? 'bg-gray-200' : 'bg-white'
      }`}
    >
      <div className='bg-linear-to-r from-red-700 via-red-600 to-red-700 flex items-center rounded-xl px-3 py-1 sm:px-5 shadow-md text-white'>
        {/* Serial Number - Start */}
        {jobKey && (
          <div className='h-7 w-7 shrink-0 flex items-center justify-center rounded-full bg-white text-red-700 font-extrabold text-sm shadow-md border-2 border-red-200'>
            {jobKey}
          </div>
        )}

        {/* Organization Name - Center */}
        <p className='flex-1 text-center mx-3     px-3 py-2 rounded-lg text-sm sm:text-xl font-bold tracking-wide'>
          {maindata?.organization || 'Organization'}
        </p>
      </div>

      <Section title='Important Dates'>
        {importantDates?.length === 0 ? (
          <p className='text-gray-500 text-xs'>No dates specified.</p>
        ) : (
          <div className='space-y-2'>
            {importantDates?.map((item, index) => (
              <div
                key={item?.id || index}
                className='flex justify-between items-center md:text-sm text-xs pb-2 border-b border-gray-100 last:border-0 last:pb-0'
              >
                <span className='text-gray-600 font-medium'>{item?.title}</span>
                <span className='text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded'>
                  {item?.date}
                </span>
              </div>
            ))}
          </div>
        )}
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
          <div className='w-full overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm'>
            <table className='w-full min-w-210 table-auto text-left border-collapse'>
              <thead>
                <tr className='bg-red-50 border-b border-red-100'>
                  <th className='px-2 sm:px-4 py-2.5 sm:py-3   text-xs font-bold text-red-700 uppercase'>
                    S.No.
                  </th>
                  <th className='px-2 sm:px-4 py-2.5 sm:py-3  text-xs font-bold text-red-700 uppercase'>
                    Post Name
                  </th>
                  <th className='px-2 sm:px-4 py-2.5 sm:py-3   text-xs font-bold text-red-700 uppercase'>
                    Vacancies
                  </th>
                  <th className='px-2 sm:px-4 py-2.5 sm:py-3  text-xs font-bold text-red-700 uppercase'>
                    Eligibility
                  </th>
                  <th className='px-2 sm:px-4 py-2.5 sm:py-3  text-xs font-bold text-red-700 uppercase'>
                    Age Limit
                  </th>
                  <th className='px-2 sm:px-4 py-2.5 sm:py-3  text-xs font-bold text-red-700 uppercase'>
                    Salary
                  </th>
                  <th className='px-2 sm:px-4 py-2.5 sm:py-3  text-xs font-bold text-red-700 uppercase'>
                    Category
                  </th>
                </tr>
              </thead>

              <tbody>
                {posts.map((post, index) => (
                  <tr
                    key={index}
                    className='border-b border-gray-100 hover:bg-red-50/40 transition-colors'
                  >
                    <td className='px-2 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold text-gray-500'>
                      {index + 1}
                    </td>

                    <td className='px-2 sm:px-4 py-2.5 sm:py-3 text-xs font-bold text-gray-900'>
                      {post?.postname || 'N/A'}
                    </td>

                    <td className='px-2 sm:px-4 py-2.5 sm:py-3 text-xs font-bold text-red-600'>
                      {post?.vacancies || 'N/A'}
                    </td>

                    <td className='px-2 sm:px-4 py-2.5 sm:py-3 text-xs text-gray-600 leading-relaxed whitespace-normal  '>
                      {post?.eligibility || 'N/A'}
                    </td>

                    <td className='px-2 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold text-gray-700'>
                      {post?.age || 'N/A'}
                    </td>

                    <td className='px-2 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold text-gray-700'>
                      {post?.salary ? `₹${post.salary}` : 'N/A'}
                    </td>

                    <td className='px-2 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold text-gray-700'>
                      {post?.category || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <span className='block font-semibold'>{link?.title}</span>
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

      <div className='lg:col-span-2 space-y-4'>
        <Section title='Instructions for Candidates'>
          <p className='text-gray-600 text-xs sm:text-sm font-semibold leading-relaxed whitespace-pre-line'>
            {maindata?.instructions || 'No specific instructions provided.'}
          </p>
        </Section>
      </div>

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

      {(Editingdata || Addjobpage) && (
        <Section title='Action'>
          <div className='flex items-center gap-2 justify-between'>
            <button
              onClick={() => setShowPriview(false)}
              className='px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition'
            >
              ← Back to Edit
            </button>

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
          </div>
        </Section>
      )}

 
      {Myjobpage && (
                <Section title='Action'>
          <div className='grid grid-cols-[1fr_auto_auto] sm:flex items-center gap-2'>
            {/* Edit Button */}
            <button
              onClick={() => navigate(`/edit-job/${maindata.jobdataid}`)}
              className='
      flex items-center justify-center gap-2
      min-w-0 px-3 sm:px-5 py-2.5
      rounded-lg border border-gray-200
      bg-white text-gray-700
      hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600
      text-xs sm:text-sm font-semibold
      transition-all duration-200
      active:scale-95
    '
            >
              <Pencil size={16} />
              <span>Edit</span>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => setShowDelete(maindata.jobdataid)}
              className='
      flex items-center justify-center gap-2
      px-3 sm:px-4 py-2.5
      rounded-lg border border-red-100
      bg-red-50 text-red-600
      hover:bg-red-600 hover:text-white hover:border-red-600
      text-xs sm:text-sm font-semibold
      transition-all duration-200
      active:scale-95
    '
              title='Delete'
              aria-label='Delete Job'
            >
              <Trash2 size={16} />
              <span className='hidden sm:inline'>Delete</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                navigator.share?.({
                  title: `${maindata.title} job vaccency`,
                  url: `${window.location.origin}/job-detail/${maindata.jobdataid}`
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
        </Section>
      )}
    </div>
  )
}

function Section ({ title, children }) {
  return (
    <div className='  bg-white border border-gray-200 rounded-xl p-4 shadow-2xs'>
      <h2 className='text-xs sm:text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3 tracking-tight flex items-center gap-2'>
        <span className='w-1.5 h-1.5 rounded-full bg-red-600'></span>
        {title}
      </h2>
      {children}
    </div>
  )
}
