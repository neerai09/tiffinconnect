import { Suspense } from 'react'
import TiffinClient from './TiffinClient'
import Navbar from '@/components/Navbar'

export default function TiffinPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="spinner-wrap"><div className="spinner" /></div>}>
        <TiffinClient />
      </Suspense>
    </>
  )
}
