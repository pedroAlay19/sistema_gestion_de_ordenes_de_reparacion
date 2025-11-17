import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeftCircleIcon, BellIcon, ChartBarIcon, ComputerDesktopIcon, HomeIcon, StarIcon, UserCircleIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

export default function UserSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      path: '/user/dashboard',
      icon: (
        <ChartBarIcon className="w-6 h-6" />
      ),
      label: 'Dashboard',
    },
    {
      path: '/user/equipments',
      icon: (
        <ComputerDesktopIcon className="w-6 h-6" />
      ),
      label: 'Equipos',
    },
    {
      path: '/user/repair-orders',
      icon: (
        <WrenchScrewdriverIcon className="w-6 h-6" />
      ),
      label: 'Órdenes',
    },
    {
      path: '/user/notifications',
      icon: (
        <BellIcon className="w-6 h-6" />
      ),
      label: 'Notificaciones',
    },
    {
      path: '/user/reviews',
      icon: (
        <StarIcon className="w-6 h-6" />
      ),
      label: 'Reseñas',
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-black flex flex-col items-center py-8 z-50">
      {/* Logo */}
      <div className="mb-12">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
          <HomeIcon className="w-6 h-6 text-black ml-1 mr-1" />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all group relative ${
              isActive(item.path)
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {item.icon}
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="mt-auto flex flex-col gap-4">
        {/* Profile */}
        <Link
          to="/user/profile"
          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all group relative ${
            isActive('/user/profile')
              ? 'bg-white text-black'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <UserCircleIcon className="w-6 h-6" />
          <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Perfil
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={() => {
            signOut();
            navigate('/');
          }}
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all group relative"
        >
          <ArrowLeftCircleIcon className="w-6 h-6" />
          <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Salir
          </div>
        </button>
      </div>
    </div>
  );
}
