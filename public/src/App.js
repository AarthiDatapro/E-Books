import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import UserHome from './pages/UserHome'
import ProductDetail from './components/User/ProductDetail'
import AdminLanding from './pages/AdminLanding'
import Payments from './pages/Payments'
import AffileHome from './pages/AffileHome'

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
      </Routes>
    </div>
  )
}

export default App