import UserApp from './modules/user/UserApp.jsx'
import AdminApp from './modules/admin/AdminApp.jsx'
import { Route, Routes } from 'react-router-dom'
import ToasterHost from './components/ToasterHost.jsx'

export default function App() {
  return (
    <>
      <ToasterHost />
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<UserApp />} />
      </Routes>
    </>
  )
}
