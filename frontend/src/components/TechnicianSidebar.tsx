import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  WrenchScrewdriverIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import type { Technician } from '../types/technician.types';

export default function TechnicianSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Técnico evaluador solo ve "Órdenes", técnico normal ve "Mis Tareas"
  const isEvaluator = (user as Technician)?.isEvaluator === true;

  const menuItems = isEvaluator
    ? [
        {
          path: '/technician/orders',
          icon: WrenchScrewdriverIcon,
          label: 'Órdenes',
        },
      ]
    : [
        {
          path: '/technician/my-tasks',
          icon: WrenchScrewdriverIcon,
          label: 'Mis Tareas',
        },
      ];

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-linear-to-b bg-black flex flex-col items-center py-8 z-50 shadow-xl">
      {/* Logo */}
      <div className="mb-12">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <WrenchScrewdriverIcon className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all group relative ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-6 h-6" />
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto flex flex-col gap-4">
        {/* Profile */}
        <Link
          to="/technician/profile"
          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all group relative ${
            isActive('/technician/profile')
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <UserIcon className="w-6 h-6" />
          <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
            Mi Perfil
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
          <ArrowRightOnRectangleIcon className="w-6 h-6" />
          <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
            Cerrar Sesión
          </div>
        </button>
      </div>
    </div>
  );
}
