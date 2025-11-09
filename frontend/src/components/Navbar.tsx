import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-semibold text-gray-900 tracking-tight">
              ServicioTec
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Servicios
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Reseñas
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Contacto
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/user/dashboard"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Mi Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-1.5 bg-gray-100 text-gray-900 text-sm rounded-full hover:bg-gray-200 transition-all duration-200"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/signin"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-4 py-1.5 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition-all duration-200"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 bg-white/95 backdrop-blur-xl">
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Servicios
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Reseñas
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Contacto
            </button>
            <div className="pt-3 border-t border-gray-100 space-y-2 px-4">
              {isAuthenticated ? (
                <>
                  <div className="text-sm text-gray-600 py-2">
                    Hola, <span className="font-medium text-gray-900">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 bg-gray-100 text-gray-900 text-sm text-center rounded-full"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm text-gray-600 hover:text-gray-900 py-2"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/auth/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 bg-black text-white text-sm text-center rounded-full"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
