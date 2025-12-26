import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validación frontend: verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validación frontend: mínimo 6 caracteres (coincide con tu backend)
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setIsLoading(true);
    try {
      await signUp(name, email, password);
      navigate("/user/equipments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
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
          <p className="text-gray-600">Crea tu cuenta</p>
        </div>

        {/* Card de registro */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Registrarse
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre completo */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder="Hector Pedro"
                disabled={isLoading}
              />
            </div>

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
              <p className="mt-1.5 text-xs text-gray-500">
                Mínimo 6 caracteres
              </p>
            </div>

            {/* Confirmar Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start gap-3 pt-2">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-gray-300 text-black focus:ring-gray-900"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Acepto los{" "}
                <a
                  href="#"
                  className="text-black font-medium hover:text-gray-700 transition-colors"
                >
                  términos y condiciones
                </a>{" "}
                y la{" "}
                <a
                  href="#"
                  className="text-black font-medium hover:text-gray-700 transition-colors"
                >
                  política de privacidad
                </a>
              </label>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
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

          {/* Link a login */}
          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/auth/signin"
              className="font-medium text-black hover:text-gray-700 transition-colors"
            >
              Inicia sesión
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

export default SignUp;
