import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import UserHome from './pages/UserHome'
import ProductDetail from './components/User/ProductDetail'
import AdminLanding from './pages/AdminLanding'
import Payments from './pages/Payments'
import AffileHome from './pages/AffileHome'
import Terms from './components/Terms'
import Cancel from './components/Cancel'
import Privacy from './components/Privacy'
import ReferralRedirect from './pages/ReferralRedirect'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/userHome' element={<UserHome/>}/>
        <Route path='/adminHome'element={<AdminLanding />}/>
        <Route path='/affiliatorHome' element={<AffileHome/>}/>
        <Route path='/productDetails' element={<ProductDetail />}/>
        <Route path='/payments' element={<Payments />}/>
        <Route path = "/terms-and-conditions" element={<Terms/>}/>
        <Route path='/cancel-and-refund-policy' element={<Cancel />} />
        <Route path='/privacy-policy' element={<Privacy />} />
        <Route path="/userHome/r/:shortId" element={<ReferralRedirect />} />
        <Route path='*' element={<Navigate to="/userHome"/>}/>
      </Routes>
    </div>
  )
}

export default App