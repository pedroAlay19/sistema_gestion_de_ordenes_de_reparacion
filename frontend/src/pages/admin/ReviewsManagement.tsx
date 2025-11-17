import { useState, useEffect } from "react";
import { admin } from "../../api/admin";
import { TrashIcon, MagnifyingGlassIcon, EyeIcon, EyeSlashIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import type { RepairOrderReview } from "../../types";

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<RepairOrderReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await admin.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar esta reseña?")) return;

    try {
      await admin.deleteReview(id);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error al eliminar la reseña");
    }
  };

  const handleToggleVisible = async (review: RepairOrderReview) => {
    try {
      const updated = await admin.updateReview(review.id, { visible: !review.visible });
      setReviews(reviews.map((r) => (r.id === review.id ? updated : r)));
    } catch (error) {
      console.error("Error updating review visibility:", error);
      alert("Error al actualizar la visibilidad");
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating - 1]++;
      }
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const visibleReviews = reviews.filter((r) => r.visible);
  const hiddenReviews = reviews.filter((r) => !r.visible);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reseñas</h1>
          <p className="text-gray-400 mt-1">Gestión de reseñas de clientes</p>
        </div>
        <button
          onClick={() => {
            setSidebarCollapsed(!sidebarCollapsed);
            const sidebar = document.querySelector('.lg\\:fixed.lg\\:inset-y-0') as HTMLElement;
            const mainContent = document.querySelector('.lg\\:pl-64') as HTMLElement;
            if (sidebar && mainContent) {
              if (!sidebarCollapsed) {
                sidebar.style.display = 'none';
                mainContent.style.paddingLeft = '0';
              } else {
                sidebar.style.display = 'flex';
                mainContent.style.paddingLeft = '16rem';
              }
            }
          }}
          className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
        >
          <Bars3Icon className="w-5 h-5" />
          {sidebarCollapsed ? 'Mostrar' : 'Ocultar'} Menú
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">Total Reseñas</p>
          <p className="text-2xl font-bold text-white mt-1">{reviews.length}</p>
        </div>
        <div className="bg-linear-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">Promedio</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-bold text-yellow-400">
              {averageRating.toFixed(1)}
            </p>
            <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        <div className="bg-linear-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">Positivas (4-5★)</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {reviews.filter((r) => r.rating >= 4).length}
          </p>
        </div>
        <div className="bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">Visibles</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{visibleReviews.length}</p>
        </div>
        <div className="bg-linear-to-br from-gray-500/20 to-slate-500/20 border border-gray-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">Ocultas</p>
          <p className="text-2xl font-bold text-gray-400 mt-1">{hiddenReviews.length}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por comentario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <StarIcon className="w-5 h-5 text-yellow-400" />
          Distribución de Calificaciones
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-gray-300 text-sm font-medium">{star}</span>
                <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="flex-1 bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-linear-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      reviews.length > 0
                        ? (ratingDistribution[star - 1] / reviews.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-gray-400 text-sm w-12 text-right font-medium">
                {ratingDistribution[star - 1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Calificación & Comentario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                Visibilidad
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  </div>
                </td>
              </tr>
            ) : filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                  No se encontraron reseñas
                </td>
              </tr>
            ) : (
              filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-gray-300 text-sm max-w-xl">{review.comment}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm">
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
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-gray-700 text-gray-400 hover:bg-gray-600"
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
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
    </div>
  );
}
