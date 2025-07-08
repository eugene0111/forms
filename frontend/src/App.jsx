import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Creation } from "./pages/Creation";
import { UserDashboard } from "./pages/UserDashboard";
import { ViewResponses } from "./pages/ViewResponses";
import { DeleteForm } from "./pages/Delete";
import { AddUser } from "./pages/AddUser";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/create-form' element={<Creation />} />
          <Route path='/user-dashboard' element={<UserDashboard />} />
          <Route path='/view-responses' element={<ViewResponses />} />
          <Route path='/delete' element={<DeleteForm />} />
          <Route path='/add-user' element={<AddUser />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
