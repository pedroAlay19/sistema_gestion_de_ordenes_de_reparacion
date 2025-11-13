import { Outlet } from 'react-router-dom';
import TechnicianSidebar from '../components/TechnicianSidebar';

export default function TechnicianLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TechnicianSidebar />
      <div className="flex-1 ml-20">
        <Outlet />
      </div>
    </div>
  );
}
