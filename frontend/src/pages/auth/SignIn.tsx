import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types/auth.types";
import type { Technician } from "../../api";

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userProfile = await signIn(email, password);
      
      console.log('👤 Perfil recibido:', userProfile);
      
      // Redirigir según el rol del usuario
      if (userProfile.role === UserRole.TECHNICIAN) {
        const techProfile = userProfile as Technician;
        console.log('🔧 Es técnico - isEvaluator:', techProfile.isEvaluator);
        
        if (techProfile.isEvaluator === true) {
          console.log('✅ Redirigiendo a /technician/orders (evaluador)');
          navigate("/technician/orders");
        } else {
          console.log('✅ Redirigiendo a /technician/my-tasks (técnico regular)');
          navigate("/technician/my-tasks");
        }
      } else if (userProfile.role === UserRole.ADMIN) {
        console.log('✅ Redirigiendo a /admin/dashboard');
        navigate("/admin/dashboard");
      } else {
        console.log('✅ Redirigiendo a /user/equipments');
        navigate("/user/equipments");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              ServicioTec
            </h1>
          </Link>
          <p className="text-gray-600">Bienvenido de nuevo</p>
        </div>

        {/* Card de login */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Iniciar sesión
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder="tu@email.com"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">o</span>
            </div>
          </div>

          {/* Link a registro */}
          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link
              to="/auth/signup"
              className="font-medium text-black hover:text-gray-700 transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Link a inicio */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
