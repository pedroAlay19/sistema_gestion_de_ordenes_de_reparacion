const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
            Visítanos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte con tu dispositivo
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 overflow-hidden">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Nuestra ubicación</h3>
            <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
              <svg className="w-full h-full" viewBox="0 0 700 450" preserveAspectRatio="xMidYMid meet">
                <rect width="700" height="450" fill="#F3F4F6" />
                <rect x="0" y="80" width="700" height="45" fill="#D1D5DB" />
                <line x1="0" y1="102.5" x2="700" y2="102.5" stroke="white" strokeWidth="1.5" strokeDasharray="15,12" />
                <rect x="0" y="205" width="700" height="60" fill="#D1D5DB" />
                <line x1="0" y1="235" x2="700" y2="235" stroke="white" strokeWidth="2" strokeDasharray="20,15" />
                <rect x="0" y="350" width="700" height="45" fill="#D1D5DB" />
                <line x1="0" y1="372.5" x2="700" y2="372.5" stroke="white" strokeWidth="1.5" strokeDasharray="15,12" />
                <rect x="120" y="0" width="45" height="450" fill="#D1D5DB" />
                <line x1="142.5" y1="0" x2="142.5" y2="450" stroke="white" strokeWidth="1.5" strokeDasharray="15,12" />
                <rect x="320" y="0" width="60" height="450" fill="#D1D5DB" />
                <line x1="350" y1="0" x2="350" y2="450" stroke="white" strokeWidth="2" strokeDasharray="20,15" />
                <rect x="535" y="0" width="45" height="450" fill="#D1D5DB" />
                <line x1="557.5" y1="0" x2="557.5" y2="450" stroke="white" strokeWidth="1.5" strokeDasharray="15,12" />
                <rect x="30" y="20" width="70" height="45" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" rx="4" />
                <rect x="180" y="140" width="80" height="50" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" rx="4" />
                <rect x="410" y="145" width="70" height="45" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" rx="4" />
                <rect x="495" y="140" width="60" height="50" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" rx="4" />
                <rect x="35" y="290" width="65" height="45" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" rx="4" />
                <rect x="180" y="285" width="75" height="50" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" rx="4" />
                <rect x="410" y="285" width="70" height="50" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" rx="4" />
                <rect x="595" y="290" width="75" height="55" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" rx="4" />
                <circle cx="620" cy="155" r="50" fill="#86EFAC" opacity="0.6" />
                <text x="620" y="165" textAnchor="middle" fontSize="32">&#127795;</text>
                <text x="620" y="190" textAnchor="middle" fill="#166534" fontSize="12" fontWeight="600">Parque</text>
                <rect x="270" y="125" width="120" height="110" fill="#1F2937" stroke="#111827" strokeWidth="4" rx="8" />
                <circle cx="330" cy="165" r="22" fill="#EF4444" />
                <text x="330" y="175" textAnchor="middle" fontSize="26">&#128295;</text>
                <text x="330" y="210" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">SERVICIO</text>
                <text x="330" y="228" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">TECNICO</text>
                <rect x="15" y="270" width="145" height="26" fill="white" rx="13" opacity="0.95" stroke="#9CA3AF" strokeWidth="1" />
                <text x="87.5" y="288" textAnchor="middle" fill="#1F2937" fontSize="13" fontWeight="700">AV. PRINCIPAL</text>
                <rect x="355" y="15" width="28" height="90" fill="white" rx="14" opacity="0.95" stroke="#9CA3AF" strokeWidth="1" />
                <text x="369" y="60" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="700" transform="rotate(90 369 60)">CALLE CENTRAL</text>
                <circle cx="220" cy="235" r="16" fill="#3B82F6" stroke="white" strokeWidth="2" />
                <text x="220" y="244" textAnchor="middle" fontSize="20">&#128652;</text>
                <circle cx="480" cy="235" r="16" fill="#3B82F6" stroke="white" strokeWidth="2" />
                <text x="480" y="244" textAnchor="middle" fontSize="20">&#128652;</text>
                <circle cx="650" cy="40" r="30" fill="white" opacity="0.95" stroke="#1F2937" strokeWidth="2.5" />
                <polygon points="650,18 654,40 650,36 646,40" fill="#EF4444" />
                <text x="650" y="63" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">N</text>
              </svg>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4 flex items-center justify-center gap-2">
              <span className="text-lg">&#128205;</span>
              <span>Av. Principal con Calle Central - Quito, Ecuador</span>
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Telefono</h3>
                  <p className="text-gray-600 mb-2">Llamanos de lunes a sabado</p>
                  <a href="tel:+593987654321" className="text-black font-medium hover:text-gray-700 transition-colors">+593 98 765 4321</a>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600 mb-2">Respuesta en 24 horas</p>
                  <a href="mailto:soporte@serviciotec.com" className="text-black font-medium hover:text-gray-700 transition-colors">soporte@serviciotec.com</a>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Horarios</h3>
                  <div className="space-y-1">
                    <p className="text-gray-600">Lunes - Viernes: 9:00 - 18:00</p>
                    <p className="text-gray-600">Sabados: 9:00 - 14:00</p>
                    <p className="text-black font-medium mt-2">Soporte 24/7 online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
