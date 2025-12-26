import { useState, useEffect, useRef, useCallback } from "react";
import { services } from "../api";
import type { Service } from "../types/service.types";
import { WrenchScrewdriverIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { equipmentTypes } from "../data/equipmentTypes";

const Services = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [servicesData, setServicesData] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const data = await services.getAll();
      setServicesData(data.filter(s => s.active)); // Solo mostrar servicios activos
      console.log(data);
    };

    fetchServices();
  }, []);

  const getEquipmentLabel = (value: string) => {
    return equipmentTypes.find(e => e.value === value)?.label || value;
  };

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
            Nuestros Servicios
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Soluciones profesionales especializadas para todos tus dispositivos electrónicos
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
              <div key={service.id || index} className="flex-none w-80 snap-center">
                <div className="bg-white rounded-2xl p-6 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-200 cursor-pointer flex flex-col justify-between min-h-[420px]">
                  
                  {/* Icon Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-lg">
                      <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="bg-gray-100 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
                      ${service.basePrice}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {service.serviceName}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    {/* Applicable Equipment Types */}
                    {service.applicableEquipmentTypes && service.applicableEquipmentTypes.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Compatible con:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {service.applicableEquipmentTypes.slice(0, 3).map((type) => (
                            <span
                              key={type}
                              className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg border border-gray-200"
                            >
                              {getEquipmentLabel(type)}
                            </span>
                          ))}
                          {service.applicableEquipmentTypes.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-lg">
                              +{service.applicableEquipmentTypes.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes/Features */}
                    {service.notes && (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
                        <div className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                            {service.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Info Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">
                        Precio base desde:
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${service.basePrice}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      *El precio final puede variar según diagnóstico
                    </p>
                  </div>
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
