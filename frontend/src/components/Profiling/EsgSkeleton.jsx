import React from 'react'
import { Skeleton } from '../ui/skeleton'

const EsgSkeleton = () => {
  return (
    <div className="  rounded-lg shadow-md ">
      {[0,1,2].map((categoryIndex) => (
        <div key={categoryIndex}>
          {/* Category Title */}
          <div className="mb-2 border-b-2  pb-2">
            <Skeleton className="h-5 w-32" />
          </div>
          {/* Questions and Options */}
          <div className="p-2">
            {[0,1].map((rowIdx) => (
              <div key={rowIdx} className="flex flex-row items-start justify-between w-full gap-2 mb-3">
                <div className="w-1/1">
                  <Skeleton className="h-5 w-4/5" />
                </div>
                <div className="w-1/3">
                  <Skeleton className="h-10 w-full" />
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