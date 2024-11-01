import React from 'react'
import LoginPage from './pages/LoginPage'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CareTakerSignUp from './pages/CareTakerSignUp'
import StudentSignUp from './pages/StudentSignUp'
import ApplyOuting from './pages/ApplyOuting'
import OutingHistory from './pages/OutingHistory'
import OutingStatus from './pages/OutingStatus'
import CaretakerWelcome from './pages/CaretakerWelcome'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage/>}/>
      <Route path="/caretaker/register" element={<CareTakerSignUp/>}/>
      <Route path="/student/register" element={<StudentSignUp/>}/>
      <Route path="/welcome" element={<LandingPage/>}/>
      <Route path="/apply" element={<ApplyOuting/>}/>
      <Route path="/history" element={<OutingHistory/>}/>
      <Route path="/status" element={<OutingStatus/>}/>
      <Route path="/caretakerwelcome" element={<CaretakerWelcome/>}/>
    </Routes>
  )
}

export default App