import React from 'react'
import { appfirstname, applastname } from '../config'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-7">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {appfirstname}<span className="text-red-500">{applastname}</span>
            </h2>
            <p className="text-sm mt-1">
              Connecting talent with opportunity.
            </p>
          </div>
 
        </div>

        <div className="max-w-7xl mx-auto px-6   pt-4 border-t border-gray-800 text-sm text-center">
          © 2026 {appfirstname} {applastname} All rights reserved.
        </div>
      </footer>
  )
}
