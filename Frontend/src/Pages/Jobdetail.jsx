import React from 'react'
import JobPreview from '../Component/JobPriview'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { backendurl } from '../config'
import toast from 'react-hot-toast'
import { useState } from 'react'
import Loading from '../Component/Loading'
import Jobpage from '../Component/Jobpage'

export default function Jobdetail () {
  const { jobid } = useParams()
  const navigate = useNavigate()
  const [Jobdata, setJobdata] = useState({})
  const [datloading, setdatloading] = useState(false)

  const GetJobDetail = async () => {
    setdatloading(true)

    try {
      const request = await axios.get(`${backendurl}/data/job-detail/${jobid}`)

      if (request.data.success) {
        setJobdata(request.data.job)
        setdatloading(false)
      }
    } catch (error) {
      console.log(error)
      setdatloading(false)

      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    GetJobDetail()
  }, [])

  return datloading ? (
    <Loading />
  ) : (
    <div className='flex justify-center items-center   bg-gray-50 min-h-[93vh]'>
      {Object.keys(Jobdata).length > 0 ? (
        < >
        {/* <JobPreview finaljobdata={Jobdata} accessby={'candidate'} /> */}
        <Jobpage finaljobdata={Jobdata} accessby={'candidate'} />
        </>
      ) : (
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
                onClick={() => navigate(-1)}
                className='mt-4 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition'
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
