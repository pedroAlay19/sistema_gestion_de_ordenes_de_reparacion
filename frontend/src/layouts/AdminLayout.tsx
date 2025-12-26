import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon,
  CubeIcon,
  StarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    navigate('/auth/signin');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    {
      name: 'Órdenes',
      href: '/admin/orders',
      icon: ClipboardDocumentListIcon,
    },
    { name: 'Clientes', href: '/admin/clients', icon: UsersIcon },
    {
      name: 'Técnicos',
      href: '/admin/technicians',
      icon: WrenchScrewdriverIcon,
    },
    { name: 'Equipos', href: '/admin/equipment', icon: ComputerDesktopIcon },
    { name: 'Servicios', href: '/admin/services', icon: Cog6ToothIcon },
    { name: 'Repuestos', href: '/admin/spare-parts', icon: CubeIcon },
    { name: 'Reseñas', href: '/admin/reviews', icon: StarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-950" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar Desktop - Supabase Style Collapsed with Hover */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-16 hover:w-64 lg:flex-col transition-all duration-300 ease-in-out group z-50">
        <div className="flex flex-col grow bg-gray-900/50 border-r border-gray-800 backdrop-blur-sm overflow-hidden">
          {/* Logo */}
          <div className="flex items-center px-4 py-5 border-b border-gray-800/50">
            <div className="flex items-center gap-3 min-w-max">
              <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center shrink-0">
                <WrenchScrewdriverIcon className="w-5 h-5 text-white" />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                <h1 className="text-white text-base font-semibold tracking-tight">RepairHub</h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-hidden">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group/item flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all min-w-max ${
                    isActive
                      ? 'bg-gray-800/60 text-white'
                      : 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {item.name}
                    </span>
                    {isActive && (
                      <ChevronRightIcon className="w-5 h-5 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="border-t border-gray-800/50 p-3">
            <div className="flex items-center gap-3 px-3 py-2 mb-1 min-w-max">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center ring-2 ring-gray-700 shrink-0">
                <span className="text-white font-semibold text-xs">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium truncate whitespace-nowrap">
                  {user?.name}
                </p>
                <p className="text-gray-500 text-xs truncate whitespace-nowrap">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-gray-800/40 hover:text-gray-200 rounded-md text-sm font-medium transition-all min-w-max"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Cerrar Sesión
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white text-lg font-bold">RepairHub</h1>
                  <p className="text-gray-400 text-xs">Admin Panel</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-gray-800 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {user?.name}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-16">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between bg-gray-900/50 border-b border-gray-800/50 backdrop-blur-sm px-4 py-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
              <WrenchScrewdriverIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-white text-lg font-semibold">RepairHub</h1>
          </div>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Page Content */}
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
