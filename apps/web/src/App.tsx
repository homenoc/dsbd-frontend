import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from './pages/Login/SignIn'
import Dashboard from './pages/Dashboard/Dashboard'
import SignUp from './pages/Login/SignUp'
import PasswordRecovery from './pages/Login/PasswordRecovery'
import { PrivateRoute } from './routes/PrivateRoute'
import Info from './pages/Info/Info'
import Support from './pages/Support/Support'
import SupportDetail from './pages/Support/SupportDetail/SupportDetail'
import Add from './pages/Add/Add'
import Procedure from './pages/Procedure/Procedure'
import UserList from './pages/Procedure/UserList/UserList'
import UserDetail from './pages/Procedure/UserList/UserDetail/UserDetail'
import ServiceList from './pages/Procedure/ServiceList/ServiceList'
import ConnectionList from './pages/Procedure/ConnectionList/ConnectionList'
import Payment from './pages/Payment/Payment'
import { restfulApiConfig } from './api/Config'
import GroupAdd from './pages/Add/GroupAdd/GroupAdd'
import ServiceAdd from './pages/Add/ServiceAdd/ServiceAdd'
import ConnectionAdd from './pages/Add/ConnectionAdd/ConnectionAdd'
import NotFound from './pages/Etc/404'
import Feedback from "./pages/Feedback/Feedback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<SignIn />} /> {/*not foundの時*/}
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forget" element={<PasswordRecovery />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute children={<Dashboard />} />}
        />
        {restfulApiConfig.enableMoney && (
          <Route
            path="/dashboard/payment"
            element={<PrivateRoute children={<Payment />} />}
          />
        )}
        <Route
          path="/dashboard/add"
          element={<PrivateRoute children={<Add />} />}
        />
        <Route
          path="/dashboard/add/group"
          element={<PrivateRoute children={<GroupAdd />} />}
        />
        <Route
          path="/dashboard/add/service"
          element={<PrivateRoute children={<ServiceAdd />} />}
        />
        <Route
          path="/dashboard/add/connection"
          element={<PrivateRoute children={<ConnectionAdd />} />}
        />
        <Route
          path="/dashboard/info"
          element={<PrivateRoute children={<Info />} />}
        />
        <Route
          path="/dashboard/support"
          element={<PrivateRoute children={<Support />} />}
        />
        <Route
          path="/dashboard/support/:id"
          element={<PrivateRoute children={<SupportDetail />} />}
        />
        <Route
          path="/dashboard/procedure"
          element={<PrivateRoute children={<Procedure />} />}
        />
        <Route
          path="/dashboard/procedure/user"
          element={<PrivateRoute children={<UserList />} />}
        />
        <Route
          path="/dashboard/procedure/user/:id"
          element={<PrivateRoute children={<UserDetail />} />}
        />
        <Route
          path="/dashboard/procedure/service"
          element={<PrivateRoute children={<ServiceList />} />}
        />
        <Route
          path="/dashboard/procedure/connection"
          element={<PrivateRoute children={<ConnectionList />} />}
        />
        <Route
          path="/dashboard/feedback"
          element={<PrivateRoute children={<Feedback />} />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
