import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import UserLayout from './layouts/UserLayout';
import TechnicianLayout from './layouts/TechnicianLayout';
import LandingPage from './pages/LandingPage.tsx';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';

// User Pages
import MyEquipments from './pages/user/MyEquipments';
import NewEquipment from './pages/user/NewEquipment';
import EquipmentDetail from './pages/user/EquipmentDetail';
import EditEquipment from './pages/user/EditEquipment';
import MyRepairOrders from './pages/user/MyRepairOrders';
import NewRepairOrder from './pages/user/NewRepairOrder';
import RepairOrderDetail from './pages/user/RepairOrderDetail';
import Notifications from './pages/user/Notifications';
import Reviews from './pages/user/Reviews';
import Profile from './pages/user/Profile';
import UserDashboard from './pages/user/UserDashboard.tsx';

// Technician Pages
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import AssignedOrders from './pages/technician/AssignedOrders';
import TechnicianRepairOrderDetail from './pages/technician/TechnicianRepairOrderDetail';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />

          {/* User Routes with Layout */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="equipments" element={<MyEquipments />} />
            <Route path="equipments/new" element={<NewEquipment />} />
            <Route path="equipments/:id" element={<EquipmentDetail />} />
            <Route path="equipments/:id/edit" element={<EditEquipment />} />
            <Route path="repair-orders" element={<MyRepairOrders />} />
            <Route path="repair-orders/new" element={<NewRepairOrder />} />
            <Route path="repair-orders/:id" element={<RepairOrderDetail />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Technician Routes with Layout */}
          <Route path="/technician" element={<TechnicianLayout />}>
            <Route path="dashboard" element={<TechnicianDashboard />} />
            <Route path="orders" element={<AssignedOrders />} />
            <Route path="orders/:id" element={<TechnicianRepairOrderDetail />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
