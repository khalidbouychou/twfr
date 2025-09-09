import React from 'react'
import { Skeleton } from '../ui/skeleton'

const CcSkeleton = () => {
  return (
    <div className="p-2 mt-2  rounded-lg shadow-md">
      {/* Row 1: select */}
      <div className=" flex flex-row items-start justify-between w-full gap-4 mt-4">
        <div className="w-1/2">
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="w-1/2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <hr className='border-0.5 border-gray-500 w-full mt-4' />

      {/* Row 2: radio */}
      <div className=" flex flex-row items-start justify-between w-full gap-4 mt-4">
        <div className="w-1/2">
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="w-1/2">
          <div className="flex gap-10 justify-start">
            {[0,1].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className='border-0.5 border-gray-500 w-full mt-4' />

      {/* Row 3: select */}
      <div className=" flex flex-row items-start justify-between w-full gap-4 mt-4">
        <div className="w-1/2">
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="w-1/2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <hr className='border-0.5 border-gray-500 w-full mt-4' />

      {/* Row 4: select */}
      <div className=" flex flex-row items-start justify-between w-full gap-4 mt-4">
        <div className="w-1/2">
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="w-1/2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <hr className='border-0.5 border-gray-500 w-full mt-4' />

      {/* Row 5: select */}
      <div className=" flex flex-row items-start justify-between w-full gap-4 mt-4">
        <div className="w-1/2">
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="w-1/2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

export default CcSkeleton 