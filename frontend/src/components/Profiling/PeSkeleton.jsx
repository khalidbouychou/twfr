import React from 'react'
import { Skeleton } from '../ui/skeleton'

const PeSkeleton = () => {
  return (
    <div className="p-3 lg:p-6 mt-2 rounded-lg shadow-md">
      {/* Row 1: Question + radio row skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full gap-4 mt-4 lg:mt-8">
        <div className="w-full lg:w-1/2">
          <Skeleton className="h-4 lg:h-5 w-4/5" />
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-8 justify-start">
            {[0,1,2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 lg:h-5 lg:w-5 rounded-full" />
                <Skeleton className="h-4 lg:h-5 w-16 lg:w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className='border-0.5 border-gray-500 w-full mt-4' />

      {/* Following rows: question + select skeleton */}
      {[0,1,2,3].map((i) => (
        <div key={i}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full gap-4 mt-4 lg:mt-6">
            <div className="w-full lg:w-1/2">
              <Skeleton className="h-4 lg:h-5 w-4/5" />
            </div>
            <div className="w-full lg:w-1/2">
              <Skeleton className="h-8 lg:h-10 w-full" />
            </div>
          </div>
          {i !== 3 && <hr className='border-0.5 border-gray-500 w-full mt-4' />}
        </div>
      ))}
    </div>
  )
}

export default PeSkeleton 