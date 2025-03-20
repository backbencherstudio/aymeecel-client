import React from 'react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </div>
  )
}
