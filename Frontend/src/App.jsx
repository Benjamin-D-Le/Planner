import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PlannerPage from './pages/PlannerPage'
import CalendarPage from './pages/CalendarPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/planner" replace />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App