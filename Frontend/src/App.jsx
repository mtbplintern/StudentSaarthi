import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Webpage from './Pages/Webpage'
import AddJob from './Pages/AddJob'
 import MyJob from './Pages/MyJob'
import Jobdetail from './Pages/Jobdetail'
 import MainLayout from './Layout/MainLayout'
import EditJob from './Pages/EditJob'
import Profile from './Pages/Profile'
import AllJobsPage from './Pages/AllJobsPage'
import NotFound from './Pages/NotFount'
import PostedJob from './Pages/PostedJob'

function App () {
  return (
    <BrowserRouter>
      <Toaster position='top-right' />
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Webpage />} />
          <Route path='/add-jobs' element={<AddJob />} />
          <Route path='/my-jobs' element={<MyJob />} />
          <Route path='/job-posted' element={<PostedJob/>} />
          <Route path='/job-detail/:jobid' element={<Jobdetail />} />
          <Route path='/edit-job/:jobid' element={<EditJob />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/all-job' element={<AllJobsPage />} />
        </Route>

        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NotFound />} />
        {/* <Route path='/register' element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
