import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSolicitarServicio = () => {
    if (isAuthenticated) {
      // Si está autenticado, ir a la página de servicios (por ahora solo scroll)
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Si no está autenticado, redirigir a registro
      navigate("/auth/signup");
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-black pt-14"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-full mb-6 animate-fade-in border border-gray-700">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-gray-300 tracking-wide">
            Disponible 24/7
          </span>
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold text-white mb-6 tracking-tight leading-[1.05] animate-slide-up">
          Tu equipo en
          <br />
          <span className="bg-linear-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
            buenas manos
          </span>
        </h1>

        {/* Subtítulo */}
        <p
          className="text-lg sm:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Reparación profesional de dispositivos electrónicos.
          <br className="hidden sm:block" />
          Diagnóstico gratuito. Garantía en cada servicio.
        </p>

        {/* Botones */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <button
            onClick={handleSolicitarServicio}
            className="px-8 py-3 bg-white text-black text-base font-medium rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isAuthenticated ? "Solicitar servicio" : "Registrarse para solicitar"}
          </button>
          <button
            onClick={() =>
              document
                .getElementById("services")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 bg-transparent text-white text-base font-medium rounded-full border border-gray-600 hover:border-gray-400 hover:bg-gray-800/50 transition-all duration-200"
          >
            Ver servicios
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
