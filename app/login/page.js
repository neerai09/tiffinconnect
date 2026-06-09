import { Suspense } from 'react'
import LoginClient from './LoginClient'
import Navbar from '@/components/Navbar'

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
        </div>
      }>
        <LoginClient />
      </Suspense>
    </>
  )
}
