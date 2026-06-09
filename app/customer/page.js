import { Suspense } from 'react'
import CustomerClient from './CustomerClient'
import Navbar from '@/components/Navbar'

export default function CustomerPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="spinner-wrap"><div className="spinner" /></div>}>
        <CustomerClient />
      </Suspense>
    </>
  )
}
