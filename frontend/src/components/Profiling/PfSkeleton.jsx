import React from 'react'
import { Skeleton } from '../ui/skeleton'

const PfSkeleton = () => {
  return (
    <div className="p-3 lg:p-6 rounded-lg shadow-md">
      {[0,1,2,3].map((i) => (
        <div key={i}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full gap-4 mt-4 lg:mt-6">
            <div className="w-full lg:w-1/2">
              <Skeleton className="h-4 lg:h-5 w-4/5" />
            </div>
            <div className="w-full lg:w-1/2">
              {i === 3 ? (
                <div className="flex flex-col items-start gap-2 lg:gap-3">
                  {[0,1,2,3,4,5].map((j) => (
                    <div key={j} className="flex items-center gap-2 lg:gap-4 w-full">
                      <Skeleton className="h-4 w-4 lg:h-5 lg:w-5" />
                      <Skeleton className="h-4 lg:h-5 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <Skeleton className="h-8 lg:h-10 w-full" />
              )}
            </div>
          </div>
          {i !== 3 && <hr className='border-0.5 border-gray-500 w-full mt-4' />}
        </div>
      ))}
    </div>
  )
}

export default PfSkeleton 