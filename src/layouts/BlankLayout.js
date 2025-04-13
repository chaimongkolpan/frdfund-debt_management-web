// ** React Imports
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'

import "@assets/css/theme.css"
import "@assets/vendors/tilt/tilt.jquery.min.js";
const BlankLayout = () => {
  // ** States
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <main>
      <Outlet />
    </main>
  )
}

export default BlankLayout
