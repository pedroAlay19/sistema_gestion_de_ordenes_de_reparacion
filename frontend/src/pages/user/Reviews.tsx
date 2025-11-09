import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRepairOrders } from '../../api/api';
import type { RepairOrder } from '../../types/repair-order.types';

type Review = {
  orderId: string;
  equipmentName: string;
  status: string;
  completedAt: string;
  hasReview: boolean;
  rating?: number;
  comment?: string;
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const orders = await getRepairOrders();
      
      // Filtrar órdenes completadas o resueltas
      const completedOrders = orders.filter(
        (order: RepairOrder) => order.status === 'CLOSED' || order.status === 'RESOLVED'
      );

      const reviewData: Review[] = completedOrders.map((order: RepairOrder) => ({
        orderId: order.id,
        equipmentName: order.equipment.name,
        status: order.status,
        completedAt: order.updatedAt,
        hasReview: false, // TODO: Check if review exists when backend implements it
        rating: undefined,
        comment: undefined,
      }));

      setReviews(reviewData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const averageRating = reviews
    .filter(r => r.hasReview && r.rating)
    .reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.filter(r => r.hasReview).length || 0;

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
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Mis Reseñas</h1>
          <p className="text-gray-600">Historial de servicios completados y tus valoraciones</p>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {/* Average Rating Card */}
          {reviews.filter(r => r.hasReview).length > 0 && (
            <div className="bg-linear-to-br from-black to-gray-800 rounded-2xl p-8 mb-8 text-white">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-2xl ${
                          star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-white/70">Promedio General</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Tu Satisfacción</h3>
                  <p className="text-white/80 mb-4">
                    Has dejado {reviews.filter(r => r.hasReview).length} reseñas de {reviews.length} servicios completados
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold">{reviews.filter(r => r.hasReview).length}</div>
                      <div className="text-sm text-white/70">Reseñas</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold">{reviews.length - reviews.filter(r => r.hasReview).length}</div>
                      <div className="text-sm text-white/70">Pendientes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No hay servicios completados</h3>
              <p className="text-gray-600 mb-8">
                Cuando completes servicios de reparación, podrás dejar tu valoración aquí
              </p>
              <Link
                to="/user/repair-orders/new"
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors"
              >
                Solicitar Reparación
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.orderId}
                  className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {review.equipmentName}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              review.status === 'CLOSED'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}
                          >
                            {review.status === 'CLOSED' ? '✅ Entregado' : '🟣 Listo'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Completado el{' '}
                          {new Date(review.completedAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>

                      {/* Order Number */}
                      <Link
                        to={`/user/repair-orders/${review.orderId}`}
                        className="text-sm font-mono text-gray-600 hover:text-black transition-colors"
                      >
                        #ORD-{review.orderId.padStart(5, '0')}
                      </Link>
                    </div>

                    {/* Review Content */}
                    {review.hasReview ? (
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-xl ${
                                  star <= (review.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {review.rating}/5 estrellas
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-xl">✍️</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 mb-1">
                                Deja tu valoración
                              </p>
                              <p className="text-sm text-gray-600">
                                Comparte tu experiencia con este servicio
                              </p>
                            </div>
                          </div>
                          <Link
                            to={`/user/repair-orders/${review.orderId}`}
                            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors whitespace-nowrap"
                          >
                            Dejar Reseña
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
