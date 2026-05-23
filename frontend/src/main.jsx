import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { BrowserRouter } from 'react-router'
import {
  QueryClient,
  QueryClientProvider,

} from '@tanstack/react-query'
// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ClerkProvider 
            publishableKey={PUBLISHABLE_KEY}
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: '#0d9488', // Elegant Teal Accent
                colorBackground: '#12151e', // Premium Charcoal Base
                colorInputBackground: '#1c1f2a', // Sleek dark input background
                colorInputText: '#f8fafc',
                colorText: '#f8fafc',
                colorTextSecondary: '#94a3b8',
                colorBorder: '#272d3d',
              }
            }}
          >
              <App />
          </ClerkProvider>
        </QueryClientProvider>
      </BrowserRouter>
  </StrictMode>,
  
)
