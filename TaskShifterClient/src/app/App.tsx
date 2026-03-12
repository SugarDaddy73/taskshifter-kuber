import './index.css'
import Header from '@/widgets/header/ui/Header'
import Footer from '@/widgets/footer/ui/Footer'
import { useAuthStore } from "@/shared/lib/hooks/useAuthStore"
import AuthPage from "@/pages/auth/ui/AuthPage"
import { DashboardPage } from '@/pages/dashboard/ui/DashboardPage'
import { Toaster } from '@/shared/ui/sonner'
import { useLogout } from '@/shared/lib/useLogout'
import { useEffect } from 'react'
import { setLogoutFunction } from '@/shared/api'

function App() {
  const isAuthenticated = useAuthStore().isAuthenticated;
  const logout = useLogout();

  useEffect(() => {
    setLogoutFunction(logout);
  }, [logout]);


  return (
    <div className='min-h-full w-full flex flex-col'>
      <Header />
      <main className='flex w-full h-full grow'>
        {!isAuthenticated && (
          <AuthPage />
        )}
        {isAuthenticated && (
          <DashboardPage />
        )}
      </main>
      <Toaster position="bottom-right" richColors />
      <Footer />
    </div>
  )
}

export default App
