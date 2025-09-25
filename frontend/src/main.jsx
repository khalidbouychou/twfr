
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { UserProvider } from './components/Context/UserContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <App />
    </UserProvider>
  </QueryClientProvider>
);
