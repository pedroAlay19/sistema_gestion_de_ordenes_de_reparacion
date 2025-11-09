import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar />
      <div className="flex-1 ml-20">
        <Outlet />
      </div>
    </div>
  );
}
