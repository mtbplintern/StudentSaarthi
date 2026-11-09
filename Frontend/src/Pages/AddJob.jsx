import React, { useEffect, useState } from 'react'
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  FileText,
  Send,
  ArrowLeft,
  CheckCircle,
  CalendarDays,
  BriefcaseBusiness,
  Trash2,
  Plus,
  LinkIcon,
  IndianRupee
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Footer from '../Component/Footer'
import { backendurl } from '../config'
import toast from 'react-hot-toast'
import axios from 'axios'
import JobPriview from '../Component/JobPriview'

export default function AddJob ({ dbjobdata, accessfor }) {
  const navigate = useNavigate()
  const [jobtype, setjobtype] = useState([])
  const [finaljobdata, setfinaljobdata] = useState({})
  const EditingJob = accessfor == 'edit'

  const GetJobType = async () => {
    try {
      const request = await axios.get(`${backendurl}/job/jobtype`)

      if (request.data.success) {
        setjobtype(request.data.JobType)
      }
    } catch (error) {
      console.log(error)
      navigate('/')

      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }

  // Form State

  // Organization & Job Details

  const initialForm = {
    title: '',
    organization: '',
    location: '',
    applicationfee: '',
    jobtype: '',
    jobtypeId: '',
    description: '',
    instructions: '',
    contactemail: '',
    status: 'Published'
  }
  const [form, setForm] = useState(initialForm)

  const handleChange = e => {
    const { name, value } = e.target

    if (name === 'jobtype') {
      const selectedType = jobtype.find(type => type.id === Number(value))
      setForm(prevForm => ({
        ...prevForm,
        jobtype: selectedType?.name || '',
        jobtypeId: selectedType?.id || ''
      }))
    } else {
      setForm(prevForm => ({
        ...prevForm,
        [name]: value
      }))
    }
  }

  // Important Dates

  const [importantDates, setImportantDates] = useState([
    { title: 'Application Start Date', date: '' },
    { title: 'Application Last Date', date: '' }
    // {   title: 'Fee Last Date', date: '' }
  ])

  const addDate = () => {
    setImportantDates([
      ...importantDates,
      {
        title: '',
        date: ''
      }
    ])
  }

  const removeDate = index => {
    setImportantDates(importantDates.filter((_, i) => i !== index))
  }

  const handleDateChange = (index, field, value) => {
    const updated = [...importantDates]
    updated[index][field] = value

    setImportantDates(updated)
  }

  //  Post Wise Vacancy Details

  const [posts, setPosts] = useState([
    {
      postname: '',
      vacancies: '',
      eligibility: '',
      age: '',
      salary: '',
      category: ''
    }
  ])

  const addPost = () => {
    setPosts([
      ...posts,
      {
        postname: '',
        vacancies: '',
        eligibility: '',
        age: '',
        salary: '',
        category: ''
      }
    ])
  }

  const handlePostChange = (index, field, value) => {
    const updated = [...posts]
    updated[index][field] = value
    setPosts(updated)
  }
  const removePost = index => {
    setPosts(posts.filter((_, i) => i !== index))
  }

  //  Official Links & Documents

  const [officialLinks, setOfficialLinks] = useState([
    { title: 'Official Notification', url: '' },
    { title: 'Apply Online', url: '' }
  ])

  const addOfficialLink = () => {
    setOfficialLinks([...officialLinks, { title: '', url: '' }])
  }

  const removeOfficialLink = index => {
    setOfficialLinks(officialLinks.filter((_, i) => i !== index))
  }

  const handleLinkChange = (index, field, value) => {
    const updated = [...officialLinks]
    updated[index][field] = value
    setOfficialLinks(updated)
  }

  // Handle Form Submission
  const [ShowPriview, setShowPriview] = useState(false)
 
  const handleSubmit = e => {
    e.preventDefault()

    const finaljobdetil = {
      maindata: form,
      importantDates: importantDates,
      posts: posts,
      officialLinks: officialLinks
    }
    setfinaljobdata(finaljobdetil)

    console.log('Job Details:', finaljobdetil)

    setShowPriview(true)
  }
  

  useEffect(() => {
    if (dbjobdata) {
      setForm({ ...form, ...dbjobdata.maindata })
      setPosts(dbjobdata.posts)
      setOfficialLinks(dbjobdata.officialLinks)
 

      const formattedDates = dbjobdata?.importantDates?.map(item => {
        if (!item.date) return item
        
        const [day, month, year] = item?.date?.split('-')

        return {
          ...item,
          date: `${year}-${month}-${day}`
        }
      })
      
      

      setImportantDates(formattedDates)
    }
    GetJobType()
  }, [])

  // Input Styling - Red & White Theme
  const inputStyle =
    'w-full min-w-0 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all bg-gray-50 focus:bg-white text-gray-800 text-sm placeholder:text-gray-400 hover:border-gray-300'

  // Label Styling
  const labelStyle = 'block text-sm font-bold text-gray-700 mb-2.5'

  return (
    <div className='min-h-screen bg-white text-gray-900 w-full'>
      {/* Hero Section */}
      <section className='relative overflow-hidden   '>
   

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8'>
          <p
            onClick={() => navigate(-1)}
            className='inline-flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm font-medium mb-6 transition'
          >
            <ArrowLeft size={17} />
            Back to Home
          </p>

          <div className='flex flex-col sm:flex-row sm:items-center gap-5'>
            <div className='w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center bg-red-600 text-white rounded-2xl shadow-xl shadow-red-200'>
              <Briefcase size={34} />
            </div>

            <div>
              <span className='text-red-600 text-xs sm:text-sm font-bold uppercase tracking-[3px]'>
                Employer Dashboard
              </span>

              <h1 className='text-3xl sm:text-4xl   font-extrabold tracking-tight mt-2'>
                {EditingJob ? 'Edit ' : ' Post a New'}{' '}
                <span className='text-red-600'>Job</span>
              </h1>

              <p className='text-gray-500 mt-3 text-sm sm:text-base max-w-xl'>
                Find talented professionals and build your dream team. Share
                your opportunity with thousands of job seekers.
              </p>
            </div>
          </div>

          <div className='flex flex-wrap gap-5 mt-6 text-sm text-gray-600'>
            <div className='flex items-center gap-2'>
              <CheckCircle size={17} className='text-red-600' />
              Easy Job Posting
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle size={17} className='text-red-600' />
              Reach Top Talent
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle size={17} className='text-red-600' />
              Quick Application Process
            </div>
          </div>
        </div>
      </section>

<div className='border border-gray-100' />

      {/* Main Form */}
      <section className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8  py-12'>
        {ShowPriview && (
          <div className='fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4'>
            <JobPriview
              setShowPriview={setShowPriview}
              finaljobdata={finaljobdata}
            />
          </div>
        )}

        {!ShowPriview && (
          <form
            onSubmit={handleSubmit}
            className='bg-white border border-gray-100 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.1)] overflow-hidden'
          >
            {/* Form Header */}
            <div className='px-6 sm:px-10 py-7 border-b border-gray-100 bg-gray-50/70'>
              <h2 className='text-xl sm:text-2xl font-extrabold'>
                Job Information
              </h2>
              <p className='text-sm text-gray-500 mt-2'>
                Fill in the details below to publish your job opening.
              </p>
            </div>

            <div className='p-6 sm:p-10'>
              {/* Organization Details */}
              <div className='mb-10'>
                <div className='flex items-center gap-4 mb-7'>
                  <div className='w-11 h-11 bg-red-600 text-white  rounded-xl flex items-center justify-center'>
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 className='text-lg sm:text-xl font-bold'>
                      Organization & Job Details
                    </h3>
                    <p className='text-xs sm:text-sm text-gray-400 mt-1'>
                      Basic information about your job opening.
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-6'>
                  <div>
                    <label className={labelStyle}>Job Title *</label>
                    <input
                      name='title'
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder='e.g. Frontend Developer'
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Organization Name *</label>
                    <input
                      name='organization'
                      value={form.organization}
                      onChange={handleChange}
                      required
                      placeholder='Enter organization name'
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Job Location </label>
                    <div className='relative'>
                      <MapPin
                        size={18}
                        className='absolute left-4 top-1/2 -translate-y-1/2 text-red-600'
                      />
                      <input
                        name='location'
                        value={form?.location || ""}
                        onChange={handleChange}
                        placeholder='e.g. Gurgaon, India'
                        className={`${inputStyle} pl-11`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelStyle}>Application Fee </label>
                    <div className='relative'>
                      <IndianRupee
                        size={18}
                        className='absolute left-4 top-1/2 -translate-y-1/2 text-red-600'
                      />
                      <input
                        name='applicationfee'
                        type='number'
                        value={form?.applicationfee || 0}
                        onChange={handleChange}
                        min='0'
                        placeholder='e.g. 500'
                        className={`${inputStyle} pl-11 hide-number-arrows`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelStyle}>Job Type </label>
                    <select
                      name='jobtype'
                      value={form?.jobtypeId || 0}
                      onChange={handleChange}
                      className={inputStyle}
                    >
                      <option value=''>Select Job Type</option>
                      {jobtype.map(type => {
                        return (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  {/* <div>
                    <label className={labelStyle}>Job Status *</label>
                    <select
                      name='status'
                      value={form.status}
                      onChange={handleChange}
                      className={inputStyle}
                    >
                      <option value='Draft'>Draft</option>
                      <option value='Published'>Published</option>
                      <option value='Closed'>Closed</option>
                    </select>
                  </div> */}
                </div>
              </div>

              <div className='border-t border-gray-100 my-10' />

              {/* Date Details */}

              <div className='mb-10'>
                <div className='flex items-center gap-4 mb-7'>
                  <div className='w-11 h-11 bg-red-600 text-white  rounded-xl flex items-center justify-center'>
                    <CalendarDays size={22} />
                  </div>
                  <div>
                    <h3 className='text-lg sm:text-xl font-bold'>
                      Important Dates
                    </h3>
                    <p className='text-xs sm:text-sm text-gray-400 mt-1'>
                      Add all important job application dates
                    </p>
                  </div>
                </div>

                <div className='space-y-4'>
                  {importantDates.map((item, i) => (
                    <div
                      key={i}
                      className='grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end border p-4 rounded-xl'
                    >
                      <div>
                        <label className={labelStyle}>Date Title </label>
                        <input
                          type='text'
                          value={item?.title}
                          onChange={e =>
                            i > 1 &&
                            handleDateChange(i, 'title', e.target.value)
                          }
                          placeholder='e.g. Admit Card Date'
                          required={i > 1}
                          className={inputStyle}
                        />
                      </div>

                      <div>
                        <label className={labelStyle}>Select Date *</label>
                        <input
                          type='date'
                          value={item?.date || ""}
                          onChange={e =>
                            handleDateChange(i, 'date', e.target.value)
                          }
                          required={i > 2}
                          className={inputStyle}
                        />
                      </div>
                      {i > 1 && (
                        <button
                          type='button'
                          onClick={() => removeDate(i)}
                          className=' text-red-600   p-3 rounded-lg hover:text-white hover:bg-red-600 w-fit'
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type='button'
                  onClick={addDate}
                  className='mt-5 flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700 transition'
                >
                  <Plus size={18} />
                  Add More Date
                </button>
              </div>

              <div className='border-t border-gray-100 my-10' />

              {/* Post Wise Vacancy Details */}
              <div className='mb-10'>
                <div className='flex items-center justify-between gap-3 mb-7'>
                  <div className='flex items-center gap-4'>
                    <div className='w-11 h-11 bg-red-600 text-white rounded-xl flex items-center justify-center'>
                      <BriefcaseBusiness size={22} />
                    </div>
                    <div>
                      <h3 className='text-lg sm:text-xl font-bold'>
                        Post Wise Vacancy Details
                      </h3>
                      <p className='text-xs sm:text-sm text-gray-400 mt-1'>
                        Add post name, eligibility, age and vacancy details
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  {posts.length > 0 ? (
                    posts.map((post, index) => (
                      <div
                        key={post.id || index}
                        className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md'
                      >
                        {/* Header */}
                        <div className='flex items-center justify-between gap-3   px-4 py-3'>
                          <div className='flex items-center gap-3 min-w-0'>
                            <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white'>
                              {index + 1}
                            </span>
                            <h3 className='truncate font-semibold text-gray-800'>
                              {post.postname || 'New Post'}
                            </h3>
                          </div>

                          <button
                            type='button'
                            onClick={() => removePost(index)}
                            className='shrink-0 rounded-lg bg-white p-2 text-red-600 transition hover:bg-red-600 hover:text-white'
                            aria-label='Remove post'
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        {/* Input fields */}
                        <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3'>
                          {[
                            ['postname', 'Post Name *', 'e.g. Clerk'],
                            ['vacancies', 'Vacancies', 'e.g. 100'],
                            ['eligibility', 'Eligibility', 'e.g. Graduate'],
                            ['age', 'Age Limit', 'e.g. 18-27 Years'],
                            ['salary', 'Salary', 'e.g. ₹25,000'],
                            ['category', 'Category', 'e.g. General']
                          ].map(([field, label, placeholder], i) => (
                            <div key={field} className='min-w-0'>
                              <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                                {label}
                              </label>

                              <input
                                type='text'
                                value={post[field] ?? ''}
                                onChange={e =>
                                  handlePostChange(index, field, e.target.value)
                                }
                                required={i == 0}
                                placeholder={placeholder}
                                className='w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100'
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='rounded-xl border border-dashed border-gray-300 bg-gray-50 py-10 text-center'>
                      <p className='text-sm font-medium text-gray-500'>
                        No posts added yet.
                      </p>
                    </div>
                  )}
                </div>

                <div className='flex flex-wrap items-center justify-between gap-3 mt-4'>
                  <p className='text-sm text-gray-500'>
                    Total Posts: <b className='text-red-600'>{posts.length}</b>
                  </p>

                  <button
                    type='button'
                    onClick={addPost}
                    className='flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700 transition'
                  >
                    <Plus size={18} />
                    Add More Post
                  </button>
                </div>
              </div>

              <div className='border-t border-gray-100 my-10' />

              {/* Description */}
              <div className='mb-10'>
                <div className='flex items-center gap-4 mb-7'>
                  <div className='w-11 h-11 bg-red-600 text-white rounded-xl flex items-center justify-center'>
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 className='text-lg sm:text-xl font-bold'>
                      Job Description
                    </h3>
                    <p className='text-xs sm:text-sm text-gray-400 mt-1'>
                      Explain the role and candidate expectations.
                    </p>
                  </div>
                </div>

                <div className='mb-7'>
                  <label className={labelStyle}>Job Description </label>
                  <textarea
                    name='description'
                    value={form?.description || ""}
                    onChange={handleChange}
                    rows={4}
                    placeholder='Describe the job role, responsibilities and daily tasks...'
                    className={`${inputStyle} resize-y `}
                  />
                </div>

                <div>
                  <label className={labelStyle}> Instructions</label>
                  <textarea
                    name='instructions'
                    value={form.instructions || ""}
                    onChange={handleChange}
                    rows={4}
                    placeholder='Enter any  instructions or important information for applicants...'
                    className={`${inputStyle} resize-y`}
                  />
                </div>
              </div>

              <div className='border-t border-gray-100 my-10' />

              {/* Official Links & Documents */}
              <div className='mb-10'>
                <div className='flex items-center gap-4 mb-7'>
                  <div className='w-11 h-11 bg-red-600 text-white rounded-xl flex items-center justify-center'>
                    <LinkIcon size={22} />
                  </div>

                  <div>
                    <h3 className='text-lg sm:text-xl font-bold'>
                      Official Links & Documents
                    </h3>
                    <p className='text-xs sm:text-sm text-gray-400 mt-1'>
                      Add official website, application links and important PDFs
                    </p>
                  </div>
                </div>

                <div className='space-y-4'>
                  {officialLinks.map((link, index) => (
                    <div
                      key={index}
                      className='rounded-xl border border-gray-200 overflow-hidden'
                    >
                      <div
                        className={`flex items-center justify-between px-4 py-2 ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                        }`}
                      >
                        <span className='font-semibold text-sm text-gray-700'>
                          Link #{index + 1}
                        </span>

                        <button
                          type='button'
                          onClick={() => removeOfficialLink(index)}
                          className='  rounded-lg bg-white p-2 text-red-600 transition hover:bg-red-600 hover:text-white'
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
                        <div>
                          <label className={labelStyle}>Link Name *</label>
                          <input
                            type='text'
                            value={link.title}
                            onChange={e =>
                              handleLinkChange(index, 'title', e.target.value)
                            }
                            placeholder='e.g. Official Notification'
                            className={inputStyle}
                          />
                        </div>

                        <div>
                          <label className={labelStyle}>Official URL *</label>
                          <input
                            type='url'
                            value={link.url}
                            onChange={e =>
                              handleLinkChange(index, 'url', e.target.value)
                            }
                            required
                            placeholder='https://example.gov.in/...'
                            className={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type='button'
                  onClick={addOfficialLink}
                  className='mt-4 flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 text-white px-5 py-3 font-semibold transition'
                >
                  <Plus size={18} />
                  Add More Official Link
                </button>
              </div>

              <div className='border-t border-gray-100 my-10' />

              {/* Contact Details */}
              <div className='mb-8'>
                <div className='flex items-center gap-4 mb-7'>
                  <div className='w-11 h-11 bg-red-600 text-white rounded-xl flex items-center justify-center'>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 className='text-lg sm:text-xl font-bold'>
                      Contact Information
                    </h3>
                    <p className='text-xs sm:text-sm text-gray-400 mt-1'>
                      Where candidates can contact your organization.
                    </p>
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Contact Email </label>
                  <input
                    type='email'
                    name='contactemail'
                    value={form.contactemail || ""}
                    onChange={handleChange}
                    placeholder='hr@organization.com'
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className='border-t border-gray-100 pt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5'>
                <p className='text-sm text-gray-400'>
                  <span className='text-red-600 font-bold'>*</span> Required
                  fields
                </p>

                <button
                  type='submit'
                  className='w-full sm:w-auto flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white px-9 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-100'
                >
                  <Send size={18} />
                  {EditingJob ? ' Edit' : 'Publish '} Job
                </button>
              </div>
            </div>
          </form>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
