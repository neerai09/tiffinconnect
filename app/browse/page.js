import { Suspense } from 'react'
import BrowseClient from './BrowseClient'
import Navbar from '@/components/Navbar'

export default function BrowsePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="spinner-wrap"><div className="spinner" /></div>}>
        <BrowseClient />
      </Suspense>
    </>
  )
}
