import { useState, useEffect, useRef, useCallback } from "react";
import { getServices } from "../api/api";
import type { Service } from "../interfaces/Service";

const Services = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [servicesData, setServicesData] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const data = await getServices();
      setServicesData(data);
      console.log(data);
    };

    fetchServices();
  }, []);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // w-80 = 320px
      const gap = 24; // gap-6 = 24px
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
        const nextIndex = (prevIndex + 1) % servicesData.length;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, 3000); // Move every 3 seconds
  }, [servicesData.length]);

  useEffect(() => {
    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [startAutoPlay]);

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
            Nuestros servicios
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Soluciones profesionales para todos tus dispositivos
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {servicesData.map((service, index) => (
              <div key={index} className="flex-none w-80 snap-center">
                <div className="bg-white rounded-2xl p-8 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100 cursor-pointer flex flex-col justify-between min-h-[400px]">
                  {/* Icon */}
                  <div className="mb-6 text-gray-900 group-hover:scale-110 transition-transform duration-300">
                    {service.imageUrls && service.imageUrls.length > 0 ? (
                      <img
                        src={service.imageUrls[0]}
                        alt={service.serviceName}
                        className="w-12 h-12"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full" /> // ícono vacío si no hay imagen
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.serviceName}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-semibold text-gray-900">
                          {service.basePrice}
                        </span>
                        <span className="text-sm text-gray-500">desde</span>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <button className="mt-6 w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors duration-200">
                    Solicitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {servicesData.map((_, index) => (
              <button
                key={index}
                onClick={() => handleManualScroll(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-gray-900 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom styles for hiding scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Services;
