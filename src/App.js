import React, { Suspense } from 'react'

import Router from './router/Router'
import Spinner from "./@core/components/spinner/Fallback-spinner";

import "./index.scss"

function App() {
  return (
  <Suspense fallback={<Spinner />}>
     <Router />
  </Suspense>
  )
}

export default App
