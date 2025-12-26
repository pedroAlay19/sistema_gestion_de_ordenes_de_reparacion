import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reviews as reviewsApi } from "../../api";
import type { Review } from "../../types/review.types";
import {
  CalendarDaysIcon,
  PencilSquareIcon,
  StarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const loadReviews = async () => {
      try {
        const reviewsData = await reviewsApi.findAll();
        setReviews(reviewsData);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-900 text-xl font-medium">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-gray-800 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-1">Mis Reseñas</h1>
          <p className="text-gray-400">Valoraciones de servicios completados</p>
        </div>
      </div>

      <div className="p-8 bg-linear-to-br from-gray-50 to-gray-100 min-h-[calc(100vh-120px)]">
        <div className="max-w-6xl mx-auto">
          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-lg">
              <div className="w-24 h-24 bg-linear-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No tienes reseñas aún
              </h3>
              <p className="text-gray-600 mb-8">
                Solicita servicios de reparación y deja tu valoración
              </p>
              <Link
                to="/user/repair-orders/new"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
              >
                Solicitar Reparación
              </Link>
            </div>
          ) : (
            <>
              {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <PencilSquareIcon className="text-2xl text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Total Reseñas
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {reviews.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <StarIcon className="text-2xl text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Calificación Promedio
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(
                          reviews.reduce((acc, r) => acc + r.rating, 0) /
                          reviews.length
                        ).toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrophyIcon className="text-2xl text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Mejor Calificación
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.max(...reviews.map((r) => r.rating))}.0
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Grid */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                  >
                    <div className="flex items-start gap-6">
                      {/* Content */}
                      <div className="flex-1">
                        {/* Stars Row */}
                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-2xl ${
                                star <= review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        {/* Comment */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-blue-400">
                          <p className="text-gray-700 leading-relaxed text-base italic">
                            "{review.comment}"
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CalendarDaysIcon className="w-5 h-5" />
                            {new Date(review.createdAt).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-mono rounded-full">
                            #{review.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
