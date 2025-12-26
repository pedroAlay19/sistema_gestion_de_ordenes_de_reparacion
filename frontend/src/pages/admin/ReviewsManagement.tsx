import { useState, useEffect } from "react";
import { reviews } from "../../api/reviews";
import { TrashIcon, EyeIcon, EyeSlashIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import type { Review } from "../../types/review.types";

export default function ReviewsManagement() {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviews.findAll();
      setReviewsList(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar esta reseña?")) return;

    try {
      await reviews.delete(id);
      setReviewsList(reviewsList.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error al eliminar la reseña");
    }
  };

  const handleToggleVisible = async (review: Review) => {
    try {
      const updated = await reviews.update(review.id, { visible: !review.visible });
      setReviewsList(reviewsList.map((r) => (r.id === review.id ? updated : r)));
    } catch (error) {
      console.error("Error updating review visibility:", error);
      alert("Error al actualizar la visibilidad");
    }
  };

  const averageRating =
    reviewsList.length > 0
      ? reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Reseñas</h1>
            <p className="text-gray-400">
              Gestión de {reviewsList.length} reseñas de clientes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <div>
                <span className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</span>
                <span className="text-xs text-gray-500 ml-1">promedio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Calificación & Comentario
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Fecha
                      </span>
                    </th>
                    <th className="px-6 py-4 text-center">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Visibilidad
                      </span>
                    </th>
                    <th className="px-6 py-4 text-right">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Acciones
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {reviewsList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                            <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-600" />
                          </div>
                          <p className="text-gray-500 font-medium">No hay reseñas</p>
                          <p className="text-sm text-gray-600">Las reseñas de clientes aparecerán aquí</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reviewsList.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-700"
                                  }`}
                                />
                              ))}
                            </div>
                            {review.comment && (
                              <p className="text-sm text-gray-300 max-w-2xl">{review.comment}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleToggleVisible(review)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                                review.visible
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                                  : "bg-gray-800 text-gray-400 border border-gray-800 hover:bg-gray-700"
                              }`}
                            >
                              {review.visible ? (
                                <>
                                  <EyeIcon className="w-4 h-4" />
                                  Visible
                                </>
                              ) : (
                                <>
                                  <EyeSlashIcon className="w-4 h-4" />
                                  Oculta
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
