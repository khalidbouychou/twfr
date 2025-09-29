import React from 'react'
import { Skeleton } from '../ui/skeleton'

const EsgSkeleton = () => {
  return (
    <div className="p-3 lg:p-6 rounded-lg shadow-md">
      {[0,1,2].map((categoryIndex) => (
        <div key={categoryIndex}>
          {/* Category Title */}
          <div className="mb-2 lg:mb-4 border-b-2 pb-2">
            <Skeleton className="h-4 lg:h-5 w-24 lg:w-32" />
          </div>
          {/* Questions and Options */}
          <div className="p-2">
            {[0,1].map((rowIdx) => (
              <div key={rowIdx} className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full gap-4 mt-4 lg:mt-6 mb-3">
                <div className="w-full lg:w-2/3">
                  <Skeleton className="h-4 lg:h-5 w-4/5" />
                </div>
                <div className="w-full lg:w-1/3">
                  <Skeleton className="h-8 lg:h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default EsgSkeleton 