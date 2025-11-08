import { useState, useEffect, useRef, useCallback } from "react";
// import type { BestReviewI } from "../interfaces/Review";
// import { getBestsReviews } from "../api/api";

const Reviews = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // const [bestsReviews, setBestsReviews] = useState<BestReviewI[]>([]);

  // useEffect(() => {
  //   const fetchBestReviews = async () => {
  //     const data = await getBestsReviews();
  //     setBestsReviews(data);
  //     console.log(data);
  //   };
  //   fetchBestReviews();
  // }, []);

  const reviews = [
    {
      id: 1,
      name: "María García",
      role: "Diseñadora",
      avatar: "MG",
      rating: 5,
      comment:
        "Excelente servicio. Repararon mi iPhone en menos de 30 minutos. Personal muy profesional y amable.",
      device: "iPhone 14 Pro",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Empresario",
      avatar: "CR",
      rating: 5,
      comment:
        "La atención es de primera. Mi Samsung quedó como nuevo después de la reparación de pantalla.",
      device: "Samsung Galaxy S23",
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Estudiante",
      avatar: "AM",
      rating: 5,
      comment:
        "Precios justos y trabajo garantizado. Recomendado al 100%. Muy satisfecha con el resultado.",
      device: "iPhone 13",
    },
    {
      id: 4,
      name: "Luis Fernández",
      role: "Ingeniero",
      avatar: "LF",
      rating: 5,
      comment:
        "Rápidos y eficientes. Además me explicaron todo el proceso. Volveré sin duda.",
      device: "iPhone 12",
    },
    {
      id: 5,
      name: "Patricia Silva",
      role: "Médica",
      avatar: "PS",
      rating: 5,
      comment:
        "Salvaron todos mis datos al reparar mi teléfono. Increíble servicio técnico especializado.",
      device: "Samsung Note 20",
    },
    {
      id: 6,
      name: "Diego Herrera",
      role: "Fotógrafo",
      avatar: "DH",
      rating: 5,
      comment:
        "El diagnóstico gratuito me ayudó a entender el problema. Gran equipo de profesionales!",
      device: "Samsung S23",
    },
  ];

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 320;
      const gap = 24;
      const scrollPosition = index * (cardWidth + gap);
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const handleManualScroll = (index: number) => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    scrollToIndex(index);
    setTimeout(() => {
      startAutoPlay();
    }, 5000);
  };

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % reviews.length;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, 4000);
  }, [reviews.length]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [startAutoPlay]);

  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
            Nuestros clientes opinan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Miles de clientes confían en nosotros
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
            <div className="text-5xl font-semibold text-gray-900 mb-2">4.9</div>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="text-sm text-gray-600">Calificación</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
            <div className="text-5xl font-semibold text-gray-900 mb-2">
              1.2K+
            </div>
            <div className="text-sm text-gray-600 mt-4">Reseñas</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
            <div className="text-5xl font-semibold text-gray-900 mb-2">98%</div>
            <div className="text-sm text-gray-600 mt-4">Satisfacción</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
            <div className="text-5xl font-semibold text-gray-900 mb-2">95%</div>
            <div className="text-sm text-gray-600 mt-4">5 Estrellas</div>
          </div>
        </div>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-none w-80 md:w-96 snap-center"
              >
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 h-full">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-gray-900"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-900 leading-relaxed mb-6 text-base">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold text-sm">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {review.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {review.device}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => handleManualScroll(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-gray-900 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
