import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import Navbar from '../components/Navbar.jsx';

import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import ChangePassword from '../pages/ChangePassword.jsx';

import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminUsers from '../pages/admin/Users.jsx';
import AdminUserDetail from '../pages/admin/UserDetail.jsx';
import AddUser from '../pages/admin/AddUser.jsx';
import AdminStores from '../pages/admin/Stores.jsx';
import AddStore from '../pages/admin/AddStore.jsx';

import UserStoreList from '../pages/user/StoreList.jsx';

import StoreOwnerDashboard from '../pages/storeOwner/Dashboard.jsx';

// Every logged-in page shares the same nav bar on top.
function withNavbar(element) {
  return (
    <>
      <Navbar />
      {element}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public landing page — describes the app, has the Login button */}
          <Route path="/" element={withNavbar(<Home />)} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>{withNavbar(<ChangePassword />)}</ProtectedRoute>
            }
          />

          {/* Normal user */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute roles={['normal']}>{withNavbar(<UserStoreList />)}</ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>{withNavbar(<AdminDashboard />)}</ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={['admin']}>{withNavbar(<AdminUsers />)}</ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute roles={['admin']}>{withNavbar(<AdminUserDetail />)}</ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/new"
            element={
              <ProtectedRoute roles={['admin']}>{withNavbar(<AddUser />)}</ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute roles={['admin']}>{withNavbar(<AdminStores />)}</ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores/new"
            element={
              <ProtectedRoute roles={['admin']}>{withNavbar(<AddStore />)}</ProtectedRoute>
            }
          />

          {/* Store Owner */}
          <Route
            path="/store-owner"
            element={
              <ProtectedRoute roles={['store_owner']}>
                {withNavbar(<StoreOwnerDashboard />)}
              </ProtectedRoute>
            }
          />

          {/* Unknown URL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
