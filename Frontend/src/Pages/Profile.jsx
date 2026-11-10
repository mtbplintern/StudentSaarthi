
import React, { useEffect, useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Shield,
  LogOut,
  Edit3,
  X,
  Save,
  Loader2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { backendurl } from '../config'
import toast from 'react-hot-toast'

export default function Profile() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  })

  const [originalData, setOriginalData] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const GetUserdata = async () => {
    try {
      setLoading(true)

      const request = await axios.get(
        `${backendurl}/auth/userdata`,
        { withCredentials: true }
      )

      if (request.data.success) {
        const user = request.data.userdata

        const data = {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || ''
        }

        setFormData(data)
        setOriginalData(data)
      } else {
        toast.error(request.data.message || 'Unable to load profile')
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    GetUserdata()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.name.trim().length < 3) {
      return toast.error('Name must contain at least 3 characters')
    }

    try {
      setSaving(true)

      const request = await axios.put(
        `${backendurl}/auth/edit-profile`,
        { userdata: formData },
        { withCredentials: true }
      )

      if (request.data.success) {
        toast.success('Profile updated successfully')

        setOriginalData({ ...formData })
        setIsEditing(false)
      } else {
        toast.error(request.data.message || 'Profile update failed')
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Profile update failed'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({ ...originalData })
    setIsEditing(false)
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true)

      const request = await axios.get(
        `${backendurl}/auth/logout`,
        {},
        { withCredentials: true }
      )

      if (request.data.success) {
        toast.success('Logout successful')
        navigate('/login')
      } else {
        toast.error(request.data.message || 'Logout failed')
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Logout failed'
      )
    } finally {
      setLoggingOut(false)
    }
  }

  const fields = [
    {
      name: 'name',
      label: 'Full Name',
      icon: User,
      type: 'text',
      editable: true
    },
    {
      name: 'email',
      label: 'Email Address',
      icon: Mail,
      type: 'email',
      editable: false
    },
    {
      name: 'phone',
      label: 'Phone Number',
      icon: Phone,
      type: 'tel',
      editable: false
    }
  ]

  const inputClass = `
    w-full rounded-xl border border-gray-200 bg-white
    py-3 pl-11 pr-4 text-sm text-gray-800
    outline-none transition-all duration-200
    placeholder:text-gray-400
    focus:border-red-500 focus:ring-4 focus:ring-red-50
    disabled:bg-gray-50 disabled:text-gray-500
  `

  const initials = formData.name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (loading) {
    return (
      <div className="min-h-[92vh] flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-9 h-9 animate-spin text-red-600" />
        <p className="mt-3 text-sm font-medium text-gray-500">
          Loading your profile...
        </p>
      </div>
    )
  }

  if (!originalData.name) {
    return (
      <div className="min-h-[92vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <User size={40} className="text-gray-300" />
        <h2 className="mt-4 text-lg font-bold text-gray-800">
          Profile unavailable
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          We couldn't load your account information.
        </p>
        <button
          onClick={GetUserdata}
          className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[92vh] bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">

        {/* Page Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          {/* Profile Header */}
          <div className="bg-linear-to-r from-red-600 to-red-700 px-5 py-7 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">

              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white text-xl font-bold text-red-600 shadow-sm">
                  {initials}
                </div>

                <div className="min-w-0 text-white">
                  <h2 className="truncate text-xl font-bold">
                    {formData.name}
                  </h2>

                  <p className="mt-1 truncate text-sm text-red-100">
                    {formData.email}
                  </p>

                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                    <Shield size={13} />
                    {formData.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-60"
              >
                {loggingOut
                  ? <Loader2 size={16} className="animate-spin" />
                  : <LogOut size={16} />
                }
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>

            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-8">

            <div className="mb-7 flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Update and manage your account details.
                </p>
              </div>

              <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                isEditing
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {isEditing ? 'Edit Mode' : 'View Mode'}
              </span>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {fields.map(field => {
                const Icon = field.icon

                return (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      {field.label}
                    </label>

                    <div className="relative">
                      <Icon
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-500"
                      />

                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        disabled={!isEditing || !field.editable}
                        placeholder={`Enter ${field.label}`}
                        autoComplete={
                          field.name === 'name'
                            ? 'name'
                            : field.name
                        }
                        required
                        className={inputClass}
                      />
                    </div>

                    {!field.editable && (
                      <p className="mt-1.5 text-xs text-gray-400">
                        This information cannot be edited here.
                      </p>
                    )}
                  </div>
                )
              })}

              {/* Account Role */}
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Account Role
                </label>

                <div className="relative">
                  <Shield
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-500"
                  />

                  <input
                    id="role"
                    type="text"
                    value={formData.role}
                    readOnly
                    className={inputClass}
                  />
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    <X size={17} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? <Loader2 size={17} className="animate-spin" />
                      : <Save size={17} />
                    }
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                >
                  <Edit3 size={17} />
                  Update Profile
                </button>
              )}

            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-gray-400">
          Keep your account information safe and up to date.
        </p>

      </div>
    </div>
  )
}
