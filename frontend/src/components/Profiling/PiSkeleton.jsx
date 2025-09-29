import React from 'react'
import { Skeleton } from '../ui/skeleton'

const PiSkeleton = () => {
  return (
    <div className="p-3 lg:p-6 rounded-lg shadow-md">
      {/* Q1: Checkbox group skeleton with potential text input */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full gap-4 mt-4 lg:mt-6">
        <div className="w-full lg:w-1/2">
          <Skeleton className="h-4 lg:h-5 w-4/5" />
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col items-start gap-2 lg:gap-3">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="flex items-center gap-2 lg:gap-4 w-full">
                <Skeleton className="h-4 w-4 lg:h-5 lg:w-5 rounded" />
                <Skeleton className="h-4 lg:h-5 w-1/2" />
              </div>
            ))}
            {/* Optional "Autres" input skeleton */}
            <Skeleton className="h-6 lg:h-8 w-full" />
          </div>
        </div>
      </div>
      <hr className='border-0.5 border-gray-500 w-full mt-4' />

      {/* Q2: Select row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full gap-4 mt-4 lg:mt-6">
        <div className="w-full lg:w-1/2">
          <Skeleton className="h-4 lg:h-5 w-3/4" />
        </div>
        <div className="w-full lg:w-1/2">
          <Skeleton className="h-8 lg:h-10 w-full" />
        </div>
      </div>
      <hr className='border-0.5 border-gray-500 w-full mt-4' />

      {/* Q3: Select row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full gap-4 mt-4 lg:mt-6">
        <div className="w-full lg:w-1/2">
          <Skeleton className="h-4 lg:h-5 w-3/4" />
        </div>
        <div className="w-full lg:w-1/2">
          <Skeleton className="h-8 lg:h-10 w-full" />
        </div>
      </div>
      <hr className='border-0.5 border-gray-500 w-full mt-4' />

      {/* Q4: Select row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full gap-4 mt-4 lg:mt-6">
        <div className="w-full lg:w-1/2">
          <Skeleton className="h-4 lg:h-5 w-3/4" />
        </div>
        <div className="w-full lg:w-1/2">
          <Skeleton className="h-8 lg:h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

export default PiSkeleton 