import { Suspense } from 'react'
import ProviderClient from './ProviderClient'
import Navbar from '@/components/Navbar'

export default function ProviderPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="spinner-wrap"><div className="spinner" /></div>}>
        <ProviderClient />
      </Suspense>
    </>
  )
}
