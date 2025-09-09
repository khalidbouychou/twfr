import React, { createContext, useContext } from 'react'

const LoadingContext = createContext({ isLoading: false })

export const LoadingProvider = ({ isLoading, children }) => {
  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)