import React from 'react'
import { Skeleton } from '../ui/skeleton'

const PiSkeleton = () => {
  return (
    <div className="p-2  rounded-lg shadow-md">
      {/* Q1: Checkbox group skeleton with potential text input */}
      <div className=" flex flex-row items-start justify-between w-full  mt-2">
        <div className="w-1/2">
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="w-1/2">
          <div className="flex flex-col items-start gap-3">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="flex items-center gap-4 w-full">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ))}
            {/* Optional "Autres" input skeleton */}
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
      <hr className='border-0.5 border-gray-500 w-full mt-4' />

      {/* Q2: Select row */}
      <div className=" flex flex-row items-start justify-between w-full  mt-2">
        <div className="w-1/2">
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="w-1/2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <hr className='border-0.5 border-gray-500 w-full mt-4' />

      {/* Q3: Select row */}
      <div className=" flex flex-row items-start justify-between w-full  mt-2">
        <div className="w-1/2">
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="w-1/2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <hr className='border-0.5 border-gray-500 w-full mt-4' />

      {/* Q4: Select row */}
      <div className=" flex flex-row items-start justify-between w-full  mt-2">
        <div className="w-1/2">
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="w-1/2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

export default PiSkeleton 